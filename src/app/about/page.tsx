import { Metadata } from 'next';
import { Layout } from '@/components/layout';

export const metadata: Metadata = {
  title: 'About Us | MDViewer',
  description: 'Learn more about MDViewer - your favorite online markdown editor and viewer.',
};

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        <h1 className="text-4xl font-bold border-b pb-4">About MDViewer</h1>
        
        <section className="space-y-4 text-lg">
          <p>
            MDViewer was born out of a simple need; a clean, fast, and feature-rich way to work with Markdown files online. We believe that writing should be distraction-free and that seeing your results in real-time is the best way to iterate.
          </p>
          <p>
            Our mission is to provide the best possible writing experience for developers, technical writers, bloggers, and anyone who loves the simplicity of Markdown.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 pt-8">
          <div className="space-y-4 p-6 rounded-xl border bg-card/50">
            <h2 className="text-2xl font-bold">Why MDViewer?</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Instant real-time preview</li>
              <li>Complete GFM support</li>
              <li>Syntax highlighting for code</li>
              <li>Dark & Light mode support</li>
              <li>No account or sign-up needed</li>
            </ul>
          </div>
          <div className="space-y-4 p-6 rounded-xl border bg-card/50">
            <h2 className="text-2xl font-bold">Privacy First</h2>
            <p className="text-muted-foreground">
              We value your privacy. Your markdown content is stored locally in your browser and never touches our servers. You can write with confidence knowing your data stays with you.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-center py-12">
          <h2 className="text-3xl font-bold font-serif">A Better Way to Write</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're drafting documentation, writing a blog post, or just taking notes, MDViewer provides the tools you need to do it efficiently.
          </p>
        </section>
      </div>
    </Layout>
  );
}
