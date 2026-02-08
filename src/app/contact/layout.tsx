import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | MDViewer Support',
  description: 'Get in touch with the MDViewer team. Report bugs, request features, or ask questions about our free online Markdown editor. We typically respond within 24-48 hours.',
  openGraph: {
    title: 'Contact Us | MDViewer Support',
    description: 'Get in touch with the MDViewer team. Report bugs, request features, or ask questions about our free online Markdown editor.',
    url: 'https://mdviewer.in/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
