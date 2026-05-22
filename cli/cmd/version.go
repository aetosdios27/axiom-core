package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// These variables are set at build time via ldflags.
var (
	Version   = "dev"
	Commit    = "none"
	BuildDate = "unknown"
)

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version of Axiom CLI",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("axiom %s\n", Version)
		fmt.Printf("  commit:  %s\n", Commit)
		fmt.Printf("  built:   %s\n", BuildDate)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
