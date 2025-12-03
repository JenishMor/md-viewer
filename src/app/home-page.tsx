"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Editor } from "@/components/editor"
import { Preview } from "@/components/preview"
import { ThemeProvider } from "@/components/theme-provider"

const DEFAULT_MARKDOWN = `# Welcome to the MDViewer! 🚀

This editor offers **three powerful ways** to work with Markdown:

## 1. Paste from Word or Google Docs
Simply **copy and paste** your formatted content from Microsoft Word, Google Docs, or any text editor into the visual editor on the left. Your formatting will be preserved and instantly converted to Markdown!

## 2. Visual Editing (MDViewer)
Use the visual editor just like Word or Google Docs:
- Click the **toolbar buttons** to format text
- Type and see your formatting in real-time
- The Markdown code updates automatically

## 3. Write Markdown Directly
If you know Markdown, type directly in the code editor on the right:
- The visual editor will show your formatted content
- Perfect for developers and Markdown experts
- Full GFM (GitHub Flavored Markdown) support

## Example Features

### Text Formatting
This text is **bold**, this is *italic*, and this is ***both***. You can also use ~~strikethrough~~.

### Lists
**Unordered List:**
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

**Ordered List:**
1. First step
2. Second step
3. Third step

### Code
Inline code: \`const greeting = "Hello World";\`

Code block:
\`\`\`javascript
function sayHello(name) {
    console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Blockquote
> "The best Markdown editor is one that works both ways - visual and code!"
> 
> — Happy User

### Links and Images
[Visit GitHub](https://github.com) for more awesome tools!

---

**Try it now:** Edit this text in either editor and watch the magic happen! ✨
`

export default function HomePage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "MDViewer: Free Online Markdown Viewer and Editor",
            "description": "A free online tool to view and edit Markdown files. Real-time preview, GFM support, and a clean, user-friendly interface. Perfect for developers and content creators.",
            "url": "https://mdviewer.in",
          }),
        }}
      />
      <Layout>
        <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full min-h-0">
          <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
            <Editor 
              value={markdown} 
              onChange={(e) => setMarkdown(e.target.value)} 
              className="flex-1"
            />
          </div>
          <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
            <Preview content={markdown} />
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  )
}
