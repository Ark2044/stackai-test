package cmd

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/spf13/cobra"
)

var (
	deleteFlag bool
	forceFlag  bool
	moveFlag   bool
)

// branchCmd defines the "branch" command
var branchCmd = &cobra.Command{
	Use:   "branch [branch_name]",
	Short: "Manage branches",
	Long:  `Create, list, delete, or rename branches.`,
	Run: func(cmd *cobra.Command, args []string) {
		runBranch(args)
	},
}

func runBranch(args []string) {
	switch {
	case moveFlag:
		// Rename: mygit branch -m old new
		if len(args) != 2 {
			log.Fatal("Usage: mygit branch -m <old> <new>")
		}
		renameBranch(args[0], args[1])

	case deleteFlag:
		// Delete: mygit branch -d name
		if len(args) != 1 {
			log.Fatal("Usage: mygit branch -d <branch>")
		}
		deleteBranch(args[0], forceFlag)

	case len(args) == 0:
		// List branches
		listBranches()

	case len(args) == 1:
		// Create a new branch
		createBranch(args[0])

	default:
		log.Fatal("Invalid usage. Run 'mygit branch --help' for details.")
	}
}

func listBranches() {
	head, _ := os.ReadFile(".stk/HEAD")
	currentBranch := strings.Split(string(head), "/")[1]

	files, err := os.ReadDir(".stk/branches/")
	if err != nil {
		log.Fatal("Error reading branches: ", err)
	}

	for _, f := range files {
		if f.Name() == currentBranch {
			fmt.Printf("* %s\n", f.Name())
		} else {
			fmt.Println("  " + f.Name())
		}
	}
}

func createBranch(name string) {
	branch, _ := os.ReadFile(".stk/HEAD")
	currCommitBytes, _ := os.ReadFile(fmt.Sprintf(".stk/%s", branch))
	currCommit := strings.TrimSpace(string(currCommitBytes))

	path := fmt.Sprintf(".stk/branches/%s", name)
	if _, err := os.Stat(path); err == nil {
		log.Fatalf("Branch '%s' already exists.", name)
	}

	err := os.WriteFile(path, []byte(currCommit), 0644)
	if err != nil {
		log.Fatal("Error creating branch: ", err)
	}

	fmt.Println("Created branch:", name)
}

func deleteBranch(name string, force bool) {
	path := fmt.Sprintf(".stk/refs/heads/%s", name)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		log.Fatalf("Branch '%s' does not exist.", name)
	}

	if err := os.Remove(path); err != nil {
		log.Fatal("Error deleting branch:", err)
	}

	fmt.Println("Deleted branch:", name)
}

func renameBranch(oldName, newName string) {
	oldPath := fmt.Sprintf(".stk/refs/heads/%s", oldName)
	newPath := fmt.Sprintf(".stk/refs/heads/%s", newName)

	if _, err := os.Stat(oldPath); os.IsNotExist(err) {
		log.Fatalf("Branch '%s' does not exist.", oldName)
	}

	if err := os.Rename(oldPath, newPath); err != nil {
		log.Fatal("Error renaming branch:", err)
	}

	fmt.Printf("Renamed branch '%s' to '%s'\n", oldName, newName)
}

func init() {
	rootCmd.AddCommand(branchCmd)
	branchCmd.Flags().BoolVarP(&deleteFlag, "delete", "d", false, "Delete branch")
	branchCmd.Flags().BoolVarP(&forceFlag, "force", "D", false, "Force delete branch")
	branchCmd.Flags().BoolVarP(&moveFlag, "move", "m", false, "Rename branch")
}
