package cmd

import (
	"fmt"
	"sdk/pkg/aws"

	"github.com/spf13/cobra"
)

// helloCmd represents the hello command
var testCmd = &cobra.Command{
	Use:   "test",
	Short: "test",
	Long:  `test`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println(aws.RepoExists("testRepo/"))
	},
}

func init() {
	rootCmd.AddCommand(testCmd)
}
