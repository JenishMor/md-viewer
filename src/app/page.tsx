import { Metadata } from 'next';
import HomePage from './home-page';

export const metadata: Metadata = {
  title: 'MDViewer: Free Online Markdown Viewer and Editor',
  description:
    'A free online tool to view and edit Markdown files. Real-time preview, GFM support, and a clean, user-friendly interface. Perfect for developers and content creators.',
  openGraph: {
    title: 'MDViewer: Free Online Markdown Viewer and Editor',
    description:
      'A free online tool to view and edit Markdown files. Real-time preview, GFM support, and a clean, user-friendly interface.',
    url: 'https://mdviewer.in',
    type: 'website',
    images: [
      {
        url: 'https://mdviewer.in/logo.png',
        width: 512,
        height: 512,
        alt: 'MDViewer Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MDViewer: Free Online Markdown Viewer and Editor',
    description:
      'A free online tool to view and edit Markdown files. Real-time preview, GFM support, and a clean, user-friendly interface.',
    images: ['https://mdviewer.in/logo.png'],
  },
};

export default function Page() {
  return <HomePage />;
}
