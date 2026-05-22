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

function resolveLocalRegistryPath(): string | null {
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

  return null;
}

const REMOTE_INDEX_URL = "https://raw.githubusercontent.com/aetosdios27/axiom-registry/main/index.json";
const REMOTE_RULES_BASE = "https://raw.githubusercontent.com/aetosdios27/axiom-registry/main/rules";

export async function getAllRules(): Promise<Rule[]> {
  const localDir = resolveLocalRegistryPath();

  if (localDir) {
    // Local fallback: read from disk
    const files = fs.readdirSync(localDir).filter((f: string) => f.endsWith(".json"));
    return files
      .map((file: string) => {
        const raw = fs.readFileSync(path.join(localDir, file), "utf-8");
        return JSON.parse(raw) as Rule;
      })
      .sort((a: Rule, b: Rule) => a.name.localeCompare(b.name));
  }

  // Remote execution: fetch index and then payload files concurrently
  console.log(`[Axiom] Fetching remote index from ${REMOTE_INDEX_URL}`);
  const res = await fetch(REMOTE_INDEX_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch remote registry index: ${res.statusText}`);
  }

  const index = await res.json() as { id: string }[];
  
  console.log(`[Axiom] Fetching ${index.length} rules remotely...`);
  const rulePromises = index.map(async (entry) => {
    const url = `${REMOTE_RULES_BASE}/${entry.id}.json`;
    const r = await fetch(url);
    if (!r.ok) {
      throw new Error(`Failed to fetch rule ${entry.id}: ${r.statusText}`);
    }
    return r.json() as Promise<Rule>;
  });

  const rules = await Promise.all(rulePromises);
  return rules.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getRuleById(id: string): Promise<Rule | undefined> {
  const rules = await getAllRules();
  return rules.find((r) => r.id === id);
}
