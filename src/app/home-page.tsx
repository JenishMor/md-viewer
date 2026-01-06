/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Layout } from "@/components/layout"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

const STORAGE_KEY = "md-viewer-content"

const DEFAULT_MARKDOWN = `# MD Viewer & Live Markdown Preview

Welcome to the ultimate **MD Viewer**! This tool offers a powerful **live markdown editor** and **real-time preview** to streamline your writing process. Whether you're a developer or a content creator, our **markdown preview** functionality makes it easy to work with .md files.

## 🚀 Key Features

- **Live Markdown Preview:** See your formatted text instantly as you type.
- **Visual & Code Editing:** Use the visual editor for a WYSIWYG experience or write directly in Markdown.
- **GFM Support:** Full support for GitHub Flavored Markdown, including tables, code blocks, and more.
- **Paste from Anywhere:** Copy content from Word or Google Docs and see it converted to clean Markdown.
- **Dark Mode Support:** Switch between light and dark themes for a comfortable writing experience.

## 💡 Why Use a Live MD Viewer?

A good **MD viewer** with a **live preview** saves you time and effort. You don't have to switch between windows or guess what your formatting looks like. It's perfect for:
1. Drafting GitHub README files.
2. Writing technical documentation.
3. Creating blog posts with Markdown.
4. Taking clean, formatted notes.

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

### 📊 Tables
| Feature | Supported | Description |
| :--- | :---: | :--- |
| GFM | ✅ | Full support for GitHub standard |
| Tables | ✅ | Clean and responsive |
| Math | ✅ | LaTeX support |

### 💻 Code Blocks
Our **live markdown preview** handles code beautifully with syntax highlighting.
\`\`\`javascript
function sayHello(name) {
    console.log(\`Hello, \${name}!\`);
}
\`\`\`

### 💬 Blockquote
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
  const [isDesktop, setIsDesktop] = useState(false)

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

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(media.matches)
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  return (
    <Layout>
      {/* Tool Section */}
      <section className="w-full mb-12" aria-label="Markdown Editor and Preview">
        <div className="h-[750px] flex flex-col">
          {isDesktop ? (
            // Desktop: Horizontal resizable panels
            <PanelGroup direction="horizontal" className="flex-1 h-full min-h-0 gap-2">
              <Panel 
                defaultSize={50}
                minSize={20}
                className="flex flex-col"
              >
                <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                  <Editor 
                    value={markdown} 
                    onChange={(e) => setMarkdown(e.target.value)} 
                    initialValue={DEFAULT_MARKDOWN}
                    className="flex-1"
                  />
                </div>
              </Panel>

              <PanelResizeHandle className="w-2 flex items-center justify-center transition-colors hover:bg-accent/50">
                <div className="w-1 h-12 bg-border rounded-full" />
              </PanelResizeHandle>

              <Panel 
                defaultSize={50} 
                minSize={50}
                maxSize={90}
                className="flex flex-col"
              >
                <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                  <Preview content={markdown} />
                </div>
              </Panel>
            </PanelGroup>
          ) : (
            // Mobile: Vertical stacked layout (no resize)
            <div className="flex flex-col gap-6 flex-1 h-full min-h-0">
              <div className="h-[400px] shrink-0 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
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
          )}
        </div>
      </section>

      {/* Content Sections */}
      <div className="space-y-24 py-12 border-t border-border">
        {/* Intro Section */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">The Most Intuitive Online Markdown Viewer</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Stop guessing what your Markdown looks like. MDViewer provides a polished, high-performance <strong>live markdown editor</strong> that helps you write better, faster. Whether you're a developer documenting your code or a writer crafting your next blog post, our tool is built for you.
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">⚡</div>
            <h2 className="text-2xl font-bold">Real-Time Preview</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every keystroke is rendered instantly. See your formatting, links, and code blocks take shape as you type. No more switching modes.
            </p>
          </div>
          <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">🐙</div>
            <h2 className="text-2xl font-bold">Github Flavored</h2>
            <p className="text-muted-foreground leading-relaxed">
              Full support for GFM including tables, task lists, and syntax highlighting. Your READMEs will look exactly as they do on GitHub.
            </p>
          </div>
          <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">🔒</div>
            <h2 className="text-2xl font-bold">Privacy Focused</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your content stays in your browser. We don't save your text on our servers. Your data is protected by your local browser storage.
            </p>
          </div>
        </section>

        {/* Detailed Guide Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What is Markdown?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Markdown is a lightweight markup language with plain-text-formatting syntax. It is often used for formatting readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With <strong>MDViewer</strong>, you can harness the power of Markdown without having to memorize complex syntax. Our visual tools and real-time feedback make it accessible to everyone.
            </p>
          </div>
          <div className="bg-muted rounded-2xl p-8 space-y-4 border">
            <h3 className="text-xl font-bold">Quick Markdown Reference</h3>
            <ul className="space-y-3 font-mono text-sm">
              <li className="flex justify-between border-b pb-2"><span># Heading 1</span><span className="text-muted-foreground">h1 tag</span></li>
              <li className="flex justify-between border-b pb-2"><span>**Bold Text**</span><span className="text-muted-foreground">strong tag</span></li>
              <li className="flex justify-between border-b pb-2"><span>*Italic Text*</span><span className="text-muted-foreground">em tag</span></li>
              <li className="flex justify-between border-b pb-2"><span>[Link](url)</span><span className="text-muted-foreground">anchor tag</span></li>
              <li className="flex justify-between border-b pb-2"><span>- List Item</span><span className="text-muted-foreground">li tag</span></li>
              <li className="flex justify-between"><span>{"`"}Code{"`"}</span><span className="text-muted-foreground">inline code</span></li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="space-y-2 border-b pb-4">
              <h3 className="text-xl font-semibold">Is MDViewer free to use?</h3>
              <p className="text-muted-foreground">Yes, our Markdown viewer and editor is completely free for everyone. There are no hidden fees or limitations.</p>
            </div>
            <div className="space-y-2 border-b pb-4">
              <h3 className="text-xl font-semibold">Do I need to sign up to save my work?</h3>
              <p className="text-muted-foreground">No. We use your browser's local storage to save your work automatically. You can close the tab and come back later, and your text will still be there.</p>
            </div>
            <div className="space-y-2 border-b pb-4">
              <h3 className="text-xl font-semibold">Can I export my Markdown to HTML?</h3>
              <p className="text-muted-foreground">Currently, we focus on providing a perfect preview. You can easily copy the rendered text or use the preview to see how it will look on platforms like GitHub or Gitlab.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Does it support tables and code blocks?</h3>
              <p className="text-muted-foreground">Absolutely! We fully support GitHub Flavored Markdown (GFM), including complex tables and syntax-highlighted code blocks for various programming languages.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
