package helpers

import (
	"fmt"
	"strings"

	"github.com/fatih/color"
)

func Capitalize(s string) string {
	return strings.Title(s)
}

func PrintSuccess(format string, a ...interface{}) {
	green := color.New(color.FgGreen).Add(color.Bold).SprintFunc()
	message := fmt.Sprintf(format, a...)
	fmt.Println(green("✔ " + message))
}

func PrintInfo(format string, a ...interface{}) {
	cyan := color.New(color.FgCyan).SprintFunc()
	message := fmt.Sprintf(format, a...)
	fmt.Println(cyan("ℹ " + message))
}

func PrintError(format string, a ...interface{}) {
	red := color.New(color.FgRed).Add(color.Bold).SprintFunc()
	message := fmt.Sprintf(format, a...)
	fmt.Println(red("❌ " + message))
}
