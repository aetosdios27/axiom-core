package writer

import (
	"fmt"
	"sort"
	"strings"

	"github.com/aetosdios27/axiom-core/cli/internal/schema"
)

// Writer defines the interface for writing rules to agent-specific formats.
type Writer interface {
	// Write writes the rule to the given output directory and returns the path of the created file.
	Write(rule *schema.Rule, outputDir string) (string, error)

	// Format returns the format name (e.g., "cursor", "claude").
	Format() string

	// Description returns a human-readable description of the output.
	Description() string
}

var formats = map[string]Writer{}

func init() {
	register(&CursorWriter{})
	register(&WindsurfWriter{})
	register(&ClaudeWriter{})
	register(&CopilotWriter{})
	register(&ClineWriter{})
	register(&CodexWriter{})
	register(&ZedWriter{})
}

func register(w Writer) {
	formats[w.Format()] = w
}

// Get returns the writer for the given format name.
func Get(format string) (Writer, error) {
	w, ok := formats[strings.ToLower(format)]
	if !ok {
		return nil, fmt.Errorf("unknown format %q (available: %s)", format, strings.Join(ListFormats(), ", "))
	}
	return w, nil
}

// ListFormats returns all available format names, sorted alphabetically.
func ListFormats() []string {
	names := make([]string, 0, len(formats))
	for name := range formats {
		names = append(names, name)
	}
	sort.Strings(names)
	return names
}

// GetAll returns all registered writers.
func GetAll() []Writer {
	names := ListFormats()
	writers := make([]Writer, 0, len(names))
	for _, name := range names {
		writers = append(writers, formats[name])
	}
	return writers
}

// buildMarkdownContent generates the standard markdown body shared by most writers.
func buildMarkdownContent(rule *schema.Rule) string {
	var b strings.Builder

	b.WriteString(fmt.Sprintf("# %s v%s\n\n", rule.Name, rule.Version))
	b.WriteString(fmt.Sprintf("> %s\n\n", rule.HumanView.Philosophy))
	b.WriteString(rule.AgentView.SystemPrompt)
	b.WriteString("\n\n")

	b.WriteString("## Rules\n\n")
	for _, r := range rule.AgentView.Rules {
		b.WriteString(fmt.Sprintf("- %s\n", r))
	}
	b.WriteString("\n")

	b.WriteString(fmt.Sprintf("## Canonical Example\n\n```%s\n%s\n```\n",
		strings.ToLower(rule.Ecosystem),
		rule.AgentView.CanonicalSnippet,
	))

	return b.String()
}
