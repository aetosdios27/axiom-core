package cmd

import (
	"github.com/spf13/cobra"
)

var (
	registryURL string
	verbose     bool
)

var rootCmd = &cobra.Command{
	Use:   "axiom",
	Short: "The immutable system of truth for AI agent style guides",
	Long: `
   ▄▀▄ ▀▄▀  █  ▄▀▄ █▄ ▄█
   █▀█ █ █  █  █ █ █ ▀ █
   ▀ ▀ ▀ ▀  ▀   ▀  ▀   ▀ 

   Axiom — fetch, validate, and write production-grade
   coding standards for any AI agent platform.

   Supports: Cursor, Windsurf, Claude Code, GitHub Copilot,
   Cline, Codex (AGENTS.md), and Zed.`,
	CompletionOptions: cobra.CompletionOptions{
		DisableDefaultCmd: true,
	},
}

func init() {
	rootCmd.PersistentFlags().StringVar(&registryURL, "registry", "", "Registry path or URL (default: raw GitHub)")
	rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "Enable verbose output")
}

// Execute runs the root command.
func Execute() error {
	return rootCmd.Execute()
}
