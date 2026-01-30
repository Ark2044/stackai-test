package cmd

import (
	"sdk/pkg/compressor"

	"github.com/spf13/cobra"
)

var showCmd = &cobra.Command{
	Use:   "show",
	Short: "show compressed files",
	Long:  `show`,
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		path := args[0]
		showFiles(path)
	},
}

func showFiles(path string) {
	compressor.DecompressFile(path, "../show.json")
}

func init() {
	rootCmd.AddCommand(showCmd)
}
