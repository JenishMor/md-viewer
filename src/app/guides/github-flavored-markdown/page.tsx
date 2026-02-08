import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Complete Guide to GitHub Flavored Markdown (GFM) | MDViewer',
  description: 'Master GitHub Flavored Markdown with our comprehensive guide. Learn tables, task lists, autolinks, strikethrough, syntax highlighting, and all GFM extensions used on GitHub.',
  keywords: [
    'github flavored markdown',
    'gfm guide',
    'gfm tutorial',
    'github markdown',
    'markdown tables',
    'task lists markdown',
    'syntax highlighting',
    'markdown autolinks',
    'strikethrough markdown',
  ],
  openGraph: {
    title: 'The Complete Guide to GitHub Flavored Markdown (GFM)',
    description: 'Master all GFM extensions—tables, task lists, autolinks, strikethrough, and syntax highlighting.',
    url: 'https://mdviewer.in/guides/github-flavored-markdown',
    type: 'article',
  },
  authors: [{ name: 'MDViewer Team' }],
};

export default function GFMGuide() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-foreground">GitHub Flavored Markdown</span>
        </nav>

        {/* Header */}
        <header className="space-y-6 border-b pb-10">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">GFM</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">15 min read</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">Updated Feb 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            The Complete Guide to GitHub Flavored Markdown (GFM)
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            GitHub Flavored Markdown (GFM) extends standard Markdown with powerful features like tables, task lists, and syntax highlighting. This comprehensive guide covers everything you need to master GFM for your GitHub projects.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="bg-muted/50 rounded-2xl p-6 border">
          <h2 className="text-lg font-bold mb-4">📑 In This Guide</h2>
          <ul className="grid md:grid-cols-2 gap-2 text-sm">
            <li><a href="#what-is-gfm" className="text-primary hover:underline">What is GitHub Flavored Markdown?</a></li>
            <li><a href="#tables" className="text-primary hover:underline">Tables</a></li>
            <li><a href="#task-lists" className="text-primary hover:underline">Task Lists (Checkboxes)</a></li>
            <li><a href="#strikethrough" className="text-primary hover:underline">Strikethrough</a></li>
            <li><a href="#autolinks" className="text-primary hover:underline">Autolinks</a></li>
            <li><a href="#syntax-highlighting" className="text-primary hover:underline">Syntax Highlighting</a></li>
            <li><a href="#footnotes" className="text-primary hover:underline">Footnotes</a></li>
            <li><a href="#emoji" className="text-primary hover:underline">Emoji Support</a></li>
            <li><a href="#mentions" className="text-primary hover:underline">@mentions and #references</a></li>
            <li><a href="#disallowed-html" className="text-primary hover:underline">Disallowed HTML</a></li>
          </ul>
        </nav>

        {/* What is GFM */}
        <section id="what-is-gfm" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">What is GitHub Flavored Markdown?</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              <strong>GitHub Flavored Markdown (GFM)</strong> is GitHub's own variant of Markdown that adds several extensions to the standard CommonMark specification. These extensions were developed to meet the needs of software developers who write documentation, issues, pull requests, and README files on GitHub.
            </p>
            <p>
              When you write Markdown on GitHub—whether in README files, issues, comments, or wikis—you're using GFM. The same applies to GitLab, which has adopted most GFM extensions, and many other platforms like Discord, Notion, and Slack that support subsets of GFM.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">🐙 GFM Specification</h4>
            <p className="text-green-800 dark:text-green-200">
              GFM is formally specified at <a href="https://github.github.com/gfm/" target="_blank" rel="noopener noreferrer" className="underline">github.github.com/gfm</a>. The specification is built on top of CommonMark and is maintained by GitHub's engineering team.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">GFM Extensions Overview</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-xl border">
                <span className="font-medium">📊 Tables</span>
                <p className="text-sm text-muted-foreground mt-1">Create structured data with rows and columns</p>
              </div>
              <div className="p-4 bg-card rounded-xl border">
                <span className="font-medium">☑️ Task Lists</span>
                <p className="text-sm text-muted-foreground mt-1">Interactive checkboxes for to-do items</p>
              </div>
              <div className="p-4 bg-card rounded-xl border">
                <span className="font-medium">~~Strikethrough~~</span>
                <p className="text-sm text-muted-foreground mt-1">Cross out text with double tildes</p>
              </div>
              <div className="p-4 bg-card rounded-xl border">
                <span className="font-medium">🔗 Autolinks</span>
                <p className="text-sm text-muted-foreground mt-1">URLs automatically become clickable</p>
              </div>
              <div className="p-4 bg-card rounded-xl border">
                <span className="font-medium">💻 Syntax Highlighting</span>
                <p className="text-sm text-muted-foreground mt-1">Colored code blocks for many languages</p>
              </div>
              <div className="p-4 bg-card rounded-xl border">
                <span className="font-medium">😄 Emoji</span>
                <p className="text-sm text-muted-foreground mt-1">Support for emoji shortcodes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tables */}
        <section id="tables" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Tables</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Tables are one of the most useful GFM extensions. They allow you to organize data in rows and columns without resorting to HTML. The syntax uses pipes (<code>|</code>) and hyphens (<code>-</code>).
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Basic Table Syntax</h3>
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
                  <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
                  <div>| Name | Role | Status |</div>
                  <div>| ---- | ---- | ------ |</div>
                  <div>| John | Dev | Active |</div>
                  <div>| Jane | Design | Active |</div>
                  <div>| Bob | PM | Away |</div>
                </div>
                <div className="bg-card rounded-xl p-6 border">
                  <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="p-2">John</td><td className="p-2">Dev</td><td className="p-2">Active</td></tr>
                      <tr className="border-b"><td className="p-2">Jane</td><td className="p-2">Design</td><td className="p-2">Active</td></tr>
                      <tr><td className="p-2">Bob</td><td className="p-2">PM</td><td className="p-2">Away</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Table Alignment</h3>
              <p className="text-muted-foreground">
                Use colons in the header separator row to control text alignment in each column:
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm overflow-x-auto">
                <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">ALIGNMENT SYNTAX</div>
                <div>| Left Align | Center | Right Align |</div>
                <div>| :--------- | :----: | ----------: |</div>
                <div>| Text here  | Text   | Numbers 123 |</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <code className="text-xs">:---</code>
                  <p className="text-muted-foreground mt-1">Left align</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <code className="text-xs">:---:</code>
                  <p className="text-muted-foreground mt-1">Center align</p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <code className="text-xs">---:</code>
                  <p className="text-muted-foreground mt-1">Right align</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm">
              <strong className="text-amber-800 dark:text-amber-200">💡 Pro Tip:</strong>{' '}
              <span className="text-amber-700 dark:text-amber-300">The pipes at the start and end of lines are optional, but including them makes tables easier to read in raw Markdown.</span>
            </div>
          </div>
        </section>

        {/* Task Lists */}
        <section id="task-lists" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Task Lists (Checkboxes)</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Task lists are interactive checklists that use a simple syntax. They're commonly used in issues, pull requests, and project documentation to track progress.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
              <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
              <div>- [x] Complete feature A</div>
              <div>- [x] Write unit tests</div>
              <div>- [ ] Code review</div>
              <div>- [ ] Deploy to production</div>
            </div>
            <div className="bg-card rounded-xl p-6 border">
              <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><input type="checkbox" checked disabled className="rounded" /> <span className="line-through text-muted-foreground">Complete feature A</span></li>
                <li className="flex items-center gap-2"><input type="checkbox" checked disabled className="rounded" /> <span className="line-through text-muted-foreground">Write unit tests</span></li>
                <li className="flex items-center gap-2"><input type="checkbox" disabled className="rounded" /> Code review</li>
                <li className="flex items-center gap-2"><input type="checkbox" disabled className="rounded" /> Deploy to production</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
            <strong className="text-blue-800 dark:text-blue-200">⚡ Interactive on GitHub:</strong>{' '}
            <span className="text-blue-700 dark:text-blue-300">On GitHub issues and pull requests, task lists are interactive—you can click to check/uncheck items directly!</span>
          </div>
        </section>

        {/* Strikethrough */}
        <section id="strikethrough" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Strikethrough</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Strikethrough text is created by wrapping text in double tildes (<code>~~</code>). It's useful for indicating deleted or deprecated content without removing it entirely.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Markdown</th>
                  <th className="text-left p-3 font-medium">Output</th>
                  <th className="text-left p-3 font-medium">Use Case</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="p-3 font-mono bg-muted/50">~~deleted text~~</td>
                  <td className="p-3"><s>deleted text</s></td>
                  <td className="p-3 text-muted-foreground">Removed content</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono bg-muted/50">~~$99~~ $79</td>
                  <td className="p-3"><s>$99</s> $79</td>
                  <td className="p-3 text-muted-foreground">Price changes</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono bg-muted/50">~~v1.0~~ v2.0</td>
                  <td className="p-3"><s>v1.0</s> v2.0</td>
                  <td className="p-3 text-muted-foreground">Version updates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Autolinks */}
        <section id="autolinks" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Autolinks</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              GFM automatically converts URLs and email addresses into clickable links. This applies to <code>http://</code>, <code>https://</code>, and <code>www.</code> URLs.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
            <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">EXAMPLES OF AUTOLINKS</div>
            <div className="space-y-2">
              <div>https://mdviewer.in → <span className="text-primary underline">clickable link</span></div>
              <div>www.example.com → <span className="text-primary underline">clickable link</span></div>
              <div>support@mdviewer.in → <span className="text-primary underline">mailto link</span></div>
            </div>
          </div>
        </section>

        {/* Syntax Highlighting */}
        <section id="syntax-highlighting" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Syntax Highlighting</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Code blocks in GFM support syntax highlighting for many programming languages. Simply add the language identifier after the opening triple backticks.
            </p>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
              <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">SYNTAX</div>
              <div>```language</div>
              <div>// your code here</div>
              <div>```</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Commonly Used Language Identifiers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'html', 'css', 'json', 'yaml', 'bash', 'sql', 'markdown'].map(lang => (
                  <div key={lang} className="px-3 py-2 bg-muted rounded-lg text-sm font-mono text-center">
                    {lang}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footnotes */}
        <section id="footnotes" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Footnotes</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Footnotes allow you to add notes and references without cluttering your main text. They're rendered at the bottom of the document.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
            <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
            <div>Here is a statement that needs a source[^1].</div>
            <div className="mt-2">[^1]: This is the footnote content.</div>
          </div>
        </section>

        {/* Emoji */}
        <section id="emoji" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Emoji Support</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              GitHub supports emoji shortcodes that convert to emoji characters. Use colons around the emoji name.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-xl border text-center">
              <code className="text-sm">:smile:</code>
              <div className="text-2xl mt-2">😄</div>
            </div>
            <div className="p-4 bg-card rounded-xl border text-center">
              <code className="text-sm">:rocket:</code>
              <div className="text-2xl mt-2">🚀</div>
            </div>
            <div className="p-4 bg-card rounded-xl border text-center">
              <code className="text-sm">:+1:</code>
              <div className="text-2xl mt-2">👍</div>
            </div>
            <div className="p-4 bg-card rounded-xl border text-center">
              <code className="text-sm">:fire:</code>
              <div className="text-2xl mt-2">🔥</div>
            </div>
            <div className="p-4 bg-card rounded-xl border text-center">
              <code className="text-sm">:warning:</code>
              <div className="text-2xl mt-2">⚠️</div>
            </div>
            <div className="p-4 bg-card rounded-xl border text-center">
              <code className="text-sm">:bug:</code>
              <div className="text-2xl mt-2">🐛</div>
            </div>
          </div>
        </section>

        {/* Mentions */}
        <section id="mentions" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">@mentions and #references</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              On GitHub, you can mention users and reference issues/PRs directly in your Markdown:
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Syntax</th>
                  <th className="text-left p-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="p-3 font-mono bg-muted/50">@username</td>
                  <td className="p-3">Links to user profile, notifies the user</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono bg-muted/50">#123</td>
                  <td className="p-3">Links to issue or PR #123</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-mono bg-muted/50">user/repo#123</td>
                  <td className="p-3">Links to issue in another repo</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono bg-muted/50">SHA hash (7+ chars)</td>
                  <td className="p-3">Links to specific commit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Disallowed HTML */}
        <section id="disallowed-html" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Disallowed HTML</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              While GFM allows inline HTML, certain tags are filtered out for security reasons. These include:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
              <h3 className="font-bold text-red-800 dark:text-red-200 mb-3">❌ Disallowed Tags</h3>
              <ul className="space-y-1 text-sm text-red-700 dark:text-red-300 font-mono">
                <li>&lt;script&gt;</li>
                <li>&lt;style&gt;</li>
                <li>&lt;iframe&gt;</li>
                <li>&lt;object&gt;</li>
                <li>&lt;embed&gt;</li>
                <li>&lt;form&gt;</li>
              </ul>
            </div>
            <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl">
              <h3 className="font-bold text-green-800 dark:text-green-200 mb-3">✅ Allowed Tags</h3>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300 font-mono">
                <li>&lt;details&gt; &lt;summary&gt;</li>
                <li>&lt;kbd&gt;</li>
                <li>&lt;sub&gt; &lt;sup&gt;</li>
                <li>&lt;br&gt;</li>
                <li>&lt;img&gt; (with restrictions)</li>
                <li>&lt;a&gt; (href only)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-3xl p-8 md:p-12 border border-green-200 dark:border-green-800 text-center space-y-6">
          <h2 className="text-3xl font-bold">Practice GFM in Our Editor</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            MDViewer fully supports GitHub Flavored Markdown. Try out tables, task lists, and syntax highlighting with instant preview.
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

        {/* Related Guides */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Related Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/markdown-tutorial" className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all">
              <h3 className="font-bold group-hover:text-primary transition-colors">Complete Markdown Tutorial →</h3>
              <p className="text-sm text-muted-foreground mt-2">Learn the fundamentals before diving into GFM extensions.</p>
            </Link>
            <Link href="/guides/markdown-tables-guide" className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all">
              <h3 className="font-bold group-hover:text-primary transition-colors">Markdown Tables Deep Dive →</h3>
              <p className="text-sm text-muted-foreground mt-2">Advanced table techniques and styling options.</p>
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
}
