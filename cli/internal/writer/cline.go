package writer

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/aetosdios27/axiom-core/cli/internal/schema"
)

// ClineWriter writes rules as a .clinerules file.
type ClineWriter struct{}

func (w *ClineWriter) Format() string      { return "cline" }
func (w *ClineWriter) Description() string { return ".clinerules" }

func (w *ClineWriter) Write(rule *schema.Rule, outputDir string) (string, error) {
	filePath := filepath.Join(outputDir, ".clinerules")
	content := buildMarkdownContent(rule)

	if err := os.WriteFile(filePath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("writing %s: %w", filePath, err)
	}

	return filePath, nil
}
