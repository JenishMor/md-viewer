"use client";

import { useMemo } from "react";
import { List } from "lucide-react";

interface Heading {
  level: number;
  text: string;
  index: number;
}

interface TableOfContentsProps {
  markdown: string;
  onHeadingClick: (index: number) => void;
}

function parseHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown.split("\n");
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].replace(/[*_`~\[\]]/g, ""),
        index: headings.length,
      });
    }
  }
  return headings;
}

export function TableOfContents({
  markdown,
  onHeadingClick,
}: TableOfContentsProps) {
  const headings = useMemo(() => parseHeadings(markdown), [markdown]);

  if (headings.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No headings found. Add headings with # syntax.
      </div>
    );
  }

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <div className="max-h-80 overflow-y-auto py-2">
      <div className="px-3 pb-2 mb-1 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <List className="h-3 w-3" />
          Table of Contents
        </div>
      </div>
      <nav className="space-y-0.5 px-1">
        {headings.map((h) => (
          <button
            key={h.index}
            onClick={() => onHeadingClick(h.index)}
            className="block w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors truncate cursor-pointer"
            style={{ paddingLeft: `${(h.level - minLevel) * 16 + 8}px` }}
            title={h.text}
          >
            <span className="text-muted-foreground mr-1.5 text-xs">
              {"#".repeat(h.level)}
            </span>
            {h.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
