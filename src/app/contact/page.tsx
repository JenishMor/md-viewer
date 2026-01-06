import { Metadata } from 'next';
import { Layout } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Contact Us | MDViewer',
  description: 'Get in touch with the MDViewer team for support or feedback.',
};

export default function Contact() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a feature suggestion, found a bug, or just want to say hi, feel free to reach out.
        </p>

        <div className="bg-card border rounded-2xl p-8 md:p-12 mt-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Email Us</h2>
          <p className="text-lg mb-4">
            For support, feedback, or general inquiries, please reach out to:
          </p>
          <a href="mailto:support@mdviewer.in" className="text-primary font-bold text-2xl hover:underline">
            support@mdviewer.in
          </a>
        </div>
      </div>
    </Layout>
  );
}
