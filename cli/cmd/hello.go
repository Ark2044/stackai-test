package cmd

import (
	"fmt"
	"io"
	"net/http"

	"github.com/spf13/cobra"
	"github.com/zalando/go-keyring"
)

// helloCmd represents the hello command
var helloCmd = &cobra.Command{
	Use:   "hello",
	Short: "Calls hello API with your saved token",
	Long:  `Calls a protected hello API endpoint using the bearer token saved in the system keyring.`,
	Run: func(cmd *cobra.Command, args []string) {

		token, err := keyring.Get("stackai", "token")
		if err != nil {
			fmt.Println("❌ No token found. Please login first.")
			return
		}

		url := "http://localhost:3000/api/cli/hello"
		req, err := http.NewRequest("POST", url, nil)
		if err != nil {
			fmt.Println("Error creating request:", err)
			return
		}

		fmt.Println(token)
		req.Header.Set("Authorization", "Bearer "+token)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println("Error calling API:", err)
			return
		}
		defer resp.Body.Close()

		body, _ := io.ReadAll(resp.Body)
		fmt.Println(string(body))
	},
}

func init() {
	rootCmd.AddCommand(helloCmd)
}
