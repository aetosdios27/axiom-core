package writer

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/aetosdios27/axiom-core/cli/internal/schema"
)

// WindsurfWriter writes rules as a .windsurfrules file.
type WindsurfWriter struct{}

func (w *WindsurfWriter) Format() string      { return "windsurf" }
func (w *WindsurfWriter) Description() string { return ".windsurfrules" }

func (w *WindsurfWriter) Write(rule *schema.Rule, outputDir string) (string, error) {
	filePath := filepath.Join(outputDir, ".windsurfrules")
	content := buildMarkdownContent(rule)

	if err := os.WriteFile(filePath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("writing %s: %w", filePath, err)
	}

	return filePath, nil
}
