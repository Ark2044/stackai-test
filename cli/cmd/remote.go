package cmd

import (
	"encoding/json"
	"os"

	"github.com/spf13/cobra"
)

type Remote struct {
	Origin string `json:"origin"`
}

// helloCmd represents the hello command
var remoteCmd = &cobra.Command{
	Use:   "hello",
	Short: "Calls hello API with your saved token",
	Long:  `Calls a protected hello API endpoint using the bearer token saved in the system keyring.`,
	Run: func(cmd *cobra.Command, args []string) {
		origin := args[1]
		setOrigin(origin)
	},
}

func setOrigin(origin string) {

	remote := Remote{Origin: origin}
	remoteJson, _ := json.MarshalIndent(remote, "", "  ")

	err := os.WriteFile(".stk/remote.json", remoteJson, 0644)
	if err != nil {
		panic(err)
	}
}

func init() {
	rootCmd.AddCommand(remoteCmd)
}
