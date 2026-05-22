import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const COMMANDS = `curl -sSL https://raw.githubusercontent.com/aetosdios27/axiom-core/main/install.sh | bash`;

export function DynamicInstallButton() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(COMMANDS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div ref={containerRef} className="relative z-50 h-[44px] w-full">
      <motion.div
        layout
        onClick={() => !expanded && setExpanded(true)}
        initial={{ x: "-50%", left: "50%" }}
        animate={{
          width: expanded ? 580 : 140,
          height: expanded ? 310 : 44,
          borderRadius: expanded ? 16 : 8,
          x: "-50%",
          left: "50%",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 1 }}
        className={cn(
          "absolute top-0 overflow-hidden cursor-pointer",
          !expanded ? "ring-1 ring-zinc-800 bg-zinc-950/50 backdrop-blur-md hover:ring-white group" : "bg-black/60 backdrop-blur-xl ring-1 ring-zinc-800 shadow-2xl cursor-default"
        )}
      >
        {/* Hover White Sweep Effect (Only active when NOT expanded) */}
        {!expanded && (
          <div className="absolute inset-0 bg-white origin-right scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100 -z-10"></div>
        )}

        <AnimatePresence initial={false}>
          {!expanded ? (
            <motion.div
              key="button-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center gap-2"
            >
              <TerminalSquare className="size-4 text-zinc-400 group-hover:text-zinc-900 transition-colors duration-500" />
              <span className="text-zinc-400 font-semibold text-sm tracking-tight group-hover:text-zinc-900 transition-colors duration-500">
                Install CLI
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="absolute inset-0 p-5 flex flex-col text-left"
            >
              <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <TerminalSquare className="size-4 text-zinc-500" />
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest font-medium">
                    Quick Start
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center size-7 rounded-md hover:bg-white/10 text-zinc-400 hover:text-zinc-100 transition-colors flex-shrink-0"
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
              
              <div className="flex-1 min-h-0">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-[11px] font-mono text-zinc-500 mb-1.5 select-none whitespace-nowrap"># Install Axiom CLI</div>
                    <div className="text-[13px] font-mono text-zinc-200 bg-black/40 px-3 py-2 rounded border border-zinc-800 whitespace-nowrap overflow-x-auto custom-scrollbar">
                      <span className="text-[#00ADD8]">curl</span> -sSL https://raw.githubusercontent.com/aetosdios27/axiom-core/main/install.sh | <span className="text-[#00ADD8]">bash</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[11px] font-mono text-zinc-500 mb-1.5 select-none whitespace-nowrap"># Initialize rules for a project</div>
                    <div className="text-[13px] font-mono text-zinc-200 bg-black/40 px-3 py-2 rounded border border-zinc-800 whitespace-nowrap overflow-x-auto custom-scrollbar">
                      <span className="text-white font-medium">axiom</span> init go-canonical <span className="text-zinc-500">--format</span> cursor
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[11px] font-mono text-zinc-500 mb-1.5 select-none whitespace-nowrap"># Browse the local registry</div>
                    <div className="text-[13px] font-mono text-zinc-200 bg-black/40 px-3 py-2 rounded border border-zinc-800 whitespace-nowrap overflow-x-auto custom-scrollbar">
                      <span className="text-white font-medium">axiom</span> list
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
