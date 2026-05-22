package writer

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/aetosdios27/axiom-core/cli/internal/schema"
)

// ZedWriter writes rules as a .rules file.
type ZedWriter struct{}

func (w *ZedWriter) Format() string      { return "zed" }
func (w *ZedWriter) Description() string { return ".rules" }

func (w *ZedWriter) Write(rule *schema.Rule, outputDir string) (string, error) {
	filePath := filepath.Join(outputDir, ".rules")
	content := buildMarkdownContent(rule)

	if err := os.WriteFile(filePath, []byte(content), 0o644); err != nil {
		return "", fmt.Errorf("writing %s: %w", filePath, err)
	}

	return filePath, nil
}
