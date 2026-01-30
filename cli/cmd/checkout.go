package cmd

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"sdk/pkg/compressor"
	"strings"

	"github.com/spf13/cobra"
)

//go:embed scripts/rebuild_model.py
var rebuildPy []byte

var newBranch bool

var checkoutCmd = &cobra.Command{
	Use:   "checkout [branch-name]",
	Short: "Switch branches or restore working tree files",
	Long: `Switch to a specified branch or create a new one using the -b flag.
Example:
  stk checkout main          # switch to existing branch
  stk checkout -b feature-x  # create and switch to new branch`,
	Args: cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		branch := args[0]
		runCheckout(branch)
	},
}

func runCheckout(branch string) {
	branchPath := filepath.Join(".stk", "branches", branch)
	tmpDir, _ := os.MkdirTemp("", "stk-*")

	scriptPath := filepath.Join(tmpDir, "rebuild_model.py")
	if err := os.WriteFile(scriptPath, rebuildPy, 0o755); err != nil {
		return
	}

	if newBranch {
		head, _ := os.ReadFile(".stk/HEAD")
		currCommitBytes, _ := os.ReadFile(fmt.Sprintf(".stk/%s", head))
		currCommit := strings.TrimSpace(string(currCommitBytes))

		path := fmt.Sprintf(".stk/branches/%s", branch)
		if _, err := os.Stat(path); err == nil {
			log.Fatalf("Branch '%s' already exists.", branch)
		}

		err := os.WriteFile(path, []byte(currCommit), 0644)
		if err != nil {
			log.Fatal("Error creating branch: ", err)
		}

		fmt.Println("Created branch:", branch)
	} else {
		// Check if branch exists
		if _, err := os.Stat(branchPath); os.IsNotExist(err) {
			log.Fatalf("Branch '%s' does not exist. Use -b to create it.", branch)
		}
	}

	// Update HEAD to point to the branch
	err := os.WriteFile(".stk/HEAD", []byte(fmt.Sprintf("branches/%s", branch)), 0644)
	if err != nil {
		log.Fatalf("Error updating HEAD: %v", err)
	}

	entries, _ := os.ReadDir(".")
	for _, e := range entries {
		if e.Name() == ".stk" {
			continue
		}
		os.RemoveAll(e.Name())
	}

	currCommitBytes, _ := os.ReadFile(branchPath)
	currCommit := strings.TrimSpace(string(currCommitBytes))

	commitDataBytes, _ := compressor.GetDecompressFile(filepath.Join(".stk", "commits", currCommit[:2], currCommit[2:]))
	var commitData Commit
	json.Unmarshal(commitDataBytes, &commitData)

	restoreTree(commitData.Tree, ".", tmpDir)

	fmt.Printf("Switched to branch '%s'\n", branch)
}

func restoreTree(treeHash, prefix string, tmpDir string) {
	treeBytes, _ := compressor.GetDecompressFile(fmt.Sprintf(".stk/objects/trees/%s/%s", treeHash[:2], treeHash[2:]))
	var entries []Tree
	json.Unmarshal(treeBytes, &entries)
	var models []Tree

	for _, entry := range entries {
		switch entry.Type {
		case "blob":
			var blobPath string

			blobPath = fmt.Sprintf(".stk/objects/blobs/%s/%s", entry.Hash[:2], entry.Hash[2:])

			data, _ := compressor.GetDecompressFile(blobPath) // returns []byte
			outPath := filepath.Join(prefix, entry.Path)
			os.MkdirAll(filepath.Dir(outPath), 0755)
			os.WriteFile(outPath, data, 0644)

		case "tree":
			restoreTree(entry.Hash, prefix, tmpDir)

		case "model":
			models = append(models, entry)
		}

	}

	for _, model := range models {
		manifestDataBytes, _ := compressor.GetDecompressFile(fmt.Sprintf(".stk/models/%s/%s", model.Hash[:2], model.Hash[2:]))
		var manifestData ModelManifest
		json.Unmarshal(manifestDataBytes, &manifestData)

		archData := fmt.Sprintf(".stk/objects/blobs/%s/%s", manifestData.Architecture[:2], manifestData.Architecture[2:])
		metadataData := fmt.Sprintf(".stk/objects/blobs/%s/%s", manifestData.Metadata[:2], manifestData.Metadata[2:])

		archFile := filepath.Join(tmpDir, "architecture.json")
		metadataFile := filepath.Join(tmpDir, "metadata.json")
		tensorFile := restoreChunks(manifestData.Chunks, tmpDir)

		compressor.DecompressFile(archData, archFile)
		compressor.DecompressFile(metadataData, metadataFile)

		fmt.Println(archFile)

		os.Mkdir("models", 0755)

		scriptPath := filepath.Join(tmpDir, "rebuild_model.py")
		pythonPath := "/home/joyvin/miniforge3/envs/ml/bin/python"
		absPath, _ := filepath.Abs(model.Path)
		cmd := exec.Command(pythonPath, scriptPath, tensorFile, archFile, metadataFile, absPath)
		cmd.Dir = tmpDir
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		if err := cmd.Run(); err != nil {
			fmt.Println("err")
			return
		}

		fmt.Println("Saved in:", model.Path)

	}
}

func restoreChunks(chunks []string, tmpDir string) string {
	tensorPath := filepath.Join(tmpDir, "weights.safetensors")
	out, _ := os.Create(tensorPath)

	for _, chunk := range chunks {
		chunkFile := fmt.Sprintf(".stk/objects/blobs/%s/%s", chunk[:2], chunk[2:])
		data, _ := compressor.GetDecompressFile(chunkFile)

		out.Write(data)
	}

	return tensorPath

}

func init() {
	rootCmd.AddCommand(checkoutCmd)
	checkoutCmd.Flags().BoolVarP(&newBranch, "branch", "b", false, "Create a new branch and switch to it")
}
