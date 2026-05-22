import { useState, useRef, useEffect } from "react";
import { TerminalSquare, ChevronDown } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/utils";

interface QuickStartProps {
  ruleId: string;
}

type Format = "cursor" | "claude" | "all";

const formats: Record<Format, { label: string; icon: React.ReactNode; cmd: (id: string) => string }> = {
  cursor: {
    label: "Cursor",
    icon: <img src="https://cdn.simpleicons.org/cursor/fafafa" alt="Cursor" className="size-3.5" />,
    cmd: (id) => `axiom init ${id} --format cursor`,
  },
  claude: {
    label: "Claude Code",
    icon: <img src="https://cdn.simpleicons.org/claude/fafafa" alt="Claude Code" className="size-3.5" />,
    cmd: (id) => `axiom init ${id} --format claude`,
  },
  all: {
    label: "All Formats",
    icon: <TerminalSquare className="size-3.5" />,
    cmd: (id) => `axiom init ${id} --format all`,
  },
};

export function QuickStart({ ruleId }: QuickStartProps) {
  const [selected, setSelected] = useState<Format>("cursor");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFormat = formats[selected];

  return (
    <div className="mt-12 rounded-lg ring-1 ring-border bg-zinc-900/20 backdrop-blur-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-mono uppercase tracking-widest text-zinc-500 font-medium">
          Quick Start
        </h3>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-md ring-1 ring-zinc-800 text-[12px] font-mono text-zinc-300 hover:ring-zinc-700 hover:bg-zinc-900 transition-all"
          >
            {activeFormat.icon}
            <span>{activeFormat.label}</span>
            <ChevronDown className={cn("size-3.5 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 rounded-md bg-zinc-950 ring-1 ring-zinc-800 shadow-xl overflow-hidden z-10">
              {(Object.entries(formats) as [Format, typeof activeFormat][]).map(([key, format]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelected(key);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-[12px] font-mono transition-colors text-left",
                    selected === key 
                      ? "bg-zinc-900 text-zinc-100" 
                      : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-300"
                  )}
                >
                  {format.icon}
                  <span>{format.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <CodeBlock 
        code={activeFormat.cmd(ruleId)} 
        language="bash" 
        filePath="terminal" 
      />
    </div>
  );
}
