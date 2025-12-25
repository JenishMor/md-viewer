"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Layout } from "@/components/layout"

const STORAGE_KEY = "md-viewer-content"

const DEFAULT_MARKDOWN = `# MD Viewer & Live Markdown Preview

Welcome to the ultimate **MD Viewer**! This tool offers a powerful **live markdown editor** and **real-time preview** to streamline your writing process. Whether you're a developer or a content creator, our **markdown preview** functionality makes it easy to work with .md files.

## Key Features

- **Live Markdown Preview:** See your formatted text instantly as you type.
- **Visual & Code Editing:** Use the visual editor for a WYSIWYG experience or write directly in Markdown.
- **GFM Support:** Full support for GitHub Flavored Markdown, including tables, code blocks, and more.
- **Paste from Anywhere:** Copy content from Word or Google Docs and see it converted to clean Markdown.

## Why Use a Live MD Viewer?

A good **MD viewer** with a **live preview** saves you time and effort. You don't have to switch between windows or guess what your formatting looks like.

### Text Formatting
This text is **bold**, this is *italic*, and this is ***both***. You can also use ~~strikethrough~~.

### Lists
**Unordered List:**
- First item
- Second item
  - Nested item
- Third item

**Ordered List:**
1. First step
2. Second step
3. Third step

### Code Blocks
Our **live markdown preview** handles code beautifully.
\`\`\`javascript
function sayHello(name) {
    console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Blockquote
> "This is the best markdown preview tool I've ever used. The live editor is a game-changer!"
> 
> — A Happy Developer

---

**Get started now:** Edit this text in the **live markdown editor** and see the magic of our **MD viewer**! ✨
`

const Editor = dynamic(() => import("@/components/editor").then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm animate-pulse" />,
});

const Preview = dynamic(() => import("@/components/preview").then(mod => mod.Preview), {
  ssr: false,
  loading: () => <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm animate-pulse" />,
});

export default function HomePage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY)
    if (savedContent !== null) {
      setMarkdown(savedContent)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, markdown)
    }
  }, [markdown, isInitialized])

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full min-h-0">
        <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
          <Editor 
            value={markdown} 
            onChange={(e) => setMarkdown(e.target.value)} 
            initialValue={DEFAULT_MARKDOWN}
            className="flex-1"
          />
        </div>
        <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
          <Preview content={markdown} />
        </div>
      </div>
    </Layout>
  )
}
