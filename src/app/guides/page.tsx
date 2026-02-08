import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';
import { FileText, BookOpen, Code, Lightbulb, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Markdown Guides & Tutorials | MDViewer Learning Center',
  description: 'Comprehensive guides and tutorials to master Markdown. Learn README writing, documentation best practices, GFM features, and advanced techniques for developers and writers.',
  keywords: [
    'markdown guides',
    'markdown tutorials',
    'learn markdown',
    'markdown documentation',
    'github markdown guide',
    'technical writing guides',
    'developer documentation',
  ],
  openGraph: {
    title: 'Markdown Guides & Tutorials | MDViewer Learning Center',
    description: 'Comprehensive guides and tutorials to master Markdown. From beginner basics to advanced documentation techniques.',
    url: 'https://mdviewer.in/guides',
    type: 'website',
  },
};

const guides = [
  {
    slug: 'readme-best-practices',
    title: 'How to Write Perfect README Files: A Developer\'s Complete Guide',
    description: 'Master the art of README writing. Learn structure, essential sections, badges, and examples that make your GitHub projects stand out.',
    category: 'Documentation',
    readTime: '12 min read',
    icon: FileText,
    color: 'blue',
    featured: true,
  },
  {
    slug: 'markdown-vs-rich-text',
    title: 'Markdown vs. Rich Text: When to Use What',
    description: 'Understand the key differences between Markdown and traditional word processors. Learn when each format shines and how to choose.',
    category: 'Fundamentals',
    readTime: '8 min read',
    icon: Lightbulb,
    color: 'purple',
    featured: true,
  },
  {
    slug: 'github-flavored-markdown',
    title: 'The Complete Guide to GitHub Flavored Markdown (GFM)',
    description: 'Everything you need to know about GFM extensions—tables, task lists, autolinks, strikethrough, and syntax highlighting.',
    category: 'GFM',
    readTime: '15 min read',
    icon: Code,
    color: 'green',
    featured: true,
  },
  {
    slug: 'technical-documentation',
    title: 'Creating Technical Documentation with Markdown',
    description: 'Professional techniques for writing user guides, API docs, and knowledge bases. Structure, style, and tools that professionals use.',
    category: 'Documentation',
    readTime: '14 min read',
    icon: BookOpen,
    color: 'orange',
    featured: false,
  },
  {
    slug: 'markdown-for-bloggers',
    title: 'Markdown for Bloggers: From Draft to Published Post',
    description: 'How content creators use Markdown to write faster, format consistently, and publish to platforms like Dev.to, Medium, and WordPress.',
    category: 'Writing',
    readTime: '10 min read',
    icon: FileText,
    color: 'pink',
    featured: false,
  },
  {
    slug: 'markdown-tables-guide',
    title: 'Markdown Tables: From Basic to Advanced Styling',
    description: 'Master table creation in Markdown. Learn alignment, formatting within cells, and workarounds for complex table layouts.',
    category: 'GFM',
    readTime: '9 min read',
    icon: Code,
    color: 'cyan',
    featured: false,
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
};

export default function GuidesPage() {
  const featuredGuides = guides.filter(g => g.featured);
  const moreGuides = guides.filter(g => !g.featured);

  return (
    <Layout>
      <article className="max-w-5xl mx-auto py-12 px-4 space-y-16">
        {/* Hero Section */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent py-2">
            Markdown Guides & Tutorials
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            In-depth guides written by developers, for developers. Master Markdown, improve your documentation, and level up your technical writing skills.
          </p>
        </header>

        {/* Quick Start CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-8 border border-blue-200 dark:border-blue-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">New to Markdown?</h2>
              <p className="text-muted-foreground">Start with our comprehensive tutorial that covers everything from basics to advanced features.</p>
            </div>
            <Link 
              href="/markdown-tutorial"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all shrink-0"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Featured Guides */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Guides</h2>
            <span className="text-sm text-muted-foreground">{guides.length} guides available</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuides.map((guide) => {
              const Icon = guide.icon;
              const colors = colorClasses[guide.color];
              return (
                <Link 
                  key={guide.slug} 
                  href={`/guides/${guide.slug}`}
                  className="group flex flex-col p-6 bg-card rounded-2xl border hover:shadow-xl transition-all duration-300"
                >
                  <div className={`h-12 w-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                      {guide.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-muted-foreground text-sm flex-1 line-clamp-3">
                    {guide.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Guide <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* More Guides */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">More Guides</h2>
          <div className="space-y-4">
            {moreGuides.map((guide) => {
              const Icon = guide.icon;
              const colors = colorClasses[guide.color];
              return (
                <Link 
                  key={guide.slug} 
                  href={`/guides/${guide.slug}`}
                  className="group flex items-center gap-6 p-6 bg-card rounded-2xl border hover:shadow-lg transition-all"
                >
                  <div className={`h-14 w-14 ${colors.bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                        {guide.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">
                      {guide.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
                      {guide.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-100">📄 Documentation</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Guides focused on writing professional documentation, READMEs, and user guides.
              </p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guides/readme-best-practices" className="text-blue-600 dark:text-blue-400 hover:underline">README Best Practices</Link></li>
                <li><Link href="/guides/technical-documentation" className="text-blue-600 dark:text-blue-400 hover:underline">Technical Documentation</Link></li>
              </ul>
            </div>
            <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-800">
              <h3 className="font-bold text-lg mb-2 text-green-900 dark:text-green-100">💻 GFM & Syntax</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                Deep dives into GitHub Flavored Markdown features and syntax details.
              </p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guides/github-flavored-markdown" className="text-green-600 dark:text-green-400 hover:underline">Complete GFM Guide</Link></li>
                <li><Link href="/guides/markdown-tables-guide" className="text-green-600 dark:text-green-400 hover:underline">Markdown Tables</Link></li>
              </ul>
            </div>
            <div className="p-6 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800">
              <h3 className="font-bold text-lg mb-2 text-purple-900 dark:text-purple-100">✍️ Writing</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                Tips and techniques for content creators and bloggers using Markdown.
              </p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guides/markdown-for-bloggers" className="text-purple-600 dark:text-purple-400 hover:underline">Markdown for Bloggers</Link></li>
                <li><Link href="/guides/markdown-vs-rich-text" className="text-purple-600 dark:text-purple-400 hover:underline">Markdown vs. Rich Text</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-900 dark:bg-slate-800 text-white rounded-3xl p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Practice?</h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Put your knowledge to the test. Our live editor lets you practice everything you've learned with instant preview.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-900 font-medium text-lg hover:bg-slate-100 transition-colors"
          >
            Open Editor
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </article>
    </Layout>
  );
}
