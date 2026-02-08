import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Common Markdown Mistakes and How to Avoid Them | MDViewer',
  description: 'Avoid frustrating formatting issues with this guide to the most common Markdown mistakes developers make. Learn proper syntax, spacing, and escape techniques.',
  keywords: [
    'markdown mistakes',
    'markdown errors',
    'markdown troubleshooting',
    'markdown not rendering',
    'markdown syntax errors',
    'markdown formatting issues',
  ],
  openGraph: {
    title: 'Common Markdown Mistakes and How to Avoid Them',
    description: 'Avoid frustrating formatting issues with this guide to the most common Markdown mistakes.',
    url: 'https://mdviewer.in/guides/common-markdown-mistakes',
    type: 'article',
  },
};

export default function CommonMarkdownMistakesGuide() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-foreground">Common Mistakes</span>
        </nav>

        {/* Header */}
        <header className="space-y-6 border-b pb-10">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">Troubleshooting</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">7 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Common Markdown Mistakes and How to Avoid Them
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Markdown is simple, but there are subtle gotchas that trip up beginners and experienced users alike. Learn to recognize and fix the most common formatting issues.
          </p>
        </header>

        {/* Mistakes List */}
        <section className="space-y-10">
          {/* Mistake 1 */}
          <div className="space-y-4 pb-8 border-b">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 font-bold text-red-600 dark:text-red-400">1</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-2xl font-bold">Forgetting Blank Lines</h2>
                <p className="text-muted-foreground">
                  Markdown often requires blank lines between different elements. Without them, content can render incorrectly or merge together unexpectedly.
                </p>
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
                    <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-2">❌ INCORRECT</div>
                    <div className="font-mono text-sm">
                      <div># Heading</div>
                      <div>Some paragraph text</div>
                      <div>- List item 1</div>
                      <div>- List item 2</div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-2">✅ CORRECT</div>
                    <div className="font-mono text-sm">
                      <div># Heading</div>
                      <div className="text-muted-foreground">(blank line)</div>
                      <div>Some paragraph text</div>
                      <div className="text-muted-foreground">(blank line)</div>
                      <div>- List item 1</div>
                      <div>- List item 2</div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
                  <strong className="text-blue-800 dark:text-blue-200">💡 Rule of thumb:</strong>{' '}
                  <span className="text-blue-700 dark:text-blue-300">Add a blank line before and after headings, lists, code blocks, and blockquotes.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mistake 2 */}
          <div className="space-y-4 pb-8 border-b">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 font-bold text-red-600 dark:text-red-400">2</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-2xl font-bold">Missing Space After Hash for Headings</h2>
                <p className="text-muted-foreground">
                  Headings require a space between the hash symbol(s) and the text. Without it, many parsers won't recognize it as a heading.
                </p>
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
                    <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-2">❌ INCORRECT</div>
                    <div className="font-mono text-sm">#This is a heading</div>
                    <div className="mt-2 text-sm text-muted-foreground">Renders as: #This is a heading</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-2">✅ CORRECT</div>
                    <div className="font-mono text-sm"># This is a heading</div>
                    <div className="mt-2 text-sm text-muted-foreground">Renders as: <span className="font-bold text-lg">This is a heading</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mistake 3 */}
          <div className="space-y-4 pb-8 border-b">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 font-bold text-red-600 dark:text-red-400">3</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-2xl font-bold">Inconsistent List Indentation</h2>
                <p className="text-muted-foreground">
                  Nested lists require consistent indentation (usually 2 or 4 spaces). Mixing tabs and spaces or using inconsistent indentation breaks the hierarchy.
                </p>
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
                    <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-2">❌ INCORRECT</div>
                    <div className="font-mono text-sm">
                      <div>- Item 1</div>
                      <div>&nbsp;- Sub-item (1 space)</div>
                      <div>&nbsp;&nbsp;&nbsp;- Another (3 spaces)</div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-2">✅ CORRECT</div>
                    <div className="font-mono text-sm">
                      <div>- Item 1</div>
                      <div>&nbsp;&nbsp;- Sub-item (2 spaces)</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;- Nested (4 spaces)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mistake 4 */}
          <div className="space-y-4 pb-8 border-b">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 font-bold text-red-600 dark:text-red-400">4</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-2xl font-bold">Wrong Link Syntax Order</h2>
                <p className="text-muted-foreground">
                  Link syntax is [text](url), with square brackets first. Many beginners swap the order or forget which type of bracket to use.
                </p>
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
                    <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-2">❌ INCORRECT</div>
                    <div className="font-mono text-sm space-y-1">
                      <div>(Click here)[https://example.com]</div>
                      <div>[Click here](example.com)</div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-2">✅ CORRECT</div>
                    <div className="font-mono text-sm">[Click here](https://example.com)</div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
                  <strong className="text-blue-800 dark:text-blue-200">💡 Memory trick:</strong>{' '}
                  <span className="text-blue-700 dark:text-blue-300">"Text comes first, then the parenthetical URL" — or think of it as [label](destination).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mistake 5 */}
          <div className="space-y-4 pb-8 border-b">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 font-bold text-red-600 dark:text-red-400">5</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-2xl font-bold">Not Escaping Special Characters</h2>
                <p className="text-muted-foreground">
                  Characters like *, _, #, and ` have special meaning in Markdown. To display them literally, you need to escape them with a backslash.
                </p>
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
                    <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-2">❌ INCORRECT</div>
                    <div className="font-mono text-sm">Use *asterisks* for emphasis</div>
                    <div className="mt-2 text-sm text-muted-foreground">Renders as: Use <em>asterisks</em> for emphasis</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-2">✅ CORRECT</div>
                    <div className="font-mono text-sm">Use \*asterisks\* for emphasis</div>
                    <div className="mt-2 text-sm text-muted-foreground">Renders as: Use *asterisks* for emphasis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mistake 6 */}
          <div className="space-y-4 pb-8 border-b">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 font-bold text-red-600 dark:text-red-400">6</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-2xl font-bold">Code Blocks Without Language Specifier</h2>
                <p className="text-muted-foreground">
                  While code blocks work without a language, adding the language enables syntax highlighting and makes code much more readable.
                </p>
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
                    <div className="text-xs font-medium text-red-800 dark:text-red-200 mb-2">❌ LESS READABLE</div>
                    <div className="font-mono text-sm">
                      <div>```</div>
                      <div>function hello()</div>
                      <div>```</div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-2">✅ MUCH BETTER</div>
                    <div className="font-mono text-sm">
                      <div>```javascript</div>
                      <div>function hello()</div>
                      <div>```</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mistake 7 */}
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 font-bold text-red-600 dark:text-red-400">7</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-2xl font-bold">Trailing Spaces vs. Line Breaks</h2>
                <p className="text-muted-foreground">
                  In standard Markdown, a single newline doesn't create a new line in the output. You need two spaces at the end of a line, or a blank line for a new paragraph.
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <div className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Different Markdown flavors handle this differently:</div>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• <strong>GitHub Flavored Markdown:</strong> Newlines create line breaks</li>
                    <li>• <strong>Standard Markdown:</strong> Need two trailing spaces or blank line</li>
                    <li>• <strong>CommonMark:</strong> Need backslash or two spaces for hard break</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Quick Reference: Common Fixes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Problem</th>
                  <th className="text-left p-4 font-semibold">Solution</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-4">Heading not rendering</td><td className="p-4">Add space after # and blank line before/after</td></tr>
                <tr className="border-b"><td className="p-4">List items merging</td><td className="p-4">Add blank line before list, use consistent spacing</td></tr>
                <tr className="border-b"><td className="p-4">Link not clickable</td><td className="p-4">Check [text](url) order, include https://</td></tr>
                <tr className="border-b"><td className="p-4">Code block not formatted</td><td className="p-4">Use three backticks, add language specifier</td></tr>
                <tr className="border-b"><td className="p-4">Special character appearing</td><td className="p-4">Escape with backslash: \* \_ \#</td></tr>
                <tr><td className="p-4">Text running together</td><td className="p-4">Add blank lines between sections</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-3xl p-8 md:p-12 border border-red-200 dark:border-red-800 text-center space-y-6">
          <h2 className="text-3xl font-bold">Practice Makes Perfect</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Use MDViewer to experiment with Markdown syntax and see instant previews. It's the fastest way to learn correct formatting.
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
      </article>
    </Layout>
  );
}
