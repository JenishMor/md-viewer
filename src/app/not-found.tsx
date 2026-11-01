import type { Metadata } from 'next';
import Link from 'next/link';
import { Layout } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
        <p className="text-6xl font-extrabold text-primary" aria-hidden="true">404</p>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          This page doesn&apos;t exist or has moved. Your documents are safe —
          they&apos;re stored in your browser, not on this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link 
            href="/" 
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Return to Editor
          </Link>
          <Link 
            href="/markdown-tutorial" 
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View Tutorial
          </Link>
        </div>
      </div>
    </Layout>
  );
}
