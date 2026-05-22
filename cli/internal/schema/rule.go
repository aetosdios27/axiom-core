package schema

// Rule represents a complete Axiom rule document.
type Rule struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Ecosystem string    `json:"ecosystem"`
	Version   string    `json:"version"`
	CLITarget CLITarget `json:"cli_target"`
	HumanView HumanView `json:"human_view"`
	AgentView AgentView `json:"agent_view"`
}

// CLITarget defines the file extensions and agent format for a rule.
type CLITarget struct {
	Extensions  []string `json:"extensions"`
	AgentFormat string   `json:"agent_format"`
}

// HumanView contains the human-readable documentation for a rule.
type HumanView struct {
	Philosophy string    `json:"philosophy"`
	Sections   []Section `json:"sections"`
}

// Section is a titled block of content within the human view.
type Section struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// AgentView contains the machine-executable instructions for a rule.
type AgentView struct {
	SystemPrompt     string   `json:"system_prompt"`
	Rules            []string `json:"rules"`
	CanonicalSnippet string   `json:"canonical_snippet"`
}
