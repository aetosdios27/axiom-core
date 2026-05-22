import fs from "node:fs";
import path from "node:path";

export interface RuleSection {
  title: string;
  content: string;
}

export interface CLITarget {
  extensions: string[];
  agent_format: string;
}

export interface HumanView {
  philosophy: string;
  sections: RuleSection[];
}

export interface AgentView {
  system_prompt: string;
  rules: string[];
  canonical_snippet: string;
}

export interface Rule {
  id: string;
  name: string;
  ecosystem: string;
  version: string;
  cli_target: CLITarget;
  human_view: HumanView;
  agent_view: AgentView;
}

function resolveRegistryPath(): string {
  // Try the external registry first (sibling repo)
  const externalRegistry = path.resolve(process.cwd(), "..", "..", "registry", "rules");
  if (fs.existsSync(externalRegistry)) {
    return externalRegistry;
  }

  // Fall back to the local registry in the monorepo root
  const localRegistry = path.resolve(process.cwd(), "..", "registry", "rules");
  if (fs.existsSync(localRegistry)) {
    return localRegistry;
  }

  // Final fallback: mock data
  return path.resolve(process.cwd(), "src", "data", "mock");
}

export function getAllRules(): Rule[] {
  const dir = resolveRegistryPath();

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));

  return files
    .map((file: string) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      return JSON.parse(raw) as Rule;
    })
    .sort((a: Rule, b: Rule) => a.name.localeCompare(b.name));
}

export function getRuleById(id: string): Rule | undefined {
  const rules = getAllRules();
  return rules.find((r) => r.id === id);
}
