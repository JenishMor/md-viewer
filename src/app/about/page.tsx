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
        
        <section className="space-y-6 text-lg leading-relaxed">
          <p>
            MDViewer was born out of a simple need: a clean, fast, and feature-rich way to work with Markdown files online. We believe that writing should be distraction-free and that seeing your results in real-time is the best way to iterate. In an era of complex word processors, Markdown offers a return to simplicity without sacrificing power.
          </p>
          <p>
            Our mission is to provide the best possible writing experience for developers, technical writers, bloggers, and students. We believe that high-quality tools should be accessible to everyone, regardless of their budget or technical background. That's why MDViewer is, and always will be, free to use.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 pt-8">
          <div className="space-y-4 p-8 rounded-2xl border bg-card shadow-sm">
            <h2 className="text-2xl font-bold">The MDViewer Mission</h2>
            <p className="text-muted-foreground">
                We aim to be the go-to resource for anyone working with Markdown. Beyond just a tool, we strive to provide educational content that helps users master the syntax and improve their documentation workflows. Accuracy, speed, and privacy are the three pillars of our development.
            </p>
          </div>
          <div className="space-y-4 p-8 rounded-2xl border bg-card shadow-sm">
            <h2 className="text-2xl font-bold">Technological Excellence</h2>
            <p className="text-muted-foreground">
                Built on modern web standards, MDViewer utilizes Next.js for high performance and React for a fluid, reactive interface. Our rendering engine is powered by industry-standard libraries like rehype and remark, ensuring that your markdown is parsed according to the highest standards of reliability.
            </p>
          </div>
        </section>

        <section className="space-y-6 pt-8 border-t">
          <h2 className="text-3xl font-bold">A Core Commitment: Local-First Privacy</h2>
          <p className="text-muted-foreground text-lg">
            Most online editors send your text to their servers for processing or storage. Not MDViewer. We believe your words are your own. By leveraging <strong>IndexedDB and LocalStorage</strong>, we ensure that your work stays on your device. This isn't just a feature; it's a fundamental commitment to user privacy and data sovereignty.
          </p>
          <div className="bg-muted p-6 rounded-xl border italic text-sm">
            "We don't want to see your drafts, your notes, or your secrets. We just want to give you a beautiful place to write them." — The MDViewer Team
          </div>
        </section>

        <section className="space-y-4 text-center py-12">
          <h2 className="text-3xl font-bold italic">Crafting Documentation, Simplified.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join the thousands of developers and writers who use MDViewer to make their content shine. Whether it's a simple README or a complex technical guide, we're here to help you see the final result instantly.
          </p>
        </section>
      </div>
    </Layout>
  );
}
