import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';
import { Github, Mail, Heart, Zap, Shield, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About MDViewer | Meet the Creator & Our Mission',
  description: 'Learn about MDViewer, the free online Markdown editor created by Jenish Mor. Discover our mission to empower developers, writers, and content creators with powerful, privacy-focused tools.',
  openGraph: {
    title: 'About MDViewer | Meet the Creator & Our Mission',
    description: 'Learn about MDViewer, the free online Markdown editor created by Jenish Mor. Discover our mission to empower developers, writers, and content creators.',
    url: 'https://mdviewer.in/about',
    type: 'website',
  },
};

export default function About() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-16">
        {/* Hero Section */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent py-2">
            About MDViewer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A passion project built to give developers, technical writers, and content creators the perfect Markdown editing experience — completely free, forever.
          </p>
        </header>

        {/* The Story Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold border-b pb-4">The Story Behind MDViewer</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-lg leading-relaxed">
              MDViewer was born out of a simple frustration: finding a clean, fast, and feature-rich way to work with Markdown files online shouldn't be this hard. As developers, we constantly write documentation, README files, and technical content in Markdown. Yet most online tools either feel clunky, require sign-ups, or send your data to external servers.
            </p>
            <p className="text-lg leading-relaxed">
              In 2024, I decided to build the Markdown editor I always wanted to use. One that's instant, respects your privacy, supports GitHub Flavored Markdown, and just works. No accounts, no paywalls, no tracking — just a beautiful tool that helps you write better.
            </p>
            <p className="text-lg leading-relaxed">
              Today, MDViewer is used by thousands of developers, technical writers, students, and content creators around the world. Whether you're drafting a README for your open-source project, writing documentation for your team, or simply taking notes in Markdown, MDViewer is designed to make your workflow smoother and more enjoyable.
            </p>
          </div>
        </section>

        {/* Meet the Creator */}
        <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
              JM
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Jenish Mor</h2>
                <p className="text-muted-foreground">Founder & Developer</p>
              </div>
              <p className="text-lg leading-relaxed">
                I'm a software developer passionate about building tools that make developers' lives easier. MDViewer is my contribution to the open-source community — a tool I use daily and continue to improve based on real user feedback. I believe high-quality developer tools should be accessible to everyone, regardless of their budget or location.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                <a 
                  href="https://github.com/JenishMor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every decision we make is guided by these principles.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow space-y-4">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Privacy First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your content stays on your device. We use browser-based storage (LocalStorage and IndexedDB) so your work never touches our servers. No accounts, no cloud sync that we control — your data is yours alone.
              </p>
            </div>
            <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow space-y-4">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Performance Obsessed</h3>
              <p className="text-muted-foreground leading-relaxed">
                We obsess over milliseconds. MDViewer is built with modern web technologies to ensure instant preview updates, even with large documents. No lag, no waiting — just fluid writing.
              </p>
            </div>
            <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow space-y-4">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Free Forever</h3>
              <p className="text-muted-foreground leading-relaxed">
                MDViewer is and will remain free to use. We believe essential developer tools shouldn't be locked behind paywalls. While we may introduce premium features in the future, the core Markdown editor will always be 100% free.
              </p>
            </div>
            <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow space-y-4">
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold">Community Driven</h3>
              <p className="text-muted-foreground leading-relaxed">
                MDViewer is open source and built with the community in mind. Feature requests, bug reports, and contributions are always welcome. Together, we're building the Markdown editor we all deserve.
              </p>
            </div>
          </div>
        </section>

        {/* What MDViewer Offers */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold border-b pb-4">What Makes MDViewer Different</h2>
          <div className="space-y-6 text-lg">
            <p className="leading-relaxed">
              Unlike many Markdown editors that require installation or registration, MDViewer runs entirely in your browser. Here's what sets us apart:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Real-time Preview:</strong> See your formatted Markdown instantly as you type, with zero delay between keystrokes and rendered output.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Full GFM Support:</strong> Tables, task lists, strikethrough, syntax-highlighted code blocks — everything GitHub supports, we support.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Dark Mode:</strong> Easy on the eyes for late-night coding sessions, with a beautiful theme that matches your system preference.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Local Storage:</strong> Your work is automatically saved to your browser. Come back anytime and pick up where you left off.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Synchronized Scrolling:</strong> Editor and preview scroll together, so you always know exactly where you are in your document.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Copy Markdown or HTML:</strong> Export your work in the format you need. Copy raw Markdown for GitHub or rendered HTML for your blog.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Who Uses MDViewer */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold border-b pb-4">Who Uses MDViewer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">👨‍💻 Software Developers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Writing README files, API documentation, or contributing to open-source projects. MDViewer makes it easy to preview exactly how your Markdown will render on GitHub before you commit.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">📝 Technical Writers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Creating user guides, knowledge bases, or product documentation. MDViewer's distraction-free interface helps you focus on content, not formatting.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400">🎓 Students & Researchers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Taking notes, writing research papers, or organizing study materials. Markdown's simplicity makes it perfect for academic work, and MDViewer makes it accessible.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400">✍️ Content Creators & Bloggers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drafting blog posts for platforms like Dev.to, Medium, or personal sites. Write in Markdown, preview in real-time, and publish with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section className="bg-slate-900 dark:bg-slate-800 text-white rounded-3xl p-8 md:p-12 space-y-6">
          <div className="flex items-center gap-4">
            <Github className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Open Source & Transparent</h2>
          </div>
          <p className="text-lg text-slate-300 leading-relaxed">
            MDViewer is open source. You can inspect the code, suggest improvements, report bugs, or contribute new features. We believe in transparency and community collaboration.
          </p>
          <a 
            href="https://github.com/JenishMor/md-viewer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-8">
          <h2 className="text-3xl font-bold">Ready to Write?</h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Start using MDViewer today. No sign-up required — just open and start writing.
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
