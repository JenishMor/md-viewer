import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Complete Markdown Tutorial 2026 | Learn Markdown Syntax from Beginner to Advanced',
  description: 'Master Markdown with our comprehensive 2026 tutorial. Learn basic syntax, GitHub Flavored Markdown (GFM), tables, code blocks, and advanced techniques. Perfect for developers, writers, and students.',
  keywords: [
    'markdown tutorial',
    'learn markdown',
    'markdown syntax',
    'markdown guide',
    'github flavored markdown',
    'gfm tutorial',
    'markdown for beginners',
    'markdown cheat sheet',
    'how to write markdown',
    'markdown formatting',
  ],
  openGraph: {
    title: 'Complete Markdown Tutorial 2026 | Learn Markdown Syntax',
    description: 'Master Markdown with our comprehensive tutorial. From basic syntax to advanced GitHub Flavored Markdown techniques.',
    url: 'https://mdviewer.in/markdown-tutorial',
    type: 'article',
  },
};

export default function MarkdownTutorial() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-16">
        {/* Hero Section */}
        <header className="space-y-6 border-b pb-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>Tutorial</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            The Complete Markdown Tutorial
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about Markdown, from absolute beginner to power user. This comprehensive guide covers basic syntax, GitHub Flavored Markdown (GFM), and advanced techniques used by professional developers worldwide.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">Beginner Friendly</span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">Updated 2026</span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">~15 min read</span>
          </div>
        </header>

        {/* Table of Contents */}
        <nav className="bg-muted/50 rounded-2xl p-6 border">
          <h2 className="text-lg font-bold mb-4">📑 Table of Contents</h2>
          <ul className="grid md:grid-cols-2 gap-2 text-sm">
            <li><a href="#what-is-markdown" className="text-primary hover:underline">What is Markdown?</a></li>
            <li><a href="#why-learn-markdown" className="text-primary hover:underline">Why Learn Markdown?</a></li>
            <li><a href="#basic-syntax" className="text-primary hover:underline">Basic Syntax</a></li>
            <li><a href="#headings" className="text-primary hover:underline">Headings</a></li>
            <li><a href="#paragraphs" className="text-primary hover:underline">Paragraphs & Line Breaks</a></li>
            <li><a href="#emphasis" className="text-primary hover:underline">Bold, Italic & Strikethrough</a></li>
            <li><a href="#lists" className="text-primary hover:underline">Lists (Ordered & Unordered)</a></li>
            <li><a href="#links" className="text-primary hover:underline">Links & URLs</a></li>
            <li><a href="#images" className="text-primary hover:underline">Images</a></li>
            <li><a href="#blockquotes" className="text-primary hover:underline">Blockquotes</a></li>
            <li><a href="#code" className="text-primary hover:underline">Code & Syntax Highlighting</a></li>
            <li><a href="#tables" className="text-primary hover:underline">Tables</a></li>
            <li><a href="#task-lists" className="text-primary hover:underline">Task Lists</a></li>
            <li><a href="#horizontal-rules" className="text-primary hover:underline">Horizontal Rules</a></li>
            <li><a href="#html" className="text-primary hover:underline">Embedding HTML</a></li>
            <li><a href="#best-practices" className="text-primary hover:underline">Best Practices</a></li>
          </ul>
        </nav>

        {/* What is Markdown */}
        <section id="what-is-markdown" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">What is Markdown?</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              <strong>Markdown</strong> is a lightweight markup language created by John Gruber in 2004. It allows you to add formatting to plain text documents using simple, intuitive symbols. Unlike HTML or other complex markup languages, Markdown is designed to be readable even in its raw form.
            </p>
            <p>
              When you write in Markdown, your text can easily be converted to HTML, PDF, or other formats. This makes it incredibly versatile for everything from technical documentation to blog posts, from note-taking to writing entire books.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">💡 Fun Fact</h4>
              <p className="text-blue-800 dark:text-blue-200 text-base">
                This very tutorial is written in Markdown! When you see it rendered on MDViewer, you're seeing how Markdown transforms into beautiful, formatted content.
              </p>
            </div>
          </div>
        </section>

        {/* Why Learn Markdown */}
        <section id="why-learn-markdown" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Why Learn Markdown?</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              In today's digital world, knowing Markdown is an essential skill for developers, writers, and knowledge workers. Here's why millions of people use Markdown daily:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-2xl border space-y-3">
              <h3 className="font-bold text-lg">🚀 Speed & Efficiency</h3>
              <p className="text-muted-foreground">
                Format text without taking your hands off the keyboard. No clicking through menus or remembering complex shortcuts. Type <code className="bg-muted px-1 rounded">**bold**</code> and move on.
              </p>
            </div>
            <div className="p-6 bg-card rounded-2xl border space-y-3">
              <h3 className="font-bold text-lg">📱 Platform Independence</h3>
              <p className="text-muted-foreground">
                Markdown files are plain text. They work everywhere—Windows, Mac, Linux, mobile devices. No proprietary formats, no compatibility issues.
              </p>
            </div>
            <div className="p-6 bg-card rounded-2xl border space-y-3">
              <h3 className="font-bold text-lg">⏳ Future Proof</h3>
              <p className="text-muted-foreground">
                Plain text files will be readable for decades. Unlike Word documents or other proprietary formats, your Markdown files will never become obsolete.
              </p>
            </div>
            <div className="p-6 bg-card rounded-2xl border space-y-3">
              <h3 className="font-bold text-lg">🌐 Universal Adoption</h3>
              <p className="text-muted-foreground">
                GitHub, GitLab, Reddit, Stack Overflow, Discord, Notion, Obsidian—all support Markdown. Learn it once, use it everywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Basic Syntax */}
        <section id="basic-syntax" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Basic Syntax</h2>
          <p className="text-lg text-muted-foreground">
            Let's start with the fundamental elements of Markdown. These basics will cover 90% of what you need for everyday writing.
          </p>
        </section>

        {/* Headings */}
        <section id="headings" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Headings</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Create headings by adding hash symbols (<code className="bg-muted px-1 rounded">#</code>) before your text. The number of hashes determines the heading level (1-6).
            </p>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm space-y-2">
                <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
                <div># Heading 1</div>
                <div>## Heading 2</div>
                <div>### Heading 3</div>
                <div>#### Heading 4</div>
                <div>##### Heading 5</div>
                <div>###### Heading 6</div>
              </div>
              <div className="bg-card rounded-xl p-6 border space-y-3">
                <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
                <div className="text-2xl font-bold">Heading 1</div>
                <div className="text-xl font-bold">Heading 2</div>
                <div className="text-lg font-bold">Heading 3</div>
                <div className="text-base font-bold">Heading 4</div>
                <div className="text-sm font-bold">Heading 5</div>
                <div className="text-xs font-bold">Heading 6</div>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm">
              <strong className="text-amber-800 dark:text-amber-200">⚠️ Best Practice:</strong>{' '}
              <span className="text-amber-700 dark:text-amber-300">Always put a space after the hash symbol. Also, each document should have only one H1 heading (single #) for SEO purposes.</span>
            </div>
          </div>
        </section>

        {/* Paragraphs */}
        <section id="paragraphs" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Paragraphs & Line Breaks</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Create paragraphs by separating text with a blank line. For a line break within a paragraph, end the line with two spaces or use <code className="bg-muted px-1 rounded">&lt;br&gt;</code>.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
              <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
              <div>This is the first paragraph.</div>
              <div className="h-4"></div>
              <div>This is the second paragraph.</div>
              <div className="h-4"></div>
              <div>This line ends with two spaces  </div>
              <div>to create a line break.</div>
            </div>
          </div>
        </section>

        {/* Emphasis */}
        <section id="emphasis" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Bold, Italic & Strikethrough</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Add emphasis to your text using asterisks or underscores. Strikethrough uses tildes (~).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Style</th>
                    <th className="text-left p-3 font-medium">Markdown</th>
                    <th className="text-left p-3 font-medium">Output</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-3">Bold</td>
                    <td className="p-3 font-mono bg-muted/50">**bold text**</td>
                    <td className="p-3"><strong>bold text</strong></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Italic</td>
                    <td className="p-3 font-mono bg-muted/50">*italic text*</td>
                    <td className="p-3"><em>italic text</em></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Bold & Italic</td>
                    <td className="p-3 font-mono bg-muted/50">***bold and italic***</td>
                    <td className="p-3"><strong><em>bold and italic</em></strong></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Strikethrough</td>
                    <td className="p-3 font-mono bg-muted/50">~~strikethrough~~</td>
                    <td className="p-3"><s>strikethrough</s></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Lists */}
        <section id="lists" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Lists</h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Unordered Lists</h4>
              <p className="text-muted-foreground">
                Create unordered lists using dashes (-), asterisks (*), or plus signs (+). Indent with two spaces for nested items.
              </p>
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
                  <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
                  <div>- First item</div>
                  <div>- Second item</div>
                  <div>  - Nested item</div>
                  <div>  - Another nested</div>
                  <div>- Third item</div>
                </div>
                <div className="bg-card rounded-xl p-6 border">
                  <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>First item</li>
                    <li>Second item
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>Nested item</li>
                        <li>Another nested</li>
                      </ul>
                    </li>
                    <li>Third item</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Ordered Lists</h4>
              <p className="text-muted-foreground">
                Create ordered lists by starting each line with a number followed by a period. The numbers don't have to be sequential—Markdown will auto-number them.
              </p>
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
                  <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
                  <div>1. First step</div>
                  <div>2. Second step</div>
                  <div>3. Third step</div>
                  <div>   1. Sub-step A</div>
                  <div>   2. Sub-step B</div>
                </div>
                <div className="bg-card rounded-xl p-6 border">
                  <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>First step</li>
                    <li>Second step</li>
                    <li>Third step
                      <ol className="list-decimal list-inside ml-4 mt-1">
                        <li>Sub-step A</li>
                        <li>Sub-step B</li>
                      </ol>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section id="links" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Links & URLs</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Create clickable links using square brackets for the text and parentheses for the URL.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Markdown</th>
                    <th className="text-left p-3 font-medium">Output</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="p-3">Basic Link</td>
                    <td className="p-3 font-mono bg-muted/50 text-xs">[MDViewer](https://mdviewer.in)</td>
                    <td className="p-3"><a href="https://mdviewer.in" className="text-primary hover:underline">MDViewer</a></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">With Title</td>
                    <td className="p-3 font-mono bg-muted/50 text-xs">[MDViewer](https://mdviewer.in "Editor")</td>
                    <td className="p-3"><a href="https://mdviewer.in" title="Editor" className="text-primary hover:underline">MDViewer</a></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Auto-link</td>
                    <td className="p-3 font-mono bg-muted/50 text-xs">&lt;https://mdviewer.in&gt;</td>
                    <td className="p-3"><a href="https://mdviewer.in" className="text-primary hover:underline">https://mdviewer.in</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Images */}
        <section id="images" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Images</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Add images using an exclamation mark followed by the link syntax. The text in brackets becomes the alt text (important for accessibility and SEO).
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
              <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
              <div>![Alt text describing the image](https://example.com/image.png)</div>
              <div className="mt-2">![Logo](./logo.png "Optional title")</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm">
              <strong className="text-green-800 dark:text-green-200">💡 Pro Tip:</strong>{' '}
              <span className="text-green-700 dark:text-green-300">Always write descriptive alt text. It helps screen readers and improves SEO. Instead of "image1.png", write "Screenshot of MDViewer dark mode interface".</span>
            </div>
          </div>
        </section>

        {/* Blockquotes */}
        <section id="blockquotes" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Blockquotes</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Create blockquotes by starting a line with the greater-than symbol (&gt;). You can nest them for multi-level quotes.
            </p>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
                <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
                <div>&gt; The best way to predict</div>
                <div>&gt; the future is to invent it.</div>
                <div>&gt;</div>
                <div>&gt; — Alan Kay</div>
              </div>
              <div className="bg-card rounded-xl p-6 border">
                <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                  The best way to predict the future is to invent it.
                  <footer className="mt-2 not-italic">— Alan Kay</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Code */}
        <section id="code" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Code & Syntax Highlighting</h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Inline Code</h4>
              <p className="text-muted-foreground">
                Wrap text in backticks (`) for inline code snippets.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
                Use the `console.log()` function to debug.
              </div>
              <p className="text-muted-foreground">
                Output: Use the <code className="bg-muted px-1.5 py-0.5 rounded text-sm">console.log()</code> function to debug.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Code Blocks with Syntax Highlighting</h4>
              <p className="text-muted-foreground">
                Use triple backticks (```) to create code blocks. Add the language name after the opening backticks for syntax highlighting.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm overflow-x-auto">
                <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
                <div>```javascript</div>
                <div>function greet(name) {'{'}</div>
                <div>  console.log(`Hello, ${'{'}name{'}'}!`);</div>
                <div>{'}'}</div>
                <div>```</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Supported languages include: javascript, typescript, python, java, c, cpp, csharp, go, rust, ruby, php, html, css, json, yaml, bash, sql, and many more.
              </p>
            </div>
          </div>
        </section>

        {/* Tables */}
        <section id="tables" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Tables (GFM)</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Create tables using pipes (|) and hyphens (-). This is a GitHub Flavored Markdown (GFM) feature. Use colons for alignment.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm overflow-x-auto">
              <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
              <div>| Feature    | Status | Notes        |</div>
              <div>| :--------- | :----: | -----------: |</div>
              <div>| Tables     |   ✅   | Fully works  |</div>
              <div>| Alignment  |   ✅   | Left/Center/Right |</div>
              <div>| Images     |   ✅   | In cells too |</div>
            </div>
            <div className="bg-card rounded-xl p-6 border overflow-x-auto">
              <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Feature</th>
                    <th className="text-center p-2">Status</th>
                    <th className="text-right p-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Tables</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-right p-2">Fully works</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Alignment</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-right p-2">Left/Center/Right</td>
                  </tr>
                  <tr>
                    <td className="p-2">Images</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-right p-2">In cells too</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><code className="bg-muted px-1 rounded">:---</code> = Left aligned</p>
              <p><code className="bg-muted px-1 rounded">:---:</code> = Center aligned</p>
              <p><code className="bg-muted px-1 rounded">---:</code> = Right aligned</p>
            </div>
          </div>
        </section>

        {/* Task Lists */}
        <section id="task-lists" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Task Lists (GFM)</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Create interactive checklists using brackets. This is especially useful for project tracking and to-do lists.
            </p>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
                <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
                <div>- [x] Write the tutorial</div>
                <div>- [x] Add code examples</div>
                <div>- [ ] Review and edit</div>
                <div>- [ ] Publish</div>
              </div>
              <div className="bg-card rounded-xl p-6 border">
                <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><input type="checkbox" checked disabled className="rounded" /> <span className="line-through text-muted-foreground">Write the tutorial</span></li>
                  <li className="flex items-center gap-2"><input type="checkbox" checked disabled className="rounded" /> <span className="line-through text-muted-foreground">Add code examples</span></li>
                  <li className="flex items-center gap-2"><input type="checkbox" disabled className="rounded" /> Review and edit</li>
                  <li className="flex items-center gap-2"><input type="checkbox" disabled className="rounded" /> Publish</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal Rules */}
        <section id="horizontal-rules" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Horizontal Rules</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Create horizontal dividers using three or more hyphens, asterisks, or underscores on their own line.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
              <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN (any of these)</div>
              <div>---</div>
              <div>***</div>
              <div>___</div>
            </div>
          </div>
        </section>

        {/* HTML */}
        <section id="html" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold">Embedding HTML</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Markdown supports inline HTML for advanced formatting needs. This is useful for features Markdown doesn't natively support.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm space-y-3">
              <div className="text-xs text-muted-foreground font-sans font-medium">EXAMPLES</div>
              <div>&lt;kbd&gt;Ctrl&lt;/kbd&gt; + &lt;kbd&gt;C&lt;/kbd&gt; to copy</div>
              <div>&lt;details&gt;</div>
              <div>  &lt;summary&gt;Click to expand&lt;/summary&gt;</div>
              <div>  Hidden content here...</div>
              <div>&lt;/details&gt;</div>
              <div>&lt;sub&gt;subscript&lt;/sub&gt; and &lt;sup&gt;superscript&lt;/sup&gt;</div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="space-y-8 scroll-mt-20">
          <h2 className="text-3xl font-bold">Best Practices</h2>
          <div className="grid gap-6">
            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400">1</div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">Use Consistent Heading Hierarchy</h4>
                <p className="text-muted-foreground">Start with a single H1, then use H2 for main sections, H3 for subsections. Never skip heading levels (e.g., H1 → H3).</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 font-bold text-green-600 dark:text-green-400">2</div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">Always Add Alt Text to Images</h4>
                <p className="text-muted-foreground">Descriptive alt text improves accessibility for screen readers and helps with SEO. Never leave it empty.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 font-bold text-purple-600 dark:text-purple-400">3</div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">Specify Language in Code Blocks</h4>
                <p className="text-muted-foreground">Always add the language identifier after triple backticks (e.g., ```javascript) for proper syntax highlighting.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0 font-bold text-orange-600 dark:text-orange-400">4</div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">Use Blank Lines Generously</h4>
                <p className="text-muted-foreground">Add blank lines between sections, before and after code blocks, and around lists. It improves readability in both raw and rendered form.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0 font-bold text-pink-600 dark:text-pink-400">5</div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">Keep Lines Under 80-120 Characters</h4>
                <p className="text-muted-foreground">Long lines are hard to read in plain text. Break them naturally at sentence or clause boundaries.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-8 md:p-12 border border-blue-200 dark:border-blue-800 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Practice?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            The best way to learn Markdown is by doing. Open our editor and try out everything you've learned. Your content saves automatically!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              Open Editor
            </Link>
            <Link 
              href="/guides"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-border px-8 text-base font-medium shadow transition-all hover:bg-accent hover:shadow-lg"
            >
              More Guides
            </Link>
          </div>
        </section>

        {/* Related Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Continue Learning</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/guides/readme-best-practices" className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all">
              <h3 className="font-bold group-hover:text-primary transition-colors">Writing Perfect README Files →</h3>
              <p className="text-sm text-muted-foreground mt-2">Learn how to create README files that impress on GitHub and clearly communicate your project.</p>
            </Link>
            <Link href="/guides/markdown-vs-rich-text" className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all">
              <h3 className="font-bold group-hover:text-primary transition-colors">Markdown vs. Rich Text →</h3>
              <p className="text-sm text-muted-foreground mt-2">Understand when to use Markdown versus traditional word processors for your writing projects.</p>
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
}
