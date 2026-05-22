import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filePath?: string;
}

export function CodeBlock({ code, language = "text", filePath }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <div className="group/codeblock rounded-lg overflow-hidden ring-1 ring-border bg-zinc-950/50 backdrop-blur-md">
      {/* Command bar header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Window dots */}
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-[#ff5f56]" />
            <div className="size-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="size-2.5 rounded-full bg-[#27c93f]" />
          </div>
          {filePath && (
            <span className="text-[11px] font-mono text-zinc-500 ml-2">
              {filePath}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          className={cn(
            "transition-all duration-200",
            copied
              ? "text-emerald-400 ring-emerald-500/20"
              : "text-zinc-500 hover:text-zinc-300",
          )}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <Check className="size-3" />
          ) : (
            <Copy className="size-3" />
          )}
        </Button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-zinc-300">{code}</code>
        </pre>
      </div>
    </div>
  );
}
