package cmd

import (
	"fmt"
	"strings"
	"text/tabwriter"
	"os"

	"github.com/aetosdios27/axiom-core/cli/internal/registry"
	"github.com/aetosdios27/axiom-core/cli/internal/writer"
	"github.com/spf13/cobra"
)

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all available rules in the registry",
	Long: `List all rules available in the Axiom registry.

Requires a local registry path (use --registry flag).

Examples:
  axiom list --registry ../registry/rules
  axiom list --registry /path/to/local/rules`,
	RunE: func(cmd *cobra.Command, args []string) error {
		baseURL := registryURL
		if baseURL == "" {
			return fmt.Errorf("--registry flag is required for listing (provide a local directory path)")
		}

		rules, err := registry.ListRules(baseURL)
		if err != nil {
			return fmt.Errorf("failed to list rules: %w", err)
		}

		if len(rules) == 0 {
			fmt.Println("  No rules found in the registry.")
			return nil
		}

		// Print header
		fmt.Printf("\n  Axiom Registry — %d rule(s)\n", len(rules))
		fmt.Println(strings.Repeat("─", 72))

		// Table output
		tw := tabwriter.NewWriter(os.Stdout, 2, 4, 3, ' ', 0)
		fmt.Fprintf(tw, "  ID\tNAME\tECOSYSTEM\tVERSION\n")
		fmt.Fprintf(tw, "  %s\t%s\t%s\t%s\n",
			strings.Repeat("─", 20),
			strings.Repeat("─", 24),
			strings.Repeat("─", 12),
			strings.Repeat("─", 8),
		)

		for _, rule := range rules {
			fmt.Fprintf(tw, "  %s\t%s\t%s\t%s\n",
				rule.ID, rule.Name, rule.Ecosystem, rule.Version,
			)
		}
		tw.Flush()

		// Print supported formats
		fmt.Printf("\n  Supported formats: %s\n\n", strings.Join(writer.ListFormats(), ", "))

		return nil
	},
}

func init() {
	rootCmd.AddCommand(listCmd)
}
