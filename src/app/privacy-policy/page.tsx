import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | MDViewer',
  description: 'Privacy Policy for MDViewer - Free Online Markdown Viewer.',
};

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        <h1 className="text-4xl font-bold border-b pb-4">Privacy Policy</h1>
        
        <p className="text-muted-foreground">Last updated: January 6, 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Introduction</h2>
          <p>
            Welcome to <Link href="https://mdviewer.in" className="text-primary underline">MDViewer</Link>. We respect your privacy and are committed to protecting any information you may share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
          <h3 className="text-xl font-medium">Personal Information</h3>
          <p>
            MDViewer is designed as a tool that does not require user registration. We do NOT collect personal information such as your name, email address, or physical address unless you voluntarily provide it to us (for example, by contacting us).
          </p>
          
          <h3 className="text-xl font-medium">Non-Personal Information</h3>
          <p>
            We may collect non-personal information about your visit, such as your browser type, operating system, and the duration of your stay. This information is used for analytical purposes to improve our service.
          </p>
          
          <h3 className="text-xl font-medium">Browser Storage</h3>
          <p>
            MDViewer uses your browser's local storage to save the markdown content you enter. This data remains on your device and is not uploaded to our servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Cookies and Third-Party Services</h2>
          <p>
            We use third-party services like Google AdSense to serve advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites on the internet.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ads Settings</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Data Security</h2>
          <p>
            We take reasonable measures to protect the information we collect. However, no data transmission over the internet can be guaranteed as 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <span className="text-primary underline">support@mdviewer.in</span>
          </p>
        </section>
      </div>
    </Layout>
  );
}
