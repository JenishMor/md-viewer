import { Metadata } from 'next';
import { Layout } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Contact Us | MDViewer',
  description: 'Get in touch with the MDViewer team for support or feedback.',
};

export default function Contact() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your feedback drives MDViewer forward. Whether you're a long-time user or just discovered us, we're here to help you get the most out of our markdown viewer.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border rounded-3xl p-8 shadow-sm space-y-4">
                <h2 className="text-2xl font-bold">Direct Support</h2>
                <p className="text-muted-foreground">
                    Have a specific question about MDViewer? Our support team is ready to help you with any technical issues or account-related inquiries.
                </p>
                <div className="pt-4">
                    <a href="mailto:support@mdviewer.in" className="text-primary font-bold text-xl hover:underline flex items-center gap-2">
                        support@mdviewer.in
                    </a>
                </div>
            </div>

            <div className="bg-card border rounded-3xl p-8 shadow-sm space-y-4">
                <h2 className="text-2xl font-bold">Bug Reporting</h2>
                <p className="text-muted-foreground">
                    Found something that isn't working as expected? Please let us know! Include your browser version and a brief description of the issue.
                </p>
                <div className="pt-4">
                    <p className="text-sm font-medium">Response time: Usually within 24-48 hours</p>
                </div>
            </div>
        </div>

        <section className="bg-muted p-10 rounded-3xl border text-center space-y-6">
            <h2 className="text-2xl font-bold">Feature Requests & Suggestions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                We're constantly evolving. If there's a feature you'd love to see—like new export formats, specific language highlighting, or UI improvements—don't hesitate to share your thoughts with us via email.
            </p>
        </section>
      </div>
    </Layout>
  );
}
