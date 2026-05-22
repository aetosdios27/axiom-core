import { cn } from "@/lib/utils";

// Uses devicon CDN for reliable brand icons
// Format: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/{name}/{name}-{variant}.svg
const iconUrls: Record<string, string> = {
  "TypeScript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "Go": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
  "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  "Rust": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
  "Next.js (React)": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "Nuxt 3 (Vue)": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg",
  "PostgreSQL": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  "MongoDB": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  "Redis": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
  "Tailwind CSS v4": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "Docker": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "Kubernetes": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
  "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  "Java": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  "C# / .NET": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dotnetcore/dotnetcore-original.svg",
  "Swift & Kotlin": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg",
};

interface BrandIconProps {
  ecosystem: string;
  className?: string;
  size?: number;
}

export function BrandIcon({ ecosystem, className, size = 16 }: BrandIconProps) {
  const url = iconUrls[ecosystem];

  if (!url) {
    return (
      <div
        className={cn("flex items-center justify-center text-zinc-500 font-mono text-[10px] font-bold", className)}
        style={{ width: size, height: size }}
      >
        ?
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={ecosystem}
      width={size}
      height={size}
      loading="lazy"
      className={cn("flex-shrink-0", className)}
    />
  );
}
