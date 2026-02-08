/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Layout } from "@/components/layout"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Link2, Link2Off } from "lucide-react"

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
  const [scrollRatio, setScrollRatio] = useState(0)
  const scrollSourceRef = useRef<"editor" | "preview" | null>(null)
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState(true)

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
                    scrollRatio={scrollRatio}
                    onScrollSync={setScrollRatio}
                    scrollSourceRef={scrollSourceRef}
                    isScrollSyncEnabled={isScrollSyncEnabled}
                    className="flex-1"
                  />
                </div>
              </Panel>

              <div className="w-2 flex flex-col items-center justify-center space-y-2">
                <button
                  title="Toggle scroll sync"
                  onClick={() => setIsScrollSyncEnabled(prev => !prev)}
                  className="inline-flex items-center justify-center rounded-md py-2 mt-12 border transition cursor-pointer"
                >
                  {isScrollSyncEnabled ? <Link2 className="rotate-90" /> : <Link2Off className="rotate-90"/>}
                </button>

                <PanelResizeHandle className="h-full flex items-center justify-center transition-colors hover:bg-accent/50">
                  <div className="w-1 h-12 bg-border rounded-full" />
                </PanelResizeHandle>
              </div>

              <Panel 
                defaultSize={50} 
                minSize={50}
                maxSize={90}
                className="flex flex-col"
              >
                <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                  <Preview
                    content={markdown}
                    scrollRatio={scrollRatio}
                    onScrollSync={setScrollRatio}
                    scrollSourceRef={scrollSourceRef}
                    isScrollSyncEnabled={isScrollSyncEnabled}
                  />
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
                  scrollRatio={scrollRatio}
                  onScrollSync={setScrollRatio}
                  scrollSourceRef={scrollSourceRef}
                  isScrollSyncEnabled={isScrollSyncEnabled}
                  className="flex-1"
                />
              </div>
              <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                <Preview 
                  content={markdown}
                  scrollRatio={scrollRatio}
                  onScrollSync={setScrollRatio}
                  scrollSourceRef={scrollSourceRef}
                  isScrollSyncEnabled={isScrollSyncEnabled}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content Sections */}
      <div className="space-y-32 py-12 border-t border-border">
        {/* Intro Section */}
        <section className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent py-2">
            The Professional Choice for Online Markdown Viewing
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Stop guessing what your documentation looks like. <strong>MDViewer</strong> provides a polished, high-performance <strong>live markdown editor</strong> and real-time renderer that helps you craft perfect content every time. Built for developers, technical writers, and students who demand precision and speed.
          </p>
        </section>

        {/* Value Proposition Grid */}
        <section className="grid md:grid-cols-3 gap-10">
          <div className="p-10 rounded-3xl border bg-card hover:shadow-xl transition-all duration-300 space-y-6 group">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform font-bold">⚡</div>
            <h2 className="text-2xl font-bold">Instant Render Engine</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Our bespoke rendering pipeline processes every keystroke in milliseconds. Experience true <strong>live markdown preview</strong> without lag, even with complex GFM tables and large documents.
            </p>
          </div>
          <div className="p-10 rounded-3xl border bg-card hover:shadow-xl transition-all duration-300 space-y-6 group">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform font-bold">🐙</div>
            <h2 className="text-2xl font-bold">GitHub Native Support</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We fully support the <strong>GitHub Flavored Markdown (GFM)</strong> specification. If it works on GitHub, it works here. Perfect for drafting READMEs, wikis, and issue comments.
            </p>
          </div>
          <div className="p-10 rounded-3xl border bg-card hover:shadow-xl transition-all duration-300 space-y-6 group">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform font-bold">🔒</div>
            <h2 className="text-2xl font-bold">Absolute Privacy Control</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Your sensitive data never leaves your browser. Unlike other online editors, MDViewer uses <strong>local browser storage</strong> for persistence, ensuring your intellectual property remains private.
            </p>
          </div>
        </section>

        {/* Markdown for Professionals Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Built for Modern Workflows</h2>
            <p className="text-lg text-muted-foreground">Whether you're a software engineer or a creative writer, MDViewer adapts to your needs.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 p-8 bg-muted/30 rounded-3xl border">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-blue-600 dark:text-blue-400 underline decoration-blue-500/30 underline-offset-8">Developers & Engineers</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Markdown has become the standard for software documentation. Use MDViewer to draft high-quality README files that impress on GitHub and GitLab. With <strong>syntax highlighting</strong> for over 100 languages, you can verify your code blocks are properly formatted before you commit. Our tool supports task lists, nested structures, and complex tables essential for technical specs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm"><span className="text-green-500 font-bold">✅</span> YAML Frontmatter Support</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-500 font-bold">✅</span> Inline HTML Compatibility</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-500 font-bold">✅</span> Multi-line Code Block Preview</li>
              </ul>
            </div>
            <div className="space-y-6 p-8 bg-muted/30 rounded-3xl border">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-purple-600 dark:text-purple-400 underline decoration-purple-500/30 underline-offset-8">Content Creators & Bloggers</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Focus on the narrative, not the tags. Markdown allows writers to stay in the "flow state" without reaching for formatting buttons. MDViewer acts as your <strong>distraction-free writing environment</strong>. Convert your thoughts into clean, semantically correct HTML that can be pasted directly into Medium, Dev.to, or your personal WordPress or Hugo blog.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm"><span className="text-green-500 font-bold">✅</span> Typographically Correct Rendering</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-500 font-bold">✅</span> Automatic Link Identification</li>
                <li className="flex items-center gap-2 text-sm"><span className="text-green-500 font-bold">✅</span> Image Preview Support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detailed Education Section */}
        <section className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-[40px] p-12 md:p-20 overflow-hidden relative border border-slate-200 dark:border-slate-800">
            <div className="absolute top-0 right-0 p-10 opacity-10 blur-2xl bg-blue-500 h-64 w-64 rounded-full"></div>
            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold">Master the Markdown Syntax</h2>
                <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  <p>
                    Markdown is more than just a writing format; it is a philosophy of simplicity. By using plain-text characters to represent formatting, you ensure that your documents remain readable now and 50 years into the future.
                  </p>
                  <p>
                    From simple <strong>headers</strong> and <strong>bold text</strong> to advanced <strong>LaTeX mathematical formulas</strong>, Markdown can handle almost any structural requirement. MDViewer bridges the gap between the speed of plain text and the beauty of rich media.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                    <div className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-1">Text Emphasis</div>
                    <code className="text-sm text-slate-800 dark:text-slate-200">**bold**, *italic*</code>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                    <div className="text-sm font-bold text-green-700 dark:text-green-400 mb-1">Code Links</div>
                    <code className="text-sm text-slate-800 dark:text-slate-200">[label](url)</code>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                    <div className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-1">Lists</div>
                    <code className="text-sm text-slate-800 dark:text-slate-200">- item, 1. item</code>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-center text-slate-900 dark:text-white">Frequently Asked Syntax</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl space-y-2">
                    <div className="font-bold flex justify-between items-center text-slate-900 dark:text-slate-100">
                      <span>How to create tables?</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Advanced</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Use pipes (|) to separate columns and hyphens (-) to create the header row. Alignment can be controlled with colons (:).</p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl space-y-2">
                    <div className="font-bold flex justify-between items-center text-slate-900 dark:text-slate-100">
                        <span>How to add images?</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Essential</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Use the syntax <code>![Alt Text](Image Link)</code>. In MDViewer, images will render instantly in the preview panel.</p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl space-y-2">
                    <div className="font-bold flex justify-between items-center text-slate-900 dark:text-slate-100">
                        <span>Can I use HTML tags?</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Pro</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Yes! Markdown allows you to drop into raw HTML for unsupported styles like <code>&lt;kbd&gt;</code> or <code>&lt;details&gt;</code>.</p>
                  </div>
                </div>
              </div>
            </div>
        </section>

        {/* Best Practices Section */}
        <section className="max-w-4xl mx-auto space-y-12 py-12">
            <h2 className="text-3xl font-bold text-center">Best Practices for Productive Writing</h2>
            <div className="grid gap-6">
                <div className="flex gap-6 items-start">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold mt-1">1</div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-bold">Hierarchy Matters</h4>
                        <p className="text-muted-foreground leading-relaxed">Always start with a single H1 for your title. Use H2 for main sections and H3 for sub-points. This isn't just for looks—it's critical for <strong>SEO and screen-reader accessibility</strong>.</p>
                    </div>
                </div>
                <div className="flex gap-6 items-start">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold mt-1">2</div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-bold">Meaningful Alt Text</h4>
                        <p className="text-muted-foreground leading-relaxed">When adding images using Markdown, provide descriptive text inside the brackets. It helps search engines understand your content and improves the experience for users with vision impairments.</p>
                    </div>
                </div>
                <div className="flex gap-6 items-start">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold mt-1">3</div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-bold">Consistent Code Blocks</h4>
                        <p className="text-muted-foreground leading-relaxed">Always specify the language after the triple backticks (e.g., ```javascript). This enables the <strong>syntax highlighting engine</strong> in MDViewer to color your code correctly, making it easier to read.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know about our Markdown tool.</p>
          </div>
          <div className="divide-y divide-border">
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">Is MDViewer free to use forever?</h3>
              <p className="text-muted-foreground leading-relaxed">Absolutely. Our core mission is to empower the global developer and writing community with free, high-quality tools. There are no plans to add paywalls or premium subscriptions for the markdown viewer.</p>
            </div>
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">Where is my data stored?</h3>
              <p className="text-muted-foreground leading-relaxed">We utilize <strong>IndexedDB and LocalStorage</strong> technologies within your own browser. This means that if you refresh the page or even close your laptop, your progress is saved locally. We never transmit your markdown content to our servers, ensuring 100% privacy.</p>
            </div>
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">How does the real-time sync work?</h3>
              <p className="text-muted-foreground leading-relaxed">Our editor is built on the same core as VS Code (Monaco). When you type, our diffing algorithm identifies changes and updates the <strong>rehype-based preview engine</strong>, ensuring that only the changed parts of the document are re-rendered for maximum performance.</p>
            </div>
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">Does it support export to PDF or HTML?</h3>
              <p className="text-muted-foreground leading-relaxed">Currently, you can easily copy the rendered markdown or the raw code. For PDF, we recommend using your browser's "Print" functionality (Ctrl+P / Cmd+P), as our CSS is optimized for clean, professional-grade printing with proper margins and typography.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
