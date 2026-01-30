package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/fatih/color"
	"github.com/google/uuid"
	"github.com/spf13/cobra"
	"github.com/zalando/go-keyring"
)

// const service = "stackai-cli"

type TokenResponse struct {
	Token    string `json:"token"`
	Username string `json:"username"`
}

// loginCmd represents the login command
var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "Logs in to your account",
	Long:  `Logs in to your account`,

	Run: func(cmd *cobra.Command, args []string) {
		sessionID := uuid.NewString()
		fmt.Println("Session ID:", sessionID)

		loginURL := fmt.Sprintf("http://localhost:3000/auth/cli?sessionId=%s", sessionID)
		fmt.Println("Visit this URL to login:", loginURL)

		url := "http://localhost:3000/api/getToken"
		data := []byte(fmt.Sprintf(`{"sessionId":"%s"}`, sessionID))

		for {
			resp, err := http.Post(url, "application/json", bytes.NewBuffer(data))
			if err != nil {
				fmt.Println("Error calling API:", err)
				time.Sleep(5 * time.Second)
				continue
			}
			defer resp.Body.Close()

			if resp.StatusCode == http.StatusOK {
				body, _ := io.ReadAll(resp.Body)
				var result TokenResponse
				if err := json.Unmarshal(body, &result); err != nil {
					fmt.Println("Error parsing JSON:", err)
					break
				}

				fmt.Println("token:", result.Token)

				if err := keyring.Set("stackai", "token", result.Token); err != nil {
					fmt.Println("Error saving token in keyring:", err)
					return
				}

				if err := keyring.Set("stackai", "username", result.Token); err != nil {
					fmt.Println("Error saving username in keyring:", err)
					return
				}

				green := color.New(color.FgGreen).Add(color.Bold).SprintFunc()
				blue := color.New(color.FgCyan).SprintFunc()

				fmt.Println()
				fmt.Println(green("✔ Login Successful"))
				fmt.Printf("   Welcome, %s 🎉\n", blue(result.Username))
				fmt.Println()

				break
			}

			time.Sleep(5 * time.Second)
		}
	},
}

func init() {
	rootCmd.AddCommand(loginCmd)
}
