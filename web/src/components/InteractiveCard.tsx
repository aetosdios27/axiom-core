import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/BrandIcon";
import { cn } from "@/lib/utils";

interface InteractiveCardProps {
  id: string;
  name: string;
  ecosystem: string;
  version: string;
  philosophy: string;
  extensions: string[];
}

export function InteractiveCard({
  id,
  name,
  ecosystem,
  version,
  philosophy,
  extensions,
}: InteractiveCardProps) {
  const truncated = philosophy.length > 100 ? philosophy.slice(0, 100) + "…" : philosophy;

  return (
    <a href={`/rules/${id}`} className="block group" id={`rule-card-${id}`}>
      <div
        className={cn(
          "h-full flex flex-col rounded-xl bg-card/50 backdrop-blur-md ring-1 ring-border/50 p-4 transition-all duration-200",
          "hover:-translate-y-0.5 hover:ring-zinc-500/30 hover:shadow-lg hover:shadow-zinc-900/20",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-8 rounded-md bg-zinc-800/80 backdrop-blur-sm ring-1 ring-zinc-700/50">
              <BrandIcon ecosystem={ecosystem} size={16} className="group-hover:brightness-125 transition-all duration-200" />
            </div>
            <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-widest">
              {ecosystem}
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-600">v{version}</span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors mb-2">
          {name}
        </h3>

        {/* Description */}
        <p className="text-[13px] leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors flex-1 mb-4">
          {truncated}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            {extensions.slice(0, 3).map((ext) => (
              <span
                key={ext}
                className="text-[10px] font-mono text-zinc-600 bg-zinc-800/50 backdrop-blur-sm px-1.5 py-0.5 rounded-sm ring-1 ring-zinc-800"
              >
                {ext}
              </span>
            ))}
          </div>
          <ArrowRight className="size-3.5 text-zinc-700 -rotate-45 transition-all duration-300 ease-out group-hover:text-zinc-400 group-hover:rotate-0 group-hover:translate-x-0.5" />
        </div>
      </div>
    </a>
  );
}
