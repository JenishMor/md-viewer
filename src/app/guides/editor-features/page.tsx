import { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { Layout } from "@/components/layout";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Editor Guide: Diagrams, Charts, Math & Export",
  description:
    "How to use Mermaid diagrams, Chart.js charts, KaTeX math, the visual editor, Word and Google Docs paste, local documents, import, export and share links in MDViewer.",
  path: "/guides/editor-features",
  type: "article",
});

const sections = [
  ["modes", "Markdown and Visual modes"],
  ["mermaid", "Mermaid diagrams"],
  ["charts", "Charts (Chart.js)"],
  ["math", "Math (KaTeX)"],
  ["paste", "Pasting from Word and Google Docs"],
  ["documents", "Local documents and autosave"],
  ["import-export", "Import and export"],
  ["sharing", "Sharing and publishing"],
  ["html", "Raw HTML and remote content"],
  ["shortcuts", "Keyboard shortcuts"],
] as const;

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-slate-900 text-slate-50 p-4 rounded-xl overflow-x-auto text-sm">
      <code>{children}</code>
    </pre>
  );
}

const h2 = "text-3xl font-bold";
const p = "text-muted-foreground leading-relaxed";
const list = "list-disc pl-6 space-y-2 text-muted-foreground";

export default function EditorFeaturesGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: "MDViewer Editor Guide: Mermaid Diagrams, Charts, Math, Visual Editing & Export",
        publisher: { "@type": "Organization", name: "MDViewer", url: "https://www.mdviewer.in" },
        datePublished: "2026-10-31",
        dateModified: "2026-10-31",
        mainEntityOfPage: "https://www.mdviewer.in/guides/editor-features",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mdviewer.in" },
          { "@type": "ListItem", position: 2, name: "Guides", item: "https://www.mdviewer.in/guides" },
          { "@type": "ListItem", position: 3, name: "Editor features", item: "https://www.mdviewer.in/guides/editor-features" },
        ],
      },
    ],
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-12 w-full min-w-0 break-words">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-foreground">Editor features</span>
        </nav>

        <header className="space-y-6 border-b pb-10">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              Using MDViewer
            </span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">10 min read</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">Updated Oct 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Editor Guide: Diagrams, Charts, Math, Visual Editing &amp; Export
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything the MDViewer editor can do beyond standard Markdown —
            how each feature works, the exact syntax, and what it can&apos;t do yet.
            All of it runs in your browser.
          </p>
        </header>

        <nav className="bg-muted/50 rounded-2xl p-6 border" aria-label="In this guide">
          <h2 className="text-lg font-bold mb-4">In this guide</h2>
          <ul className="grid md:grid-cols-2 gap-2 text-sm">
            {sections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-primary hover:underline">{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <section id="modes" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Markdown and Visual modes</h2>
          <p className={p}>
            Use the <strong>Markdown / Visual</strong> switch above the editor (or{" "}
            <kbd>Ctrl/⌘ + Shift + M</kbd>). Markdown mode edits the source text.
            Visual mode lets you format with toolbar buttons and shortcuts —
            headings, bold, italic, strikethrough, inline code, links, images,
            bulleted, numbered and task lists, blockquotes, code blocks, tables and
            horizontal rules — without typing Markdown syntax.
          </p>
          <ul className={list}>
            <li>
              The Markdown source is always the saved version. Switching modes
              without editing never changes it.
            </li>
            <li>
              Syntax the visual editor can&apos;t represent — frontmatter, math,
              raw HTML and footnotes — is kept exactly as written. It appears as
              grey &quot;Markdown source&quot; blocks or inline chips; double-click
              a chip to edit it.
            </li>
            <li>
              When you edit in Visual mode, MDViewer rewrites the Markdown in a
              consistent style: <code>-</code> for bullets, <code>*</code> for
              emphasis, and reference-style links become inline links.
            </li>
            <li>
              To create a diagram or chart visually, insert a code block and type{" "}
              <code>mermaid</code> or <code>chartjs</code> in its language box.
            </li>
            <li>The preview&apos;s task checkboxes can be clicked to tick tasks off in the source.</li>
          </ul>
        </section>

        <section id="mermaid" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Mermaid diagrams</h2>
          <p className={p}>Write diagrams in a fenced code block with the <code>mermaid</code> language:</p>
          <Code>{`\`\`\`mermaid
flowchart TD
  A[Start] --> B{Valid?}
  B -->|Yes| C[Continue]
  B -->|No| D[Fix input]
\`\`\``}</Code>
          <ul className={list}>
            <li>
              Supported types include flowcharts, sequence, class, state, entity
              relationship, Gantt, pie and mindmap diagrams, plus the other types
              in Mermaid 12. See the{" "}
              <a className="text-primary hover:underline" href="https://mermaid.js.org/intro/" target="_blank" rel="noopener noreferrer">
                Mermaid documentation
              </a>{" "}
              for syntax.
            </li>
            <li>
              A syntax error shows a message and the source for that diagram
              only; the rest of the document keeps rendering.
            </li>
            <li>Each diagram has zoom controls and a copy-source button, and follows the light or dark theme.</li>
            <li>
              Diagrams run in Mermaid&apos;s strict security mode: click events
              are disabled and HTML in labels is sanitized.
            </li>
            <li>HTML export and print keep diagrams as vector graphics.</li>
          </ul>
        </section>

        <section id="charts" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Charts (Chart.js)</h2>
          <p className={p}>
            Charts aren&apos;t part of standard Markdown, so MDViewer uses an
            explicit convention: a fenced code block with the{" "}
            <code>chartjs</code> language containing a JSON chart configuration.
          </p>
          <Code>{`\`\`\`chartjs
{
  "type": "bar",
  "data": {
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [
      { "label": "Sales", "data": [12, 19, 15] }
    ]
  },
  "options": {
    "plugins": { "title": { "text": "Q1 sales" } },
    "scales": { "y": { "beginAtZero": true } }
  }
}
\`\`\``}</Code>
          <ul className={list}>
            <li>
              <strong>Types:</strong> <code>bar</code>, <code>line</code>,{" "}
              <code>pie</code>, <code>doughnut</code>, <code>radar</code>,{" "}
              <code>polarArea</code>, <code>scatter</code> and <code>bubble</code>.
              Scatter and bubble data use <code>{`{"x": 1, "y": 2, "r": 5}`}</code> points.
            </li>
            <li>
              <strong>Dataset fields:</strong> <code>label</code>, <code>data</code>,{" "}
              <code>backgroundColor</code>, <code>borderColor</code>,{" "}
              <code>borderWidth</code>, <code>fill</code>, <code>tension</code>,{" "}
              <code>pointRadius</code>, <code>hidden</code>, <code>stack</code> and a
              per-dataset <code>type</code> for mixed charts. Colors may be hex,{" "}
              <code>rgb()</code>, <code>hsl()</code> or named colors; if you leave
              them out, a colorblind-safe palette is used for both themes.
            </li>
            <li>
              <strong>Options:</strong> <code>plugins.title.text</code>,{" "}
              <code>plugins.legend.display</code> / <code>position</code>,{" "}
              <code>indexAxis</code>, and per-axis <code>beginAtZero</code>,{" "}
              <code>stacked</code>, <code>min</code>, <code>max</code> and{" "}
              <code>title</code> under <code>scales.x</code> / <code>scales.y</code>.
              Other options are ignored.
            </li>
            <li>
              Only plain JSON is accepted. Functions, callbacks, plugins and
              external resources are never executed or loaded. Limits: 20
              datasets and 2,000 data points per chart.
            </li>
            <li>Invalid JSON or an unsupported setting shows an error for that chart only.</li>
            <li>
              Each chart has a text description and a data table for screen
              readers. In HTML export and print, charts become static images.
            </li>
          </ul>
        </section>

        <section id="math" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Math (KaTeX)</h2>
          <p className={p}>
            Use <code>$…$</code> for inline math and <code>$$…$$</code> on their
            own lines for display math. Rendering uses{" "}
            <a className="text-primary hover:underline" href="https://katex.org/docs/supported.html" target="_blank" rel="noopener noreferrer">
              KaTeX
            </a>
            , which supports fractions, roots, matrices, <code>aligned</code>{" "}
            environments, Greek letters, sub- and superscripts and most common
            LaTeX math commands.
          </p>
          <Code>{`Inline: $E = mc^2$

$$
\\begin{aligned}
  x &= \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\\\
  A &= \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}
\\end{aligned}
$$`}</Code>
          <ul className={list}>
            <li>An invalid expression is shown in red with its source; the rest of the document renders normally.</li>
            <li>Long equations scroll horizontally instead of overflowing small screens.</li>
            <li>
              KaTeX is not full LaTeX: document-level commands, packages and
              custom macros defined with <code>\newcommand</code> across blocks
              are not supported.
            </li>
            <li>Exported HTML loads KaTeX styles from the jsDelivr CDN, so math needs an internet connection to display correctly.</li>
          </ul>
        </section>

        <section id="paste" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Pasting from Word and Google Docs</h2>
          <p className={p}>
            Paste formatted text in Visual mode and MDViewer keeps its structure:
            headings, paragraphs, bold, italic, strikethrough, bulleted and
            numbered lists (including Word&apos;s lists), links, tables and images
            hosted at public URLs. In Markdown mode, text copied from Word or
            Google Docs is converted to Markdown automatically. Conversion
            happens in your browser — clipboard content is never uploaded.
          </p>
          <ul className={list}>
            <li>Fonts, colors, sizes, Word styles, comments and tracked-change markup are removed.</li>
            <li>
              Images stored on your computer (which Word pastes as local files)
              can&apos;t be pasted; they&apos;re replaced with an{" "}
              <code>[image omitted]</code> note and a warning. Upload them and
              insert them by URL.
            </li>
            <li>Merged table cells, text boxes, footnotes and embedded objects aren&apos;t converted.</li>
            <li>
              Links are kept only if they use <code>http</code>,{" "}
              <code>https</code> or <code>mailto</code>.
            </li>
            <li>
              To paste without formatting, use <kbd>Ctrl/⌘ + Shift + V</kbd>.
              Plain text is always pasted unchanged.
            </li>
          </ul>
        </section>

        <section id="documents" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Local documents and autosave</h2>
          <ul className={list}>
            <li>
              Documents save automatically in your browser&apos;s local storage
              shortly after you stop typing, and immediately when you switch
              tabs or close the page. The status next to <em>Documents</em> shows
              &quot;Saving…&quot;, &quot;Saved locally&quot; or an error.{" "}
              <kbd>Ctrl/⌘ + S</kbd> saves immediately.
            </li>
            <li>
              Open <strong>Documents</strong> to create, rename, duplicate, delete
              and reopen documents. Deleted documents move to{" "}
              <em>Recently deleted</em> for 30 days, where you can restore them.
            </li>
            <li>
              Browsers usually allow about 5 MB of local storage per site. If it
              fills up, MDViewer shows &quot;Not saved&quot; — your text stays on
              screen, so export it or delete old documents.
            </li>
            <li>
              In private browsing or with site data blocked, documents can&apos;t
              be saved and are lost when the tab closes; MDViewer warns you when
              this happens.
            </li>
            <li>
              Local storage is <strong>not a backup</strong> and is not synced
              between browsers or devices. <em>Clear all local data</em> in
              Documents removes everything MDViewer stored in this browser.
            </li>
          </ul>
        </section>

        <section id="import-export" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Import and export</h2>
          <p className={p}>
            <strong>Open file</strong> (or drag a file onto the editor) opens{" "}
            <code>.md</code>, <code>.markdown</code> and <code>.txt</code> files up
            to 10 MB as UTF-8 text in a new document, so your current work is
            never replaced. Files are read locally and not uploaded.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Export option</th>
                  <th className="text-left py-2">What you get</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-2 pr-4">Download Markdown</td><td className="py-2">Your exact source as a <code>.md</code> file.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Download HTML</td><td className="py-2">A standalone page with styles. Diagrams stay as SVG; charts become PNG images; math styles load from a CDN.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Print / Save as PDF</td><td className="py-2">Opens your browser&apos;s print dialog with a clean print layout. Choose &quot;Save as PDF&quot; there — MDViewer doesn&apos;t generate PDF files itself.</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Copy Markdown</td><td className="py-2">The source text on your clipboard.</td></tr>
                <tr><td className="py-2 pr-4">Copy rendered HTML</td><td className="py-2">Formatted content for pasting into Google Docs, email or a blog editor.</td></tr>
              </tbody>
            </table>
          </div>
          <p className={p}>
            File names come from the document name (or its first heading), with
            characters that aren&apos;t allowed in file names removed. If the
            browser blocks clipboard access, MDViewer tells you and you can use a
            download option instead.
          </p>
        </section>

        <section id="sharing" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Sharing and publishing</h2>
          <p className={p}>Nothing is published automatically. <strong>Share</strong> offers two explicit options:</p>
          <ul className={list}>
            <li>
              <strong>Share link</strong> — compresses the whole document into the
              link after the <code>#</code>. That part of a URL isn&apos;t sent to
              our servers. Anyone with the link can read the document, the link
              can&apos;t be revoked or expire, and very large documents can&apos;t be
              shared this way. You must confirm before the link is created.
              Opening a link adds a copy to the recipient&apos;s documents.
            </li>
            <li>
              <strong>Copy for blog platforms</strong> — preview exactly what will
              be copied, then paste it into WordPress, Blogger, Medium, Ghost or
              similar editors yourself. Images need public URLs, and some
              platforms strip inline SVG diagrams.
            </li>
          </ul>
          <p className={p}>
            Cloud sync (Google Drive, Dropbox, GitHub), direct publishing to
            other platforms and hosted public pages are <strong>not available</strong>{" "}
            yet. MDViewer does not upload your documents anywhere.
          </p>
        </section>

        <section id="html" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Raw HTML and remote content</h2>
          <ul className={list}>
            <li>
              Inline HTML is rendered after sanitizing with GitHub&apos;s
              allow-list: tags like <code>&lt;details&gt;</code>,{" "}
              <code>&lt;summary&gt;</code>, <code>&lt;kbd&gt;</code>,{" "}
              <code>&lt;sup&gt;</code> and <code>&lt;sub&gt;</code> work.
            </li>
            <li>
              Scripts, styles, iframes, forms, event handlers such as{" "}
              <code>onclick</code>, and <code>javascript:</code> links are removed.
            </li>
            <li>
              Images load directly from their URLs (<code>https</code> or{" "}
              <code>data:</code>), so the image host can see your IP address.
            </li>
            <li>YAML or TOML frontmatter at the top of a document is shown as a labelled block.</li>
          </ul>
        </section>

        <section id="shortcuts" className="space-y-4 scroll-mt-20">
          <h2 className={h2}>Keyboard shortcuts</h2>
          <p className={p}>
            The keyboard button in the editor toolbar lists every shortcut. The
            most useful ones:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <tbody className="text-muted-foreground">
                {[
                  ["Ctrl/⌘ + P", "Command palette"],
                  ["Ctrl/⌘ + S", "Save now"],
                  ["Ctrl/⌘ + Shift + M", "Switch Markdown / Visual mode"],
                  ["Ctrl/⌘ + B / I / K", "Bold / italic / link"],
                  ["Ctrl/⌘ + Z, Ctrl/⌘ + Shift + Z", "Undo, redo"],
                  ["Ctrl/⌘ + Shift + K (Markdown) / Ctrl/⌘ + E (Visual)", "Inline code"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b last:border-0">
                    <td className="py-2 pr-4"><kbd>{k}</kbd></td>
                    <td className="py-2">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-8 border border-blue-200 dark:border-blue-800 text-center space-y-4">
          <h2 className="text-2xl font-bold">Try it in the editor</h2>
          <p className={p}>
            Open <strong>Templates → Diagrams, Charts &amp; Math</strong> in the
            editor to insert ready-made examples.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            Open the editor
          </Link>
        </section>
      </article>
    </Layout>
  );
}
