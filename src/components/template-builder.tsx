"use client";

import { useState } from "react";
import { X, Search, FileText } from "lucide-react";
import { templates, templateCategories } from "@/data/templates";

interface TemplateBuilderProps {
  onInsert: (content: string) => void;
  onClose: () => void;
}

export function TemplateBuilder({ onInsert, onClose }: TemplateBuilderProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("readme");

  const filtered = templates.filter((t) => {
    const matchesCategory = t.category === activeCategory;
    const matchesSearch =
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-accent transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 rounded-lg border border-border outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-border">
          {templateCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No templates found.
            </p>
          ) : (
            filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onInsert(t.content);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors group cursor-pointer"
              >
                <div className="font-medium text-sm group-hover:text-primary transition-colors">
                  {t.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {t.description}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
