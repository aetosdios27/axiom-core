package writer

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/aetosdios27/axiom-core/cli/internal/schema"
)

// CopilotWriter writes rules as .github/copilot-instructions.md.
type CopilotWriter struct{}

func (w *CopilotWriter) Format() string      { return "copilot" }
func (w *CopilotWriter) Description() string { return ".github/copilot-instructions.md" }

func (w *CopilotWriter) Write(rule *schema.Rule, outputDir string) (string, error) {
	dir := filepath.Join(outputDir, ".github")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return "", fmt.Errorf("creating .github directory: %w", err)
	}

	filePath := filepath.Join(dir, "copilot-instructions.md")
	content := buildMarkdownContent(rule)

	if err := os.WriteFile(filePath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("writing %s: %w", filePath, err)
	}

	return filePath, nil
}
