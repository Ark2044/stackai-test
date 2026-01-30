package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "stk",
	Short: "stk is your CLI tool",
	Long:  `stk is a simple CLI tool built with Cobra.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Welcome to stk CLI 🎉")
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
