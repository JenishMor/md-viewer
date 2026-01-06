import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | MDViewer',
  description: 'Terms of Service for MDViewer - Free Online Markdown Viewer.',
};

export default function TermsOfService() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        <h1 className="text-4xl font-bold border-b pb-4">Terms of Service</h1>
        
        <p className="text-muted-foreground">Last updated: January 6, 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Acceptance of Terms</h2>
          <p>
            By accessing and using <Link href="https://mdviewer.in" className="text-primary underline">MDViewer</Link>, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Use of the Service</h2>
          <p>
            MDViewer provides a platform for viewing and editing Markdown content. You are responsible for any content you enter into the editor. You agree not to use the service for any unlawful purposes or to transmit any harmful or offensive material.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Intellectual Property</h2>
          <p>
            The website design, logo, and overall software are the intellectual property of MDViewer. The content you create or edit using our tool remains your property.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Disclaimer of Warranties</h2>
          <p>
            MDViewer is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted or error-free.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Limitation of Liability</h2>
          <p>
            In no event shall MDViewer be liable for any direct, indirect, incidental, special, or consequential damages arising out of your use of the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the website follows the posting of changes will signify your acceptance of those changes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
          <p>
            For any queries regarding these terms, please contact us at support@mdviewer.in.
          </p>
        </section>
      </div>
    </Layout>
  );
}
