package cmd

import (
	"fmt"
	"path/filepath"
	"strings"

	"github.com/aetosdios27/axiom-core/cli/internal/registry"
	"github.com/aetosdios27/axiom-core/cli/internal/writer"
	"github.com/spf13/cobra"
)

var (
	initFormat string
	initOutput string
)

var initCmd = &cobra.Command{
	Use:   "init <rule-id>",
	Short: "Fetch a rule and write it to your project",
	Long: `Fetch a rule from the Axiom registry and write agent configuration
files to your project directory.

Supported formats: ` + strings.Join(writer.ListFormats(), ", ") + `, all

Examples:
  axiom init go-standard
  axiom init typescript-strict --format claude
  axiom init go-standard --format all --output ./my-project`,
	Args: cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		ruleID := args[0]

		baseURL := registryURL
		if baseURL == "" {
			baseURL = registry.DefaultBaseURL
		}

		if verbose {
			fmt.Printf("→ Fetching rule %q from %s\n", ruleID, baseURL)
		}

		rule, err := registry.FetchRule(baseURL, ruleID)
		if err != nil {
			return fmt.Errorf("failed to fetch rule: %w", err)
		}

		if verbose {
			fmt.Printf("→ Loaded: %s v%s (%s)\n", rule.Name, rule.Version, rule.Ecosystem)
		}

		// Determine which writers to use
		var writers []writer.Writer

		if initFormat == "all" {
			writers = writer.GetAll()
		} else {
			w, err := writer.Get(initFormat)
			if err != nil {
				return err
			}
			writers = []writer.Writer{w}
		}

		// Write the rule in each format
		for _, w := range writers {
			path, err := w.Write(rule, initOutput)
			if err != nil {
				return fmt.Errorf("writing %s format: %w", w.Format(), err)
			}
			
			absPath, err := filepath.Abs(path)
			if err != nil {
				absPath = path // fallback
			}
			
			fmt.Printf("  ✓ %s → %s\n", w.Format(), absPath)
		}

		fmt.Printf("\n  ✓ Done. %s v%s applied.\n", rule.Name, rule.Version)
		return nil
	},
}

func init() {
	initCmd.Flags().StringVarP(&initFormat, "format", "f", "cursor", "Output format ("+strings.Join(writer.ListFormats(), ", ")+", all)")
	initCmd.Flags().StringVarP(&initOutput, "output", "o", ".", "Output directory")
	rootCmd.AddCommand(initCmd)
}
