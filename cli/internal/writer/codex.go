package writer

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/aetosdios27/axiom-core/cli/internal/schema"
)

// CodexWriter writes rules as an AGENTS.md file.
type CodexWriter struct{}

func (w *CodexWriter) Format() string      { return "codex" }
func (w *CodexWriter) Description() string { return "AGENTS.md" }

func (w *CodexWriter) Write(rule *schema.Rule, outputDir string) (string, error) {
	filePath := filepath.Join(outputDir, "AGENTS.md")
	content := buildMarkdownContent(rule)

	if err := os.WriteFile(filePath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("writing %s: %w", filePath, err)
	}

	return filePath, nil
}
