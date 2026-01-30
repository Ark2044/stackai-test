package cmd

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sdk/pkg/compressor"
	"sdk/pkg/hasher"
	"sort"
	"strings"

	"github.com/spf13/cobra"
)

var commitMessage string

type Tree struct {
	Type string `json:"type"`
	Path string `json:"path"`
	Hash string `json:"hash"`
}

type Commit struct {
	Tree    string `json:"tree"`
	Message string `json:"message"`
	Parent  string `json:"parent"`
}

var commitCmd = &cobra.Command{
	Use:   "commit",
	Short: "Save a commit",
	Long:  `This command commits the given file or directory path.`,
	Run: func(cmd *cobra.Command, args []string) {
		runCommit()
	},
}

func runCommit() {

	index := make(NestedIndex)
	modelIndex := make(NestedIndex)

	data, err := os.ReadFile(".stk/index.json")
	if err != nil {
		log.Fatal("Error in reading index", data)
		return
	}
	json.Unmarshal(data, &index)

	data, err = os.ReadFile(".stk/model_index.json")
	if err != nil {
		log.Fatal("Error in reading model index", data)
		return
	}
	json.Unmarshal(data, &modelIndex)

	hash := createTree(index, "", modelIndex)

	branch, _ := os.ReadFile(".stk/HEAD")
	currCommitBytes, _ := os.ReadFile(fmt.Sprintf(".stk/%s", branch))
	currCommit := strings.TrimSpace(string(currCommitBytes))

	commit := Commit{Tree: hash, Message: commitMessage, Parent: currCommit}

	hash = createCommitFile(commit)
	fmt.Println(string(branch))
	_ = os.WriteFile(fmt.Sprintf(".stk/%s", string(branch)), []byte(hash), 0644)
}

func createTree(entry NestedIndex, prefix string, modelIndex NestedIndex) string {

	currTreeData := []Tree{}

	keys := make([]string, 0, len(entry))
	for k := range entry {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	for _, key := range keys {
		val := entry[key]
		if m, ok := val.(map[string]interface{}); ok {
			if _, hasHash := m["hash"]; hasHash {
				hash, _ := m["hash"].(string)
				path, _ := m["path"].(string)

				if strings.HasPrefix(path, "models/") {
					modelTreeHash := createModelTree(path, modelIndex)
					currTreeData = append(currTreeData, Tree{Type: "model", Hash: modelTreeHash, Path: path})
				} else {
					currTreeData = append(currTreeData, Tree{Type: "blob", Hash: hash, Path: path})
				}
			} else {
				childTreePath := fmt.Sprintf("%s/%s", prefix, key)
				childTreeHash := createTree(NestedIndex(m), childTreePath, modelIndex)
				currTreeData = append(currTreeData, Tree{Type: "tree", Hash: childTreeHash, Path: childTreePath})
			}
		}
	}

	currHash := createTreeFile(currTreeData)
	return currHash
}

func createModelTree(path string, modelIndex NestedIndex) string {
	jsonModelTree, _ := json.MarshalIndent(modelIndex[path], "", "  ")
	digest := hasher.HashData(jsonModelTree)
	blobPath := fmt.Sprintf(".stk/models/%s/%s", digest[:2], digest[2:])
	compressor.CompressData(jsonModelTree, blobPath)

	return digest
}

func createCommitFile(commitData Commit) string {
	jsonCommitData, _ := json.MarshalIndent(commitData, "", "  ")
	digest := hasher.HashData(jsonCommitData)
	blobPath := fmt.Sprintf(".stk/commits/%s/%s", digest[:2], digest[2:])
	compressor.CompressData(jsonCommitData, blobPath)
	return digest
}

func createTreeFile(treeData []Tree) string {
	jsonTreeData, _ := json.MarshalIndent(treeData, "", "  ")
	digest := hasher.HashData(jsonTreeData)                                     // Hash the file
	blobPath := fmt.Sprintf(".stk/objects/trees/%s/%s", digest[:2], digest[2:]) // Creates a blank file with the hash as filename
	compressor.CompressData(jsonTreeData, blobPath)                             // stores the compressed file in the blank file
	return digest
}

func init() {
	rootCmd.AddCommand(commitCmd)

	commitCmd.Flags().StringVarP(&commitMessage, "message", "m", "", "Commit message")
	commitCmd.MarkFlagRequired("message")
}
