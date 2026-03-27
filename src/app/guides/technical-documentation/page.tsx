import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { EditorialNote } from "@/components/editorial-note";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Creating Technical Documentation with Markdown | MDViewer",
  description:
    "Learn professional techniques for writing user guides, API docs, and knowledge bases using Markdown. Structure, style, and tools that documentation experts use.",
  keywords: [
    "technical documentation",
    "documentation markdown",
    "api documentation",
    "user guide markdown",
    "knowledge base",
    "technical writing",
    "docs as code",
  ],
  openGraph: {
    title: "Creating Technical Documentation with Markdown",
    description:
      "Professional techniques for writing user guides, API docs, and knowledge bases using Markdown.",
    url: "https://mdviewer.in/guides/technical-documentation",
    type: "article",
  },
  authors: [{ name: "Jenish Mor" }],
};

export default function TechnicalDocumentationGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: "Creating Technical Documentation with Markdown",
        description:
          "Learn professional techniques for writing user guides, API docs, and knowledge bases using Markdown. Structure, style, and tools that documentation experts use.",
        author: {
          "@type": "Person",
          name: "Jenish Mor",
          url: "https://mdviewer.in/about",
          sameAs: ["https://github.com/JenishMor"],
        },
        editor: {
          "@type": "Organization",
          name: "MDViewer Editorial Team",
          url: "https://mdviewer.in/about",
        },
        publisher: {
          "@type": "Organization",
          name: "MDViewer",
          url: "https://mdviewer.in",
          logo: {
            "@type": "ImageObject",
            url: "https://mdviewer.in/md-logo.png",
          },
        },
        datePublished: "2025-02-10",
        dateModified: "2026-03-22",
        mainEntityOfPage: "https://mdviewer.in/guides/technical-documentation",
        image: "https://mdviewer.in/md-logo.png",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://mdviewer.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: "https://mdviewer.in/guides",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Technical Documentation",
            item: "https://mdviewer.in/guides/technical-documentation",
          },
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
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/guides"
            className="hover:text-foreground transition-colors"
          >
            Guides
          </Link>
          <span>/</span>
          <span className="text-foreground">Technical Documentation</span>
        </nav>

        {/* Header */}
        <header className="space-y-6 border-b pb-10">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
              Documentation
            </span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
              14 min read
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              By <strong className="text-foreground">Jenish Mor</strong>
            </span>
            <span>·</span>
            <span>
              Reviewed by{" "}
              <strong className="text-foreground">
                MDViewer Editorial Team
              </strong>
            </span>
            <span>·</span>
            <time dateTime="2025-02-10">Published Feb 10, 2025</time>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Creating Technical Documentation with Markdown
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Great documentation is the difference between a product that
            frustrates users and one that delights them. Learn how to create
            professional technical documentation using Markdown—the same
            approach used by GitHub, Microsoft, and leading tech companies.
          </p>
        </header>

        <EditorialNote reviewedDate="March 2026" />

        {/* Why Docs Matter */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Why Documentation Matters</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Documentation is often an afterthought, but it's crucial to the
              success of any software project. In day-to-day engineering work,
              teams spend significant time understanding existing systems, and
              good documentation helps that work move faster. Good
              documentation:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <span className="font-semibold">📉 Reduces support burden</span>
              <p className="text-sm text-muted-foreground">
                Users can self-serve instead of filing tickets
              </p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <span className="font-semibold">🚀 Accelerates onboarding</span>
              <p className="text-sm text-muted-foreground">
                New team members become productive faster
              </p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <span className="font-semibold">🎯 Improves adoption</span>
              <p className="text-sm text-muted-foreground">
                Users are more likely to use well-documented features
              </p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <span className="font-semibold">🔄 Enables scaling</span>
              <p className="text-sm text-muted-foreground">
                Knowledge is shared without endless meetings
              </p>
            </div>
          </div>
        </section>

        {/* Docs-as-Code */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">The "Docs-as-Code" Philosophy</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              <strong>Docs-as-Code</strong> is an approach where documentation
              is treated with the same discipline as source code. This means:
            </p>
            <ul className="space-y-2">
              <li>Documentation lives alongside code in version control</li>
              <li>Changes go through pull request reviews</li>
              <li>Continuous integration builds and tests documentation</li>
              <li>Documentation is automatically deployed when merged</li>
            </ul>
            <p>
              Markdown is the foundation of docs-as-code because it's plain text
              (easily diffed), human-readable, and converts cleanly to HTML and
              other formats.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
              🔧 Popular Docs-as-Code Tools
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>
                • <strong>MkDocs</strong> — Python-based, Material theme
              </li>
              <li>
                • <strong>Docusaurus</strong> — React-based, by Meta
              </li>
              <li>
                • <strong>GitBook</strong> — Hosted platform with editor
              </li>
              <li>
                • <strong>VitePress</strong> — Vue-based static site generator
              </li>
              <li>
                • <strong>Sphinx</strong> — Python documentation standard
              </li>
            </ul>
          </div>
        </section>

        {/* Documentation Types */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">
            Types of Technical Documentation
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-2xl border space-y-4">
              <h3 className="text-xl font-bold">📖 Tutorials</h3>
              <p className="text-muted-foreground">
                <strong>Goal:</strong> Help users learn by doing. Tutorials are
                lessons that guide readers through a series of steps to complete
                a project.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    ✅ Do:
                  </span>
                  <ul className="mt-2 text-green-700 dark:text-green-300 space-y-1">
                    <li>• Include every step needed</li>
                    <li>• Show expected outcomes</li>
                    <li>• Focus on practical results</li>
                  </ul>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <span className="font-semibold text-red-800 dark:text-red-200">
                    ❌ Don't:
                  </span>
                  <ul className="mt-2 text-red-700 dark:text-red-300 space-y-1">
                    <li>• Explain concepts in depth</li>
                    <li>• Show multiple ways to do things</li>
                    <li>• Include optional steps</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border space-y-4">
              <h3 className="text-xl font-bold">📚 How-To Guides</h3>
              <p className="text-muted-foreground">
                <strong>Goal:</strong> Help users accomplish a specific task.
                Unlike tutorials, how-to guides assume users already understand
                the basics.
              </p>
              <div className="text-sm bg-muted/50 p-4 rounded-lg">
                <strong>Example Topics:</strong> "How to reset your password",
                "How to configure SSO", "How to migrate from v1 to v2"
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border space-y-4">
              <h3 className="text-xl font-bold">📋 Reference</h3>
              <p className="text-muted-foreground">
                <strong>Goal:</strong> Provide detailed information about how
                something works. API documentation is the classic example.
              </p>
              <div className="text-sm bg-muted/50 p-4 rounded-lg font-mono">
                <div className="text-xs text-muted-foreground mb-2 font-sans">
                  EXAMPLE API REFERENCE
                </div>
                <div>### `POST /api/users`</div>
                <div className="mt-2">Creates a new user account.</div>
                <div className="mt-2">**Parameters:**</div>
                <div>| Name | Type | Required | Description |</div>
                <div>| --- | --- | --- | --- |</div>
                <div>| email | string | Yes | User's email |</div>
                <div>| name | string | Yes | Display name |</div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border space-y-4">
              <h3 className="text-xl font-bold">💡 Explanation</h3>
              <p className="text-muted-foreground">
                <strong>Goal:</strong> Help users understand concepts and
                context. Explanations discuss the "why" behind decisions and
                architecture.
              </p>
              <div className="text-sm bg-muted/50 p-4 rounded-lg">
                <strong>Example Topics:</strong> "Understanding authentication",
                "Architecture overview", "Design decisions"
              </div>
            </div>
          </div>
        </section>

        {/* Structure Best Practices */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Structuring Your Documentation</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400">
                1
              </div>
              <div>
                <h4 className="font-semibold">Start with a Clear Hierarchy</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Use headings consistently. Each page should have one H1.
                  Subsections use H2, H3, etc. Never skip levels.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400">
                2
              </div>
              <div>
                <h4 className="font-semibold">Lead with the Answer</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Put the most important information first. Users scan
                  documentation—make key points visible immediately.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400">
                3
              </div>
              <div>
                <h4 className="font-semibold">Use Consistent Formatting</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a style guide: how to format code, when to use
                  admonitions, how to structure examples.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400">
                4
              </div>
              <div>
                <h4 className="font-semibold">Cross-Link Generously</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect related concepts. Don't make users search for
                  information that's relevant to what they're reading.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Writing Tips */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">
            Writing Tips for Technical Content
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-800">
              <h3 className="font-bold text-lg mb-4 text-green-900 dark:text-green-100">
                ✅ Best Practices
              </h3>
              <ul className="space-y-3 text-sm text-green-800 dark:text-green-200">
                <li>
                  • Use active voice ("Click the button" not "The button should
                  be clicked")
                </li>
                <li>• Keep sentences short (aim for 20 words max)</li>
                <li>• Define acronyms on first use</li>
                <li>• Include code examples that work</li>
                <li>• Test your own documentation</li>
                <li>• Update docs when code changes</li>
              </ul>
            </div>
            <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-800">
              <h3 className="font-bold text-lg mb-4 text-red-900 dark:text-red-100">
                ❌ Common Mistakes
              </h3>
              <ul className="space-y-3 text-sm text-red-800 dark:text-red-200">
                <li>• Assuming too much prior knowledge</li>
                <li>• Burying critical information</li>
                <li>• Using jargon without explanation</li>
                <li>• Outdated screenshots and examples</li>
                <li>• Missing error handling in code samples</li>
                <li>• Wall of text without visual breaks</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Markdown Features for Docs */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">
            Markdown Features for Documentation
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Leverage these Markdown features to make your documentation more
              effective:
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">
                📋 Task Lists for Prerequisites
              </h4>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                - [x] Node.js 18+ installed
              </code>
            </div>
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">
                📊 Tables for Parameter Reference
              </h4>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                | Param | Type | Description |
              </code>
            </div>
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">
                💻 Fenced Code with Language
              </h4>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                ```javascript
              </code>
            </div>
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">💬 Blockquotes for Notes</h4>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                &gt; **Note:** Important information here
              </code>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-3xl p-8 md:p-12 border border-orange-200 dark:border-orange-800 text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Writing Better Docs</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Use MDViewer to draft and preview your documentation with instant
            Markdown rendering.
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
            <Link
              href="/guides/readme-best-practices"
              className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all"
            >
              <h3 className="font-bold group-hover:text-primary transition-colors">
                README Best Practices &rarr;
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Learn how to write README files that make your GitHub projects
                stand out.
              </p>
            </Link>
            <Link
              href="/guides/markdown-for-bloggers"
              className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all"
            >
              <h3 className="font-bold group-hover:text-primary transition-colors">
                Markdown for Bloggers &rarr;
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                How content creators use Markdown for faster, more consistent
                writing.
              </p>
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
}
