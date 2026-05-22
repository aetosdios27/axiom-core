package writer

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/aetosdios27/axiom-core/cli/internal/schema"
)

// ClaudeWriter writes rules as a CLAUDE.md file.
type ClaudeWriter struct{}

func (w *ClaudeWriter) Format() string      { return "claude" }
func (w *ClaudeWriter) Description() string { return "CLAUDE.md" }

func (w *ClaudeWriter) Write(rule *schema.Rule, outputDir string) (string, error) {
	filePath := filepath.Join(outputDir, "CLAUDE.md")
	content := buildMarkdownContent(rule)

	if err := os.WriteFile(filePath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("writing %s: %w", filePath, err)
	}

	return filePath, nil
}
