package cmd

import (
	"encoding/json"
	"fmt"
	"os"
	"sdk/pkg/aws"
	"sdk/pkg/compressor"
	"strings"

	"github.com/spf13/cobra"
)

// helloCmd represents the hello command
var pushCmd = &cobra.Command{
	Use:   "push",
	Short: "push",
	Long:  `push`,
	Run: func(cmd *cobra.Command, args []string) {
		pushChanges()
	},
}

func getParentCommit(commit string) string {
	var parentCommit Commit
	commitPath := fmt.Sprintf(".stk/commits/%s/%s", commit[:2], commit[2:])
	byteCommit, _ := compressor.DecompressFile(commitPath, "")
	json.Unmarshal(byteCommit, &parentCommit)
	return parentCommit.Parent
}

func pushChanges() {
	if !aws.RepoExists("testRepo2/") {
		pushAll()
	} else {
		branch, _ := os.ReadFile(".stk/HEAD")
		currCommitBytes, _ := os.ReadFile(fmt.Sprintf(".stk/%s", branch))
		currCommit := strings.TrimSpace(string(currCommitBytes))
		remoteCommit := aws.GetRemoteCommit(string(branch))
		var prevCommit string
		var remainingCommits []string

		if remoteCommit != currCommit {
			parentCommit := getParentCommit(currCommit)

			for {
				if remoteCommit == parentCommit {
					break
				} else {
					prevCommit = parentCommit
					_ = append(remainingCommits, prevCommit)
					parentCommit = getParentCommit(parentCommit)
				}
			}
		}

		pushCommit(prevCommit)

		// prev
	}
}

func pushCommit(commit string) {}

func pushAll() {
	aws.PushFolder(".stk")
}

func init() {
	rootCmd.AddCommand(pushCmd)
}
