import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Markdown for Bloggers: From Draft to Published Post | MDViewer',
  description: 'Learn how content creators use Markdown to write faster, format consistently, and publish to platforms like Dev.to, Medium, and WordPress. Speed up your blogging workflow.',
  keywords: [
    'markdown for bloggers',
    'blog writing markdown',
    'medium markdown',
    'dev.to markdown',
    'wordpress markdown',
    'content creation',
    'blogging workflow',
  ],
  openGraph: {
    title: 'Markdown for Bloggers: From Draft to Published Post',
    description: 'How content creators use Markdown to write faster and publish to various platforms.',
    url: 'https://mdviewer.in/guides/markdown-for-bloggers',
    type: 'article',
  },
};

export default function MarkdownForBloggersGuide() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-foreground">Markdown for Bloggers</span>
        </nav>

        {/* Header */}
        <header className="space-y-6 border-b pb-10">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">Writing</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">10 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Markdown for Bloggers: From Draft to Published Post
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Whether you write on Dev.to, Medium, your own WordPress site, or a static site generator, Markdown can transform your blogging workflow. Learn how top content creators use Markdown to write faster and publish smarter.
          </p>
        </header>

        {/* Why Bloggers Love Markdown */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Why Bloggers Love Markdown</h2>
          <div className="grid gap-6">
            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="text-3xl">⚡</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Write First, Format Later</h3>
                <p className="text-muted-foreground">
                  Markdown lets you focus on getting words down without interrupting your flow to click formatting buttons. The simple syntax becomes second nature, so formatting happens automatically as you type.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="text-3xl">📱</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Platform Independence</h3>
                <p className="text-muted-foreground">
                  Write once, publish anywhere. Your Markdown files can be copied to Dev.to, converted for Medium, used in WordPress, or built into a static site. No reformatting needed when switching platforms.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-card rounded-2xl border">
              <div className="text-3xl">📁</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Portable Archive</h3>
                <p className="text-muted-foreground">
                  Your posts remain in plain text files that you own and control. If a platform shuts down or changes policies, your content is safe and ready to move elsewhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Guide */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Markdown on Popular Platforms</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-2xl border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">D</div>
                <h3 className="text-xl font-bold">Dev.to</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Dev.to has excellent Markdown support. You can paste Markdown directly into the editor or use their liquid tags for enhanced features.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                <div>---</div>
                <div>title: Your Post Title</div>
                <div>published: true</div>
                <div>tags: javascript, webdev, tutorial</div>
                <div>---</div>
                <div className="mt-2">Your content here...</div>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-[#00ab6c] flex items-center justify-center text-white font-bold">M</div>
                <h3 className="text-xl font-bold">Medium</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Medium doesn't support raw Markdown, but you can import Markdown files. Use tools like <strong>markdown-to-medium</strong> or import via their story editor.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
                <strong className="text-amber-800 dark:text-amber-200">💡 Tip:</strong>{' '}
                <span className="text-amber-700 dark:text-amber-300">Draft in Markdown, then paste into Medium's editor. Most basic formatting converts automatically.</span>
              </div>
            </div>

            <div className="p-6 bg-card rounded-2xl border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-[#21759b] flex items-center justify-center text-white font-bold">W</div>
                <h3 className="text-xl font-bold">WordPress</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                WordPress supports Markdown in Gutenberg blocks. Add a "Code" or "Markdown" block, or use plugins like <strong>WP-Markdown</strong> for full support.
              </p>
            </div>

            <div className="p-6 bg-card rounded-2xl border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-[#663399] flex items-center justify-center text-white font-bold">G</div>
                <h3 className="text-xl font-bold">Gatsby / Hugo / Jekyll</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Static site generators are built for Markdown. Your posts are .md files with frontmatter. This is the most powerful Markdown blogging experience—full control over design and hosting.
              </p>
            </div>
          </div>
        </section>

        {/* Frontmatter */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Understanding Frontmatter</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              <strong>Frontmatter</strong> is metadata at the top of your Markdown file, enclosed in triple dashes (<code>---</code>). It's used by static site generators and some platforms to store post information.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
            <div className="text-xs text-muted-foreground mb-3 font-sans font-medium">EXAMPLE FRONTMATTER</div>
            <pre className="whitespace-pre-wrap">{`---
title: "10 VS Code Extensions Every Developer Needs"
date: 2026-02-15
author: "Your Name"
description: "A curated list of VS Code extensions that will boost your productivity."
tags: ["vscode", "productivity", "tools"]
image: "/images/vscode-extensions.png"
draft: false
---`}</pre>
          </div>
        </section>

        {/* Blogging Workflow */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">A Modern Blogging Workflow</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400">1</div>
              <div>
                <h4 className="font-semibold">Draft in Your Favorite Editor</h4>
                <p className="text-sm text-muted-foreground mt-1">Use VS Code, Obsidian, or MDViewer to write your draft. Focus on content, not formatting.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400">2</div>
              <div>
                <h4 className="font-semibold">Preview & Polish</h4>
                <p className="text-sm text-muted-foreground mt-1">Use a live preview to check formatting. Add images, refine headers, and ensure code blocks are correct.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400">3</div>
              <div>
                <h4 className="font-semibold">Store in Git (Optional)</h4>
                <p className="text-sm text-muted-foreground mt-1">Version control your posts. Track changes, collaborate with editors, and never lose a draft.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-5 bg-card rounded-xl border">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400">4</div>
              <div>
                <h4 className="font-semibold">Publish to Platform</h4>
                <p className="text-sm text-muted-foreground mt-1">Copy to Dev.to, import to Medium, or push to your static site. Your Markdown is ready.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Elements */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Essential Blog Post Elements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">📌 Compelling Introduction</h4>
              <p className="text-sm text-muted-foreground">Hook readers in the first paragraph. State the problem you're solving.</p>
            </div>
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">📋 Scannable Headings</h4>
              <p className="text-sm text-muted-foreground">Use H2 for main sections, H3 for subsections. Make them descriptive.</p>
            </div>
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">💻 Code Examples</h4>
              <p className="text-sm text-muted-foreground">For technical posts, include copy-pasteable code with syntax highlighting.</p>
            </div>
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">🖼️ Images & Diagrams</h4>
              <p className="text-sm text-muted-foreground">Visual content increases engagement. Include screenshots and diagrams.</p>
            </div>
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">📝 Conclusion & CTA</h4>
              <p className="text-sm text-muted-foreground">Summarize key takeaways. Include a call-to-action (follow, comment, etc.).</p>
            </div>
            <div className="p-5 bg-card rounded-xl border">
              <h4 className="font-semibold mb-2">🔗 Internal & External Links</h4>
              <p className="text-sm text-muted-foreground">Link to related posts and authoritative sources for context and SEO.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-3xl p-8 md:p-12 border border-pink-200 dark:border-pink-800 text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Writing Your Next Post</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Use MDViewer to draft your blog posts with instant Markdown preview. It's free, fast, and works offline.
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
