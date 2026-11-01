import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Eye,
  FileCode2,
  FileDown,
  FolderOpen,
  Lock,
  PenLine,
  Workflow,
} from "lucide-react";

const steps = [
  {
    title: "Open or paste your Markdown",
    body: "Choose Open file, drag a .md file onto the editor, or paste text. Files are read in your browser — nothing is uploaded.",
  },
  {
    title: "Edit with a live preview",
    body: "The preview updates as you type. Switch to Visual mode to format without writing syntax.",
  },
  {
    title: "Export or share",
    body: "Download Markdown or a standalone HTML page, print to PDF, copy rich text, or create a share link.",
  },
];

const features = [
  {
    icon: Eye,
    title: "Accurate GitHub-style preview",
    body: "GitHub Flavored Markdown: tables, task lists, footnotes, strikethrough, autolinks and syntax highlighting for common languages.",
    href: "/guides/github-flavored-markdown",
    link: "GFM guide",
  },
  {
    icon: PenLine,
    title: "Markdown or visual editing",
    body: "Write Markdown directly, or format visually like a word processor. Content you paste from Word or Google Docs is converted to clean Markdown.",
    href: "/guides/editor-features#modes",
    link: "How modes work",
  },
  {
    icon: Workflow,
    title: "Diagrams, charts and math",
    body: "Render Mermaid diagrams, Chart.js charts from JSON, and LaTeX math with KaTeX — right inside your document.",
    href: "/guides/editor-features#mermaid",
    link: "Syntax and examples",
  },
  {
    icon: FileDown,
    title: "Import and export",
    body: "Open .md and .txt files. Export Markdown, standalone HTML or PDF, or copy formatted text for a blog or document.",
    href: "/markdown-to-html",
    link: "Markdown to HTML",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "No account. Documents are saved in your browser's local storage, not on our servers. Clear them any time.",
    href: "/privacy-policy",
    link: "Privacy policy",
  },
  {
    icon: FolderOpen,
    title: "Multiple documents",
    body: "Keep several documents in tabs with autosave, rename and duplicate them, and restore anything deleted in the last 30 days.",
    href: "/guides/editor-features#documents",
    link: "Local documents",
  },
];

const resources = [
  {
    icon: BookOpen,
    title: "Markdown tutorial",
    body: "Learn the syntax step by step, from headings to tables.",
    href: "/markdown-tutorial",
  },
  {
    icon: Code2,
    title: "Markdown to HTML converter",
    body: "Turn Markdown into clean, sanitized HTML you can paste anywhere.",
    href: "/markdown-to-html",
  },
  {
    icon: FileCode2,
    title: "README guide",
    body: "Structure and examples for README files people actually read.",
    href: "/guides/readme-best-practices",
  },
];

const faqs = [
  {
    q: "What is a Markdown viewer?",
    a: "A Markdown viewer renders a .md file as formatted text — headings, lists, links, tables and code — instead of showing the raw syntax. MDViewer is a viewer and an editor: you can read a file and change it with a side-by-side preview.",
  },
  {
    q: "How do I open a .md file online?",
    a: "Click Open file above the editor or drag the file onto it. The file is read by your browser and opens as a new document, so your existing work isn't replaced.",
  },
  {
    q: "Is MDViewer free?",
    a: "Yes. There's no account, subscription or usage limit. The site is supported by advertising.",
  },
  {
    q: "Where are my documents stored?",
    a: "In your browser's local storage on this device. They aren't uploaded to our servers, backed up or synced between devices, so export anything important. You can delete everything from Documents → Clear all local data.",
  },
  {
    q: "Does it render Markdown the same way as GitHub?",
    a: "MDViewer supports GitHub Flavored Markdown, including tables, task lists, footnotes and autolinks, and sanitizes inline HTML using GitHub's allow-list, so READMEs look very close to how GitHub displays them.",
  },
  {
    q: "Can I convert Markdown to PDF or HTML?",
    a: "Yes. Use Export to download a standalone HTML file or open your browser's print dialog and choose Save as PDF. The Markdown to HTML converter gives you the raw HTML source.",
  },
];

/** Server-rendered explanatory content below the editor. */
export function HomeContent() {
  return (
    <div className="space-y-20 border-t border-border py-12">
      <section aria-labelledby="how-it-works" className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3 text-center">
          <h2 id="how-it-works" className="text-3xl font-bold tracking-tight">
            View and edit Markdown files online
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            MDViewer opens Markdown files in your browser and shows them the way
            they&apos;ll look on GitHub, a docs site or a blog — no install, no
            sign-up.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-border bg-card p-6">
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="features" className="mx-auto max-w-5xl space-y-8">
        <h2 id="features" className="text-center text-3xl font-bold tracking-tight">
          What you can do with MDViewer
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body, href, link }) => (
            <div key={title} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <Icon className="mb-4 h-6 w-6 text-primary" aria-hidden />
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="mb-4 flex-1 text-muted-foreground leading-relaxed">{body}</p>
              <Link
                href={href}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {link} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="learn" className="mx-auto max-w-5xl space-y-8">
        <h2 id="learn" className="text-center text-3xl font-bold tracking-tight">
          Learn and convert Markdown
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {resources.map(({ icon: Icon, title, body, href }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary"
            >
              <Icon className="mb-4 h-6 w-6 text-primary" aria-hidden />
              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{body}</p>
            </Link>
          ))}
        </div>
        <p className="text-center">
          <Link href="/guides" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            Browse all Markdown guides <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </section>

      <section aria-labelledby="faq" className="mx-auto max-w-3xl space-y-6">
        <h2 id="faq" className="text-center text-3xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {faqs.map(({ q, a }) => (
            <div key={q} className="space-y-2 p-6">
              <h3 className="text-lg font-semibold">{q}</h3>
              <p className="text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
