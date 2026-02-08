import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Markdown vs. Rich Text: When to Use What | MDViewer',
  description: 'Understand the key differences between Markdown and rich text editors like Word and Google Docs. Learn when to use each format and how to choose the right tool for your writing.',
  keywords: [
    'markdown vs word',
    'markdown vs rich text',
    'why use markdown',
    'markdown benefits',
    'plain text vs rich text',
    'markdown advantages',
    'when to use markdown',
  ],
  openGraph: {
    title: 'Markdown vs. Rich Text: When to Use What',
    description: 'Understand the differences between Markdown and rich text editors. Learn when each format shines.',
    url: 'https://mdviewer.in/guides/markdown-vs-rich-text',
    type: 'article',
  },
  authors: [{ name: 'MDViewer Team' }],
};

export default function MarkdownVsRichTextGuide() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-foreground">Markdown vs. Rich Text</span>
        </nav>

        {/* Header */}
        <header className="space-y-6 border-b pb-10">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">Fundamentals</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">8 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Markdown vs. Rich Text: When to Use What
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Should you write in Markdown or use traditional word processors like Microsoft Word? This guide breaks down the key differences, advantages, and use cases for each approach to help you make the right choice.
          </p>
        </header>

        {/* Introduction */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">The Two Worlds of Text Formatting</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              When it comes to writing and formatting text, you generally have two approaches: <strong>rich text editors</strong> (like Microsoft Word, Google Docs, or Apple Pages) where formatting is applied visually through buttons and menus, or <strong>plain text with markup</strong> (like Markdown, HTML, or LaTeX) where formatting is indicated through special characters and syntax.
            </p>
            <p>
              Neither approach is universally "better" — each has distinct advantages depending on your workflow, collaboration needs, and output requirements. Understanding these differences helps you choose the right tool for each project.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Aspect</th>
                  <th className="text-left p-4 font-semibold">Markdown</th>
                  <th className="text-left p-4 font-semibold">Rich Text (Word/Docs)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">File Format</td>
                  <td className="p-4">Plain text (.md, .txt)</td>
                  <td className="p-4">Binary/XML (.docx, .odt)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Portability</td>
                  <td className="p-4 text-green-600 dark:text-green-400">Excellent — opens anywhere</td>
                  <td className="p-4 text-amber-600 dark:text-amber-400">Limited — needs compatible software</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Version Control</td>
                  <td className="p-4 text-green-600 dark:text-green-400">Perfect with Git</td>
                  <td className="p-4 text-red-600 dark:text-red-400">Difficult — binary diffs don't work</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Learning Curve</td>
                  <td className="p-4 text-amber-600 dark:text-amber-400">Requires learning syntax</td>
                  <td className="p-4 text-green-600 dark:text-green-400">Intuitive WYSIWYG</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Complex Layouts</td>
                  <td className="p-4 text-red-600 dark:text-red-400">Limited</td>
                  <td className="p-4 text-green-600 dark:text-green-400">Powerful — columns, graphics, etc.</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Speed (for experts)</td>
                  <td className="p-4 text-green-600 dark:text-green-400">Very fast — keyboard only</td>
                  <td className="p-4 text-amber-600 dark:text-amber-400">Slower — requires mouse</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Future-Proof</td>
                  <td className="p-4 text-green-600 dark:text-green-400">100% — always readable</td>
                  <td className="p-4 text-amber-600 dark:text-amber-400">Depends on software support</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Collaboration</td>
                  <td className="p-4 text-green-600 dark:text-green-400">Git-based workflows</td>
                  <td className="p-4 text-green-600 dark:text-green-400">Real-time co-editing (Docs)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Markdown Advantages */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Why Choose Markdown?</h2>
          <div className="grid gap-6">
            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-2xl">📁</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Portability & Longevity</h3>
                <p className="text-muted-foreground">
                  Markdown files are plain text. You can open them in any text editor on any operating system, now or 50 years from now. No risk of vendor lock-in or obsolete file formats. Your writing will never be trapped in an application.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 text-2xl">🔄</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Version Control Friendly</h3>
                <p className="text-muted-foreground">
                  Because Markdown is plain text, it works perfectly with Git and other version control systems. You can see exactly what changed between versions, collaborate on documentation through pull requests, and track edits over time with precision.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-2xl">⚡</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Focus & Speed</h3>
                <p className="text-muted-foreground">
                  Once you learn the syntax, Markdown lets you format text without taking your hands off the keyboard. No hunting through menus or clicking buttons. You enter a "flow state" where writing and formatting happen in one fluid motion.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0 text-2xl">🌐</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Universal Compatibility</h3>
                <p className="text-muted-foreground">
                  Markdown is supported everywhere: GitHub, GitLab, Reddit, Discord, Stack Overflow, Notion, Obsidian, and countless other platforms. Write once, use anywhere. Your content is never locked to a single platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rich Text Advantages */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">When Rich Text Wins</h2>
          <div className="grid gap-6">
            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-12 w-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0 text-2xl">🎨</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Complex Visual Layouts</h3>
                <p className="text-muted-foreground">
                  For documents requiring precise visual control—multi-column layouts, wrapped images, complex tables with merged cells, custom fonts—rich text editors provide capabilities that Markdown simply can't match.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0 text-2xl">👥</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Non-Technical Collaboration</h3>
                <p className="text-muted-foreground">
                  When working with stakeholders who aren't developers, rich text editors like Google Docs offer real-time collaboration, commenting, and track changes that everyone can use without learning new tools.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-2xl">🖨️</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Print-Ready Documents</h3>
                <p className="text-muted-foreground">
                  For formal documents like contracts, reports, or manuscripts that need precise page layout, headers/footers, and professional printing, word processors remain the standard tool.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Case Recommendations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Which Should You Use?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-800">
              <h3 className="font-bold text-lg mb-4 text-green-900 dark:text-green-100">✅ Use Markdown For:</h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li>• README files and project documentation</li>
                <li>• Technical documentation</li>
                <li>• Blog posts (especially for dev blogs)</li>
                <li>• Note-taking (Obsidian, Notion, etc.)</li>
                <li>• Knowledge bases and wikis</li>
                <li>• API documentation</li>
                <li>• Static site content (Hugo, Jekyll, etc.)</li>
                <li>• Anything stored in Git</li>
              </ul>
            </div>
            <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-4 text-blue-900 dark:text-blue-100">📄 Use Rich Text For:</h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>• Formal business documents</li>
                <li>• Collaborative documents with non-tech teams</li>
                <li>• Resumes and cover letters</li>
                <li>• Marketing materials and brochures</li>
                <li>• Academic papers (with specific formatting)</li>
                <li>• Print-ready documents</li>
                <li>• Documents requiring track changes</li>
                <li>• Complex layouts with graphics</li>
              </ul>
            </div>
          </div>
        </section>

        {/* The Hybrid Approach */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">The Best of Both Worlds</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Many professionals adopt a hybrid approach: write in Markdown for speed and portability, then convert to other formats when needed. Tools like <strong>Pandoc</strong> can convert Markdown to Word, PDF, HTML, and dozens of other formats.
            </p>
            <p>
              Platforms like <strong>Notion</strong> and <strong>Obsidian</strong> bridge both worlds—they offer rich-text-like editing while storing content in Markdown format behind the scenes. This gives you the benefits of both approaches.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">💡 Pro Tip</h4>
            <p className="text-purple-800 dark:text-purple-200">
              Even if your final output is a Word document, consider writing your first draft in Markdown. The distraction-free environment often leads to better, faster writing. Convert to rich text only for final formatting and layout.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-3xl p-8 md:p-12 border border-purple-200 dark:border-purple-800 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Try Markdown?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Experience the speed and simplicity of Markdown writing with our free online editor. No signup required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              Open Editor
            </Link>
            <Link 
              href="/markdown-tutorial"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-border px-8 text-base font-medium shadow transition-all hover:bg-accent hover:shadow-lg"
            >
              Learn Markdown
            </Link>
          </div>
        </section>

        {/* Related Guides */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Continue Reading</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/markdown-tutorial" className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all">
              <h3 className="font-bold group-hover:text-primary transition-colors">Learn Markdown Basics →</h3>
              <p className="text-sm text-muted-foreground mt-2">Our comprehensive tutorial for beginners.</p>
            </Link>
            <Link href="/guides/markdown-for-bloggers" className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all">
              <h3 className="font-bold group-hover:text-primary transition-colors">Markdown for Bloggers →</h3>
              <p className="text-sm text-muted-foreground mt-2">How content creators use Markdown for faster writing.</p>
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
}
