import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Markdown Tables: From Basic to Advanced Styling | MDViewer',
  description: 'Master table creation in Markdown. Learn alignment, formatting within cells, and workarounds for complex table layouts. Complete guide with examples.',
  keywords: [
    'markdown tables',
    'markdown table alignment',
    'gfm tables',
    'markdown table formatting',
    'table in markdown',
    'markdown table guide',
  ],
  openGraph: {
    title: 'Markdown Tables: From Basic to Advanced Styling',
    description: 'Master table creation in Markdown with alignment, cell formatting, and advanced techniques.',
    url: 'https://mdviewer.in/guides/markdown-tables-guide',
    type: 'article',
  },
};

export default function MarkdownTablesGuide() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-foreground">Markdown Tables</span>
        </nav>

        {/* Header */}
        <header className="space-y-6 border-b pb-10">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-medium">GFM</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">9 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Markdown Tables: From Basic to Advanced Styling
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Tables in Markdown are a GitHub Flavored Markdown extension that lets you organize data in rows and columns. This guide covers everything from basic syntax to advanced techniques for complex table layouts.
          </p>
        </header>

        {/* Basic Syntax */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Basic Table Syntax</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              A Markdown table consists of three parts: the header row, the delimiter row (which separates header from body), and the body rows. Use pipes (<code>|</code>) to separate columns and hyphens (<code>-</code>) in the delimiter row.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
              <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
              <div>| Product | Price | Stock |</div>
              <div>| ------- | ----- | ----- |</div>
              <div>| Widget  | $10   | 100   |</div>
              <div>| Gadget  | $25   | 50    |</div>
              <div>| Gizmo   | $15   | 75    |</div>
            </div>
            <div className="bg-card rounded-xl p-6 border">
              <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Product</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="p-2">Widget</td><td className="p-2">$10</td><td className="p-2">100</td></tr>
                  <tr className="border-b"><td className="p-2">Gadget</td><td className="p-2">$25</td><td className="p-2">50</td></tr>
                  <tr><td className="p-2">Gizmo</td><td className="p-2">$15</td><td className="p-2">75</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Alignment */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Column Alignment</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Control text alignment using colons in the delimiter row. This is especially useful for numeric data (right-align) or centered headers.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-card rounded-xl border">
              <code className="text-sm font-mono">:---</code>
              <p className="text-sm text-muted-foreground mt-2">Left align</p>
            </div>
            <div className="p-4 bg-card rounded-xl border">
              <code className="text-sm font-mono">:---:</code>
              <p className="text-sm text-muted-foreground mt-2">Center align</p>
            </div>
            <div className="p-4 bg-card rounded-xl border">
              <code className="text-sm font-mono">---:</code>
              <p className="text-sm text-muted-foreground mt-2">Right align</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
              <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">MARKDOWN</div>
              <div>| Item   | Quantity | Price   |</div>
              <div>| :----- | :------: | ------: |</div>
              <div>| Apple  |    10    |   $1.50 |</div>
              <div>| Banana |    25    |   $0.75 |</div>
              <div>| Orange |    15    |   $2.00 |</div>
            </div>
            <div className="bg-card rounded-xl p-6 border">
              <div className="text-xs text-muted-foreground mb-3 font-medium">RENDERED OUTPUT</div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Item</th>
                    <th className="text-center p-2">Quantity</th>
                    <th className="text-right p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="p-2 text-left">Apple</td><td className="p-2 text-center">10</td><td className="p-2 text-right">$1.50</td></tr>
                  <tr className="border-b"><td className="p-2 text-left">Banana</td><td className="p-2 text-center">25</td><td className="p-2 text-right">$0.75</td></tr>
                  <tr><td className="p-2 text-left">Orange</td><td className="p-2 text-center">15</td><td className="p-2 text-right">$2.00</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Formatting in Cells */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Formatting Within Cells</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              You can use inline Markdown formatting inside table cells: bold, italic, code, and links all work.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
            <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">EXAMPLES</div>
            <div>| Feature | Syntax | Example |</div>
            <div>| ------- | ------ | ------- |</div>
            <div>| Bold | `**text**` | **Important** |</div>
            <div>| Italic | `*text*` | *Emphasis* |</div>
            <div>| Code | `` `code` `` | `npm install` |</div>
            <div>| Link | `[text](url)` | [MDViewer](/) |</div>
          </div>
        </section>

        {/* Escaping Pipes */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Escaping Pipe Characters</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              If you need to include a literal pipe character (<code>|</code>) in a cell, escape it with a backslash: <code>\|</code>
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
            <div>| Operator | Symbol | Usage |</div>
            <div>| -------- | ------ | ----- |</div>
            <div>| OR       | \|     | a \| b |</div>
          </div>
        </section>

        {/* Limitations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Markdown Table Limitations</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Markdown tables have some limitations compared to HTML tables. Understanding these helps you know when to use alternatives.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-800">
              <h3 className="font-bold text-red-800 dark:text-red-200 mb-3">❌ Not Supported</h3>
              <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                <li>• Cell merging (colspan/rowspan)</li>
                <li>• Multi-line cell content</li>
                <li>• Nested tables</li>
                <li>• Custom cell styling</li>
                <li>• Table captions</li>
              </ul>
            </div>
            <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-800">
              <h3 className="font-bold text-green-800 dark:text-green-200 mb-3">✅ Workarounds</h3>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <li>• Use HTML tables for complex layouts</li>
                <li>• Use <code className="bg-muted px-1 rounded">&lt;br&gt;</code> for line breaks in cells</li>
                <li>• Keep tables simple for readability</li>
                <li>• Consider lists for complex data</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Best Practices</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <span className="text-green-500 font-bold text-lg">✓</span>
              <div>
                <h4 className="font-semibold">Align your pipes for readability</h4>
                <p className="text-sm text-muted-foreground mt-1">While not required, aligned pipes make raw Markdown much easier to read and edit.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <span className="text-green-500 font-bold text-lg">✓</span>
              <div>
                <h4 className="font-semibold">Keep tables narrow</h4>
                <p className="text-sm text-muted-foreground mt-1">Wide tables are hard to read on mobile. Consider breaking data into multiple smaller tables.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <span className="text-green-500 font-bold text-lg">✓</span>
              <div>
                <h4 className="font-semibold">Use descriptive headers</h4>
                <p className="text-sm text-muted-foreground mt-1">Headers should clearly describe what each column contains.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 rounded-3xl p-8 md:p-12 border border-cyan-200 dark:border-cyan-800 text-center space-y-6">
          <h2 className="text-3xl font-bold">Practice Building Tables</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Use MDViewer to experiment with table syntax and see instant previews of your tables.
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
      </article>
    </Layout>
  );
}
