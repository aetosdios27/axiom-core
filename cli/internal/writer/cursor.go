package writer

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/aetosdios27/axiom-core/cli/internal/schema"
)

// CursorWriter writes rules in Cursor's .mdc format with YAML frontmatter.
type CursorWriter struct{}

func (w *CursorWriter) Format() string      { return "cursor" }
func (w *CursorWriter) Description() string { return ".cursor/rules/{id}.mdc" }

func (w *CursorWriter) Write(rule *schema.Rule, outputDir string) (string, error) {
	dir := filepath.Join(outputDir, ".cursor", "rules")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return "", fmt.Errorf("creating .cursor/rules directory: %w", err)
	}

	filePath := filepath.Join(dir, rule.ID+".mdc")

	var b strings.Builder

	// YAML frontmatter
	b.WriteString("---\n")
	b.WriteString(fmt.Sprintf("description: %s\n", rule.Name))
	b.WriteString(fmt.Sprintf("globs: %s\n", strings.Join(rule.CLITarget.Extensions, ", ")))
	b.WriteString("alwaysApply: false\n")
	b.WriteString("---\n\n")

	// Body
	b.WriteString(buildMarkdownContent(rule))

	if err := os.WriteFile(filePath, []byte(b.String()), 0o644); err != nil {
		return "", fmt.Errorf("writing %s: %w", filePath, err)
	}

	return filePath, nil
}
