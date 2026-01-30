package cmd

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"sdk/pkg/compressor"
	"sdk/pkg/hasher"
	"strings"

	fastcdc "github.com/jotfs/fastcdc-go"
	"github.com/spf13/cobra"
)

//go:embed scripts/extract_model.py
var extractPy []byte

type FileData struct {
	Hash string `json:"hash"`
	Path string `json:"path"`
}

type ModelMetadata struct {
	Models []string       `json:"models"`
	Index  map[string]int `json:"index"`
}

type ModelManifest struct {
	Metadata     string   `json:"metadata"`
	Architecture string   `json:"architecture"`
	Chunks       []string `json:"chunks"`
}

type NestedIndex map[string]interface{}

var addCmd = &cobra.Command{
	Use:   "add [path]",
	Short: "Add a file or directory in your repo",
	Long:  `This command processes the given file or directory path.`,
	Args:  cobra.ExactArgs(1), // ensure exactly 1 arg
	Run: func(cmd *cobra.Command, args []string) {
		path := args[0]
		addFiles(path)
	},
}

func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	return err == nil || !os.IsNotExist(err)
}

func addFiles(rootPath string) {
	index := make(NestedIndex)
	modelIndex := make(NestedIndex)

	tmpDir, err := os.MkdirTemp("", "stk-*")
	if err != nil {
		fmt.Println(err)
		return
	}

	scriptPath := filepath.Join(tmpDir, "extract_model.py")
	if err := os.WriteFile(scriptPath, extractPy, 0o755); err != nil {
		return
	}
	// defer os.RemoveAll(tmpDir)

	walkErr := filepath.WalkDir(rootPath, func(path string, d fs.DirEntry, err error) error {

		if err != nil {
			log.Println("Error accessing:", path, err)
			return nil
		}

		if d.IsDir() && path != "." && d.Name()[0] == '.' {
			return filepath.SkipDir
		}

		if !d.IsDir() && d.Name()[0] == '.' {
			return nil
		}

		if !d.IsDir() && strings.HasPrefix(path, "models/") {

			absPath, _ := filepath.Abs(path)
			pythonPath := "/home/joyvin/miniforge3/envs/ml/bin/python"
			cmd := exec.Command(pythonPath, scriptPath, absPath)
			cmd.Dir = tmpDir
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr

			if err := cmd.Run(); err != nil {
				fmt.Println("err")

				return err
			}

			fmt.Println("Saved in:", tmpDir)

			updateIndex(index, path, "")
			manifest := updateModelIndex(tmpDir, rootPath)
			modelIndex[path] = manifest

		} else if !d.IsDir() {
			digest := hasher.HashFile(path)
			blobPath := fmt.Sprintf("%s/.stk/objects/blobs/%s/%s", rootPath, digest[:2], digest[2:])
			fmt.Println(path)
			createObject(path, blobPath)
			updateIndex(index, path, digest)
		}

		return nil
	})

	if walkErr != nil {
		log.Fatal("Error walking directory:", walkErr)
	}

	fmt.Println(index)
	jsonIndex, err := json.MarshalIndent(index, "", "  ")
	if err != nil {
		panic(err)
	}

	err = os.WriteFile(".stk/index.json", jsonIndex, 0644)
	if err != nil {
		panic(err)
	}

	jsonModelIndex, err := json.MarshalIndent(modelIndex, "", "  ")
	if err != nil {
		panic(err)
	}

	err = os.WriteFile(".stk/model_index.json", jsonModelIndex, 0644)
	if err != nil {
		panic(err)
	}

}

func createObject(path string, blobPath string) {
	compressor.CompressFile(path, blobPath)
}

func updateIndex(index NestedIndex, path string, hash string) {
	f := FileData{Hash: hash, Path: path}
	parts := strings.Split(path, "/")
	current := index
	for i, part := range parts {
		if i == len(parts)-1 {
			current[part] = f
		} else {
			if _, ok := current[part]; !ok {
				current[part] = make(NestedIndex)
			}
			current = current[part].(NestedIndex)
		}
	}
	fmt.Println("---------Start-----------")
	fmt.Println(current)
	fmt.Println("---------End-----------")
}

func updateModelIndex(tmpDir string, rootPath string) ModelManifest {
	var path, digest, blobPath string
	manifest := ModelManifest{Chunks: []string{}, Architecture: "", Metadata: ""}

	path = filepath.Join(tmpDir, "architecture.json")
	digest = hasher.HashFile(path)
	blobPath = fmt.Sprintf("%s/.stk/objects/blobs/%s/%s", rootPath, digest[:2], digest[2:])
	compressor.CompressFile(path, blobPath)
	manifest.Architecture = digest
	// os.Remove(path)

	path = filepath.Join(tmpDir, "metadata.json")
	digest = hasher.HashFile(path)
	blobPath = fmt.Sprintf("%s/.stk/objects/blobs/%s/%s", rootPath, digest[:2], digest[2:])
	compressor.CompressFile(path, blobPath)
	manifest.Metadata = digest
	// os.Remove(path)

	path = filepath.Join(tmpDir, "weights.safetensors")
	manifest.Chunks = chunkAndStore(path, rootPath)
	// os.Remove(path)

	return manifest
}

func chunkAndStore(tensorsPath string, rootPath string) []string {
	var chunks []string

	opts := fastcdc.Options{
		MinSize:     4 * 1024,
		AverageSize: 32 * 1024,
		MaxSize:     256 * 1024,
	}

	tensors, _ := os.ReadFile(tensorsPath)
	chunker, _ := fastcdc.NewChunker(bytes.NewReader(tensors), opts)

	for {
		chunk, err := chunker.Next()
		digest := hasher.HashData(chunk.Data)
		blobPath := fmt.Sprintf("%s/.stk/objects/blobs/%s/%s", rootPath, digest[:2], digest[2:])
		compressor.CompressData(chunk.Data, blobPath)
		chunks = append(chunks, digest)
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

	}

	return chunks

}

func init() {
	rootCmd.AddCommand(addCmd)
}
