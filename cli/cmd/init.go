package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"sdk/pkg/helpers"

	"github.com/spf13/cobra"
)

// initCmd represents the init command
var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialises Repositry",
	Run: func(cmd *cobra.Command, args []string) {
		dir, err := os.Getwd()
		if err != nil {
			fmt.Println("Error:", err)
			return
		}

		dirs := []string{
			filepath.Join(dir, ".stk", "branches"),
			filepath.Join(dir, ".stk", "commits"),
			filepath.Join(dir, ".stk", "objects"),
			filepath.Join(dir, ".stk", "objects", "blobs"),
			filepath.Join(dir, ".stk", "objects", "trees"),
			filepath.Join(dir, ".stk", "objects", "models"),
		}

		// Create directories
		for _, dir := range dirs {
			if err := os.MkdirAll(dir, 0755); err != nil {
				helpers.PrintError("failed to create dir %s: %w", dir, err)
			}
		}

		// Create files
		files := map[string]string{
			filepath.Join(dir, ".stk", "HEAD"):             "branches/main",
			filepath.Join(dir, ".stk", "branches", "main"): "",
			filepath.Join(dir, ".stk", "index.json"):       "",
			filepath.Join(dir, ".stk", "model_index.json"): "",
			filepath.Join(dir, ".stk", "remote.json"):      `{"origin": ""}`,
		}

		for path, content := range files {
			if _, err := os.Stat(path); os.IsNotExist(err) {
				if err := os.WriteFile(path, []byte(content), 0644); err != nil {
					helpers.PrintError("failed to create dir %s: %w", dir, err)
				}
			}
		}

	},
}

func init() {
	rootCmd.AddCommand(initCmd)
}
