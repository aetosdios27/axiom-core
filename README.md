# Axiom Core

> The immutable system of truth for AI agent style guides and coding standards.

**One schema. Every platform. Zero ambiguity.**

## Architecture

```
axiom-core/
├── web/          # Astro static site — human-readable rule directory
├── cli/          # Go binary — fetch & write agent configs
└── registry/     # Mock data (production: separate repo)
```

- **Registry** → Raw `.json` files. No database. Version-controlled truth.
- **Web Hub** → Astro + React + Tailwind v4. Glassmorphic brutalism. Sub-second builds.
- **CLI Engine** → Compiled Go + Cobra. One binary, seven output formats.

## Web Hub

```bash
cd web
bun install
bun run dev      # → http://localhost:4321
bun run build    # → static output in dist/
```

## CLI

### Install

```bash
curl -sSL https://raw.githubusercontent.com/aetosdios27/axiom-core/main/install.sh | bash
```

### Usage

```bash
# List all available rules
axiom list

# Initialize rules for your project
axiom init go-standard --format cursor
axiom init typescript-strict --format claude
axiom init go-standard --format all    # writes all 7 formats
```

### Supported Formats

| Platform | Format Flag | Output File |
|---|---|---|
| Cursor | `cursor` | `.cursor/rules/{id}.mdc` |
| Windsurf | `windsurf` | `.windsurfrules` |
| Claude Code | `claude` | `CLAUDE.md` |
| GitHub Copilot | `copilot` | `.github/copilot-instructions.md` |
| Cline / Roo Code | `cline` | `.clinerules` |
| Codex | `codex` | `AGENTS.md` |
| Zed | `zed` | `.rules` |

## Rule Schema

Both the CLI and web hub consume this exact JSON structure:

```json
{
  "id": "go-standard",
  "name": "Go Canonical Style",
  "ecosystem": "Go",
  "version": "1.0.0",
  "cli_target": {
    "extensions": ["*.go"],
    "agent_format": "cursor"
  },
  "human_view": {
    "philosophy": "...",
    "sections": [{ "title": "...", "content": "..." }]
  },
  "agent_view": {
    "system_prompt": "...",
    "rules": ["..."],
    "canonical_snippet": "..."
  }
}
```

## Links

- **Registry**: [github.com/aetosdios27/axiom-registry](https://github.com/aetosdios27/axiom-registry)
- **Core**: [github.com/aetosdios27/axiom-core](https://github.com/aetosdios27/axiom-core)
