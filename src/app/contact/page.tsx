"use client";

import { useState, useRef, FormEvent } from 'react';
import { Layout } from '@/components/layout';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, Loader2, Clock, Github, FileText } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Link from 'next/link';

// EmailJS Configuration - User needs to add these to their .env.local file
// NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
// NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
// NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Email service configuration is missing. Please contact us directly at support@mdviewer.in');
      }

      await emailjs.sendForm(serviceId, templateId, formRef.current!, publicKey);
      
      setStatus('success');
      formRef.current?.reset();
    } catch (error) {
      console.error('Email send error:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to send message. Please try again or email us directly at support@mdviewer.in'
      );
    }
  };

  return (
    <Layout>
      <article className="max-w-5xl mx-auto py-12 px-4 space-y-16">
        {/* Hero Section */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent py-2">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a question, feature request, or found a bug? We'd love to hear from you. Your feedback directly shapes the future of MDViewer.
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card border rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                Send Us a Message
              </h2>

              {status === 'success' ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Message Sent Successfully!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for reaching out. We'll get back to you within 24-48 hours. In the meantime, feel free to explore our{' '}
                    <Link href="/markdown-tutorial" className="text-primary hover:underline">Markdown tutorial</Link>.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2 rounded-lg border hover:bg-accent transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="user_name" className="block text-sm font-medium">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="user_email" className="block text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="user_email"
                        name="user_email"
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="">Select a topic...</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feedback">Feedback / Suggestion</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Business Inquiry">Business / Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Direct Email */}
            <div className="bg-card border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold">Email Us Directly</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Prefer email? Send us a message anytime.
              </p>
              <a 
                href="mailto:support@mdviewer.in" 
                className="block text-primary font-semibold hover:underline"
              >
                support@mdviewer.in
              </a>
            </div>

            {/* Response Time */}
            <div className="bg-card border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold">Response Time</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                We typically respond within <strong>24-48 hours</strong>. For urgent issues, please include "URGENT" in your subject line.
              </p>
            </div>

            {/* Report Bugs on GitHub */}
            <div className="bg-card border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <Github className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Found a Bug?</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                For technical bugs or feature requests, you can also open an issue on our GitHub repository.
              </p>
              <a 
                href="https://github.com/JenishMor/md-viewer/issues" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Open an Issue →
              </a>
            </div>

            {/* Documentation */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Need Help?</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Check out our comprehensive Markdown tutorial for tips and syntax help.
              </p>
              <Link 
                href="/markdown-tutorial"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                View Tutorial →
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/30 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold">How do I report a Markdown rendering issue?</h3>
              <p className="text-muted-foreground text-sm">
                If you notice that specific Markdown syntax isn't rendering correctly, please include the exact Markdown text in your message along with the expected output. Screenshots are also helpful!
              </p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold">Can I request a new feature?</h3>
              <p className="text-muted-foreground text-sm">
                Absolutely! We love hearing feature ideas from our users. Just select "Feature Request" from the subject dropdown and describe your idea in detail.
              </p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold">Is MDViewer available for partnership?</h3>
              <p className="text-muted-foreground text-sm">
                We're open to collaborations, integrations, and partnerships. Select "Business Inquiry" and tell us about your ideas.
              </p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold">How can I contribute to MDViewer?</h3>
              <p className="text-muted-foreground text-sm">
                MDViewer is open source! Check out our <a href="https://github.com/JenishMor/md-viewer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub repository</a> to contribute code, report issues, or suggest improvements.
              </p>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}
