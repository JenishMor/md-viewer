import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { MarkdownToHtmlConverter } from "@/components/markdown-to-html-converter";
import { pageMetadata, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Markdown to HTML Converter (Free & Private)",
  description:
    "Convert Markdown to clean HTML instantly. Supports GitHub Flavored Markdown tables, task lists and code blocks, sanitizes inline HTML, and runs entirely in your browser.",
  path: "/markdown-to-html",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Markdown to HTML Converter",
      url: `${SITE_URL}/markdown-to-html`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Markdown to HTML", item: `${SITE_URL}/markdown-to-html` },
      ],
    },
  ],
};

const supported = [
  ["Headings, paragraphs, emphasis", "<h1>–<h6>, <p>, <strong>, <em>"],
  ["Links and images", "<a href>, <img src alt>"],
  ["Lists and task lists", "<ul>, <ol>, <li> with checkbox <input>"],
  ["Tables with alignment", "<table> with align attributes"],
  ["Fenced code blocks", '<pre><code class="language-…">'],
  ["Footnotes, strikethrough, autolinks", "GitHub Flavored Markdown output"],
];

export default function MarkdownToHtmlPage() {
  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto mb-8 max-w-3xl text-center">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-4xl">Markdown to HTML Converter</h1>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Paste Markdown and get clean, sanitized HTML to copy or download.
          Conversion happens in your browser — your text is never uploaded.
        </p>
      </section>

      <MarkdownToHtmlConverter />

      <div className="mx-auto mt-16 max-w-3xl space-y-12 border-t border-border pt-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">How the conversion works</h2>
          <p className="leading-relaxed text-muted-foreground">
            The converter parses CommonMark plus GitHub Flavored Markdown with the{" "}
            <a className="text-primary hover:underline" href="https://unifiedjs.com/" target="_blank" rel="noopener noreferrer">
              unified
            </a>{" "}
            toolchain (remark and rehype), the same engine MDViewer&apos;s editor uses. The output is
            an HTML fragment with no styles or scripts, ready to paste into a CMS, an email
            template or your own page. Tick <em>Full HTML document</em> to wrap it in a complete page.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 font-semibold">Markdown</th>
                  <th className="py-2 font-semibold">HTML output</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {supported.map(([md, html]) => (
                  <tr key={md} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4">{md}</td>
                    <td className="py-2 font-mono text-xs">{html}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Safe by default</h2>
          <p className="leading-relaxed text-muted-foreground">
            Markdown may contain raw HTML. The converter keeps harmless tags such as{" "}
            <code>&lt;details&gt;</code>, <code>&lt;kbd&gt;</code> and <code>&lt;sup&gt;</code>, and
            removes scripts, styles, iframes, event handlers like <code>onclick</code> and{" "}
            <code>javascript:</code> links, using GitHub&apos;s sanitization allow-list. The result is
            safe to embed even if the Markdown came from someone else.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Questions</h2>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Does the HTML include CSS?</h3>
            <p className="leading-relaxed text-muted-foreground">
              No. You get semantic HTML that inherits your site&apos;s styles. If you want a styled,
              standalone page with diagrams and charts, use <strong>Export → Download HTML</strong> in
              the <Link href="/" className="text-primary hover:underline">Markdown editor</Link>.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">What about code highlighting, diagrams and math?</h3>
            <p className="leading-relaxed text-muted-foreground">
              Fenced code keeps its <code>language-…</code> class. Turn on syntax-highlighting classes
              to add highlight.js markup, then include any highlight.js theme on your page. Mermaid
              diagrams and math are left as code for a client-side renderer to process.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">What happens to YAML frontmatter?</h3>
            <p className="leading-relaxed text-muted-foreground">
              Frontmatter is metadata, not content, so it&apos;s left out of the HTML.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">How do I convert HTML back to Markdown?</h3>
            <p className="leading-relaxed text-muted-foreground">
              Paste formatted content into the editor&apos;s Visual mode, or paste text copied from Word or
              Google Docs into Markdown mode — MDViewer converts it to Markdown. See the{" "}
              <Link href="/guides/editor-features#paste" className="text-primary hover:underline">
                paste guide
              </Link>
              .
            </p>
          </div>
        </section>

        <p className="text-muted-foreground">
          New to the syntax? Start with the{" "}
          <Link href="/markdown-tutorial" className="text-primary hover:underline">Markdown tutorial</Link>{" "}
          or browse the <Link href="/guides" className="text-primary hover:underline">guides</Link>.
        </p>
      </div>
    </Layout>
  );
}
