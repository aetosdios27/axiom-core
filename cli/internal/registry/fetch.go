package registry

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aetosdios27/axiom-core/cli/internal/schema"
)

const (
	// DefaultBaseURL is the raw GitHub URL for the Axiom registry.
	DefaultBaseURL = "https://raw.githubusercontent.com/aetosdios27/axiom-registry/main/rules"

	httpTimeout = 10 * time.Second
)

// FetchRule retrieves a single rule by ID from the registry.
// The baseURL can be a local directory path or a remote HTTP(S) URL.
func FetchRule(baseURL, ruleID string) (*schema.Rule, error) {
	if isLocalPath(baseURL) {
		return fetchLocal(baseURL, ruleID)
	}
	return fetchRemote(baseURL, ruleID)
}

// ListRules returns all rules available in the registry.
// Only works with local directory paths.
func ListRules(baseURL string) ([]schema.Rule, error) {
	if !isLocalPath(baseURL) {
		return listRemote(baseURL)
	}
	return listLocal(baseURL)
}

func isLocalPath(s string) bool {
	return !strings.HasPrefix(s, "http://") && !strings.HasPrefix(s, "https://")
}

func fetchLocal(dir, ruleID string) (*schema.Rule, error) {
	filePath := filepath.Join(dir, ruleID+".json")

	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("reading rule %q from %s: %w", ruleID, dir, err)
	}

	return parseRule(data)
}

func fetchRemote(baseURL, ruleID string) (*schema.Rule, error) {
	url := strings.TrimRight(baseURL, "/") + "/" + ruleID + ".json"

	client := &http.Client{Timeout: httpTimeout}
	resp, err := client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("fetching rule %q from %s: %w", ruleID, url, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("fetching rule %q: HTTP %d from %s", ruleID, resp.StatusCode, url)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response for rule %q: %w", ruleID, err)
	}

	return parseRule(data)
}

func listLocal(dir string) ([]schema.Rule, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("listing rules directory %s: %w", dir, err)
	}

	var rules []schema.Rule
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".json") {
			continue
		}

		data, err := os.ReadFile(filepath.Join(dir, entry.Name()))
		if err != nil {
			return nil, fmt.Errorf("reading %s: %w", entry.Name(), err)
		}

		rule, err := parseRule(data)
		if err != nil {
			return nil, fmt.Errorf("parsing %s: %w", entry.Name(), err)
		}

		rules = append(rules, *rule)
	}

	return rules, nil
}

func listRemote(baseURL string) ([]schema.Rule, error) {
	// For remote registries, we'd need an index.json endpoint.
	// For now, return an informative error.
	return nil, fmt.Errorf("remote listing not supported for %s (use --registry with a local directory)", baseURL)
}

func parseRule(data []byte) (*schema.Rule, error) {
	var rule schema.Rule
	if err := json.Unmarshal(data, &rule); err != nil {
		return nil, fmt.Errorf("parsing rule JSON: %w", err)
	}

	if rule.ID == "" {
		return nil, fmt.Errorf("invalid rule: missing 'id' field")
	}

	return &rule, nil
}
