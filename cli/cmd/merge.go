package cmd

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sdk/pkg/compressor"
	"strings"

	"github.com/spf13/cobra"
)

// mergeCmd represents the hello command
var mergeCmd = &cobra.Command{
	Use:   "merge",
	Short: "Merge 2 branches",
	Long:  `Used to merge 2 branches`,
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		otherBranch := args[0]
		runMerge(otherBranch)
	},
}

func runMerge(otherBranch string) {
	head, _ := os.ReadFile(".stk/HEAD")
	baseCommitBytes, _ := os.ReadFile(fmt.Sprintf(".stk/%s", head))
	baseCommit := strings.TrimSpace(string(baseCommitBytes))

	otherCommitBytes, _ := os.ReadFile(fmt.Sprintf(".stk/branches/%s", otherBranch))
	otherCommit := strings.TrimSpace(string(otherCommitBytes))

	baseCommitDataBytes, _ := compressor.GetDecompressFile(filepath.Join(".stk", "commits", baseCommit[:2], baseCommit[2:]))
	var baseCommitData Commit
	json.Unmarshal(baseCommitDataBytes, &baseCommitData)

	otherCommitDataBytes, _ := compressor.GetDecompressFile(filepath.Join(".stk", "commits", otherCommit[:2], otherCommit[2:]))
	var otherCommitData Commit
	json.Unmarshal(otherCommitDataBytes, &otherCommitData)

	baseTree := baseCommitData.Tree
	otherTree := otherCommitData.Tree

	mergingWithChild := isAncestor(baseCommit, otherCommit)
	mergingWithAncestor := isAncestor(otherCommit, baseCommit)

	if mergingWithChild {
		_ = os.WriteFile(fmt.Sprintf(".stk/%s", head), []byte(otherCommit), 0644)
	} else if mergingWithAncestor {
		return
	} else {
		mergeTrees(baseTree, otherTree)
	}
}

func mergeTrees(baseTreeId string, otherTreeId string) {
	currTreeData := []Tree{}

	var baseTree, otherTree []Tree
	baseHashTable := make(map[string]string)
	otherHashTable := make(map[string]string)

	baseTreeDataBytes, _ := compressor.GetDecompressFile(filepath.Join(".stk", "objects", "trees", baseTreeId[:2], baseTreeId[2:]))
	json.Unmarshal(baseTreeDataBytes, &baseTree)
	otherTreeDataBytes, _ := compressor.GetDecompressFile(filepath.Join(".stk", "objects", "trees", otherTreeId[:2], otherTreeId[2:]))
	json.Unmarshal(otherTreeDataBytes, &otherTree)

	for _, tree := range baseTree {
		baseHashTable[tree.Path] = tree.Hash
	}

	for _, tree := range otherTree {
		otherHashTable[tree.Path] = tree.Hash
		v, ok := baseHashTable[tree.Path]
		if ok && v != tree.Hash {
			fmt.Println("exists:", tree.Path, v, tree.Hash)
		} else {
			currTreeData = append(currTreeData, Tree{Type: tree.Type, Hash: tree.Hash, Path: tree.Path})
		}
	}

	fmt.Println(baseHashTable)
	fmt.Println(otherHashTable)
}

func isAncestor(baseCommit, otherCommit string) bool {
	if otherCommit == "" {
		return false
	}

	if baseCommit == otherCommit {
		return true
	}

	otherCommitDataBytes, _ := compressor.GetDecompressFile(filepath.Join(".stk", "commits", otherCommit[:2], otherCommit[2:]))
	var otherCommitData Commit
	json.Unmarshal(otherCommitDataBytes, &otherCommitData)
	return isAncestor(baseCommit, otherCommitData.Parent)
}

// func createMergedTree(entry NestedIndex, prefix string) string {

// 	currTreeData := []Tree{}

// 	return ""
// }

func init() {
	rootCmd.AddCommand(mergeCmd)
}

// d7c74f36ecc1bfd2f6737abfceea3ee509e9cbca907f49c4ea03935992a4ccca
// 035d5a90edd1c3f935d9b4572bc03ad732491b1942e5de7408d2d7423bb9db41

// [
//   {
//     "type": "model",
//     "path": "models/model.pt",
//     "hash": "a4fd8d613b949cf53ce321cce5b098d50ac4a58486b92b39a5c27bcce3cc937b",
//     "dist": "1"
//   }
// ]

// [
//   {
//     "type": "model",
//     "path": "models/model.pt",
//     "hash": "a4fd8d613b949cf53ce321cce5b098d50ac4a58486b92b39a5c27bcce3cc937b",
//     "dist": "0"
//   }
// ]
