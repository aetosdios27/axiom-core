import { CodeBlock } from "@/components/CodeBlock";

interface Section {
  title: string;
  content: string;
}

interface RuleDetailProps {
  name: string;
  ecosystem: string;
  version: string;
  philosophy: string;
  sections: Section[];
  systemPrompt: string;
  rules: string[];
  canonicalSnippet: string;
  ruleId: string;
}

export function RuleDetail({
  systemPrompt,
  rules,
  canonicalSnippet,
  ruleId,
}: RuleDetailProps) {
  // Build one unified agent payload
  const agentPayload = [
    `# System Prompt`,
    systemPrompt,
    ``,
    `# Constraints (${rules.length} rules)`,
    ...rules.map((r, i) => `${String(i + 1).padStart(2, "0")}. ${r}`),
    ``,
    `# Canonical Example`,
    canonicalSnippet,
  ].join("\n");

  return (
    <div className="space-y-10">
      {/* Single unified agent block */}
      <div>
        <h2 className="text-[13px] font-mono uppercase tracking-widest text-zinc-500 font-medium mb-4">
          Agent Payload
        </h2>
        <CodeBlock
          code={agentPayload}
          language="text"
          filePath={`${ruleId}.rules`}
        />
      </div>
    </div>
  );
}
