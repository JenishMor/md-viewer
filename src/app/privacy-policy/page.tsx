import { Metadata } from "next";
import { Layout } from "@/components/layout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | MDViewer - How We Protect Your Data",
  description:
    "Read the MDViewer privacy policy. Learn how we handle your data, our cookie policy, third-party services, your rights under GDPR and CCPA, and our commitment to your privacy.",
  alternates: {
    canonical: "https://mdviewer.in/privacy-policy",
  },
};

export default function PrivacyPolicy() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-10">
        <header className="space-y-4 border-b pb-6">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: February 22, 2026
          </p>
          <p className="text-muted-foreground text-sm">
            This policy applies to the website{" "}
            <Link
              href="https://mdviewer.in"
              className="text-primary hover:underline"
            >
              mdviewer.in
            </Link>{" "}
            operated by MDViewer.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="bg-muted/50 rounded-xl p-6 border">
          <h2 className="text-lg font-bold mb-3">Contents</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>
              <a href="#introduction" className="text-primary hover:underline">
                Introduction
              </a>
            </li>
            <li>
              <a
                href="#information-we-collect"
                className="text-primary hover:underline"
              >
                Information We Collect
              </a>
            </li>
            <li>
              <a
                href="#how-we-use-information"
                className="text-primary hover:underline"
              >
                How We Use Your Information
              </a>
            </li>
            <li>
              <a
                href="#cookies-and-tracking"
                className="text-primary hover:underline"
              >
                Cookies and Tracking Technologies
              </a>
            </li>
            <li>
              <a
                href="#third-party-services"
                className="text-primary hover:underline"
              >
                Third-Party Services
              </a>
            </li>
            <li>
              <a
                href="#data-storage-and-security"
                className="text-primary hover:underline"
              >
                Data Storage and Security
              </a>
            </li>
            <li>
              <a href="#your-rights" className="text-primary hover:underline">
                Your Rights
              </a>
            </li>
            <li>
              <a
                href="#children-privacy"
                className="text-primary hover:underline"
              >
                Children&apos;s Privacy
              </a>
            </li>
            <li>
              <a
                href="#international-transfers"
                className="text-primary hover:underline"
              >
                International Data Transfers
              </a>
            </li>
            <li>
              <a href="#changes" className="text-primary hover:underline">
                Changes to This Policy
              </a>
            </li>
            <li>
              <a href="#contact" className="text-primary hover:underline">
                Contact Us
              </a>
            </li>
          </ol>
        </nav>

        {/* Introduction */}
        <section id="introduction" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            1. Introduction
          </h2>
          <p>
            Welcome to MDViewer. We are committed to protecting your privacy and
            ensuring that your personal information is handled responsibly. This
            Privacy Policy explains what information we collect, how we use it,
            and what choices you have regarding your data when you use our free
            online Markdown editor at{" "}
            <Link
              href="https://mdviewer.in"
              className="text-primary hover:underline"
            >
              mdviewer.in
            </Link>
            .
          </p>
          <p>
            By using our website, you agree to the collection and use of
            information in accordance with this policy. If you do not agree with
            any part of this policy, please discontinue use of our website
            immediately.
          </p>
        </section>

        {/* Information We Collect */}
        <section id="information-we-collect" className="space-y-6 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            2. Information We Collect
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">
              2.1 Information You Provide Voluntarily
            </h3>
            <p>
              MDViewer is designed as a tool that does{" "}
              <strong>not require user registration or accounts</strong>. We do
              not collect personal information such as your name, email address,
              phone number, or physical address unless you voluntarily provide
              it to us. This may happen when you:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Contact us through our{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact form
                </Link>{" "}
                with a question, bug report, or feature request
              </li>
              <li>Send us an email directly</li>
            </ul>
            <p>
              When you contact us, we may collect your name, email address, and
              the content of your message solely for the purpose of responding
              to your inquiry.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">
              2.2 Information Collected Automatically
            </h3>
            <p>
              When you visit our website, certain information is collected
              automatically by our analytics and hosting providers. This may
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Device information:</strong> Browser type and version,
                operating system, screen resolution, and device type (desktop,
                mobile, or tablet)
              </li>
              <li>
                <strong>Usage data:</strong> Pages visited, time spent on pages,
                referring URLs, and navigation paths through the site
              </li>
              <li>
                <strong>Network information:</strong> Approximate geographic
                location (country and city level, not precise), Internet Service
                Provider (ISP), and IP address
              </li>
              <li>
                <strong>Performance data:</strong> Page load times, web vitals
                metrics, and error reports
              </li>
            </ul>
            <p>
              This data is collected in aggregate form and is used to understand
              how visitors use our website, improve performance, and enhance the
              user experience. We do not use this data to personally identify
              individual users.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">2.3 Browser Local Storage</h3>
            <p>
              MDViewer uses your browser&apos;s <strong>localStorage</strong> to
              save the Markdown content you type into the editor. This is a core
              feature that allows you to return to your work after closing the
              browser tab. This data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Is stored <strong>entirely on your device</strong> and is never
                transmitted to our servers
              </li>
              <li>Is not accessible to us or any third party</li>
              <li>
                Can be cleared at any time by clearing your browser data or
                using the &quot;Clear&quot; button in the editor
              </li>
              <li>
                Persists only in the specific browser and device where it was
                created
              </li>
            </ul>
          </div>
        </section>

        {/* How We Use Information */}
        <section id="how-we-use-information" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            3. How We Use Your Information
          </h2>
          <p>We use the information collected for the following purposes:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Service improvement:</strong> Analysing usage patterns to
              improve our Markdown editor, identify bugs, and prioritise new
              features
            </li>
            <li>
              <strong>Performance monitoring:</strong> Monitoring website speed
              and reliability to ensure a smooth editing experience
            </li>
            <li>
              <strong>Communication:</strong> Responding to your inquiries if
              you contact us through our contact form or email
            </li>
            <li>
              <strong>Advertising:</strong> Serving relevant advertisements
              through Google AdSense to support the free availability of our
              service
            </li>
            <li>
              <strong>Legal compliance:</strong> Complying with applicable laws,
              regulations, and legal processes
            </li>
          </ul>
          <p>
            We do <strong>not</strong> sell, rent, or share your personal
            information with third parties for their own marketing purposes.
          </p>
        </section>

        {/* Cookies and Tracking */}
        <section id="cookies-and-tracking" className="space-y-6 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            4. Cookies and Tracking Technologies
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">4.1 What Are Cookies?</h3>
            <p>
              Cookies are small text files placed on your device by websites you
              visit. They are widely used to make websites work more efficiently
              and to provide information to site owners. Cookies can be
              &quot;first-party&quot; (set by the website you are visiting) or
              &quot;third-party&quot; (set by other services used by the
              website).
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">4.2 Cookies We Use</h3>
            <p>
              MDViewer and its third-party partners may use the following types
              of cookies:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Purpose</th>
                    <th className="text-left p-3 font-medium">Provider</th>
                    <th className="text-left p-3 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Essential</td>
                    <td className="p-3">Theme preference (light/dark mode)</td>
                    <td className="p-3">MDViewer</td>
                    <td className="p-3">Persistent</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Analytics</td>
                    <td className="p-3">
                      Understanding website usage, page views, and traffic
                      sources
                    </td>
                    <td className="p-3">Vercel Analytics</td>
                    <td className="p-3">Session</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Performance</td>
                    <td className="p-3">
                      Measuring page load times and web vitals
                    </td>
                    <td className="p-3">Vercel Speed Insights</td>
                    <td className="p-3">Session</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Advertising</td>
                    <td className="p-3">
                      Serving and personalising advertisements
                    </td>
                    <td className="p-3">Google AdSense</td>
                    <td className="p-3">Up to 2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">4.3 Managing Cookies</h3>
            <p>
              You can control and manage cookies through your browser settings.
              Most browsers allow you to refuse or delete cookies. Please note
              that disabling cookies may affect the functionality of certain
              features on our website.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Chrome cookie settings
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Mozilla Firefox cookie settings
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Safari cookie settings
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Microsoft Edge cookie settings
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Third-Party Services */}
        <section id="third-party-services" className="space-y-6 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            5. Third-Party Services
          </h2>
          <p>
            We use the following third-party services that may collect data
            independently:
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">5.1 Google AdSense</h3>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                How Google Uses Your Data
              </h4>
              <p className="text-blue-800 dark:text-blue-200 mb-3">
                We use Google AdSense to display advertisements. Google may use
                cookies and web beacons to serve ads based on your prior visits.
                To learn how Google collects and uses data when you use our
                site, please visit:
              </p>
              <a
                href="https://www.google.com/policies/privacy/partners/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:underline"
              >
                How Google Uses Information from Sites That Use Our Services
                &rarr;
              </a>
            </div>
            <p>
              We use Google AdSense to display advertisements on our website.
              This service allows us to keep MDViewer free for all users. Google
              AdSense may use cookies and web beacons to serve ads based on your
              prior visits to our website or other websites on the internet.
              Google&apos;s use of advertising cookies enables it and its
              partners to serve ads based on your browsing history.
            </p>
            <p>
              You may opt out of personalised advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Ads Settings
              </a>
              . You can also opt out of third-party vendor cookies by visiting
              the{" "}
              <a
                href="https://optout.networkadvertising.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Network Advertising Initiative opt-out page
              </a>
              .
            </p>
            <p>
              For more information about how Google uses data, please review{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google&apos;s Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://www.google.com/policies/privacy/partners/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                How Google Uses Information from Sites That Use Our Services
              </a>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">
              5.2 Vercel Analytics and Speed Insights
            </h3>
            <p>
              Our website is hosted on Vercel and uses Vercel Analytics and
              Vercel Speed Insights to collect anonymous website usage and
              performance data. These services help us understand how visitors
              interact with MDViewer and identify areas for improvement.
            </p>
            <p>
              Vercel Analytics is privacy-friendly and does not use cookies for
              tracking. It collects only aggregate, non-personally identifiable
              data. For more information, please refer to{" "}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Vercel&apos;s Analytics Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">5.3 EmailJS</h3>
            <p>
              Our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact form
              </Link>{" "}
              uses EmailJS to deliver your messages to us. When you submit the
              contact form, your name, email address, and message content are
              processed by EmailJS. Please refer to{" "}
              <a
                href="https://www.emailjs.com/legal/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                EmailJS&apos;s Privacy Policy
              </a>{" "}
              for details on how they handle data.
            </p>
          </div>
        </section>

        {/* Data Storage and Security */}
        <section
          id="data-storage-and-security"
          className="space-y-4 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold text-foreground">
            6. Data Storage and Security
          </h2>
          <p>
            We take data security seriously and implement appropriate technical
            and organisational measures to protect any information we process.
            These measures include:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>HTTPS encryption:</strong> All data transmitted between
              your browser and our servers is encrypted using TLS/SSL
            </li>
            <li>
              <strong>Local-first architecture:</strong> Your Markdown content
              is stored only in your browser&apos;s localStorage and never
              transmitted to our servers
            </li>
            <li>
              <strong>Content Security:</strong> We implement security headers
              including X-Frame-Options, X-Content-Type-Options, and
              Referrer-Policy
            </li>
          </ul>
          <p>
            While we strive to protect your information, no method of electronic
            transmission or storage is 100% secure. We cannot guarantee absolute
            security, but we continuously review and update our security
            practices.
          </p>
        </section>

        {/* Your Rights */}
        <section id="your-rights" className="space-y-6 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            7. Your Rights
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">
              7.1 For Users in the European Economic Area (GDPR)
            </h3>
            <p>
              If you are located in the European Economic Area (EEA), you have
              certain rights under the General Data Protection Regulation
              (GDPR), including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Right of access:</strong> You can request a copy of the
                personal data we hold about you
              </li>
              <li>
                <strong>Right to rectification:</strong> You can request
                correction of inaccurate personal data
              </li>
              <li>
                <strong>Right to erasure:</strong> You can request deletion of
                your personal data (&quot;right to be forgotten&quot;)
              </li>
              <li>
                <strong>Right to restrict processing:</strong> You can request
                that we limit how we use your data
              </li>
              <li>
                <strong>Right to data portability:</strong> You can request your
                data in a structured, commonly used format
              </li>
              <li>
                <strong>Right to object:</strong> You can object to our
                processing of your personal data
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:support@mdviewer.in"
                className="text-primary hover:underline"
              >
                support@mdviewer.in
              </a>
              . We will respond to your request within 30 days.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">
              7.2 For Users in California (CCPA)
            </h3>
            <p>
              If you are a California resident, you have additional rights under
              the California Consumer Privacy Act (CCPA), including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Right to know:</strong> What personal information we
                collect, use, and disclose
              </li>
              <li>
                <strong>Right to delete:</strong> Request deletion of your
                personal information
              </li>
              <li>
                <strong>Right to opt out:</strong> Opt out of the sale of your
                personal information (note: we do not sell personal information)
              </li>
              <li>
                <strong>Right to non-discrimination:</strong> We will not
                discriminate against you for exercising your privacy rights
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">7.3 For All Users</h3>
            <p>Regardless of your location, you always have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Clear your locally stored Markdown content at any time using the
                &quot;Clear&quot; button in the editor or by clearing your
                browser&apos;s storage
              </li>
              <li>
                Opt out of personalised advertising through your browser
                settings or Google&apos;s Ads Settings
              </li>
              <li>Disable cookies through your browser preferences</li>
              <li>Contact us with any privacy-related questions or concerns</li>
            </ul>
          </div>
        </section>

        {/* Children's Privacy */}
        <section id="children-privacy" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            8. Children&apos;s Privacy
          </h2>
          <p>
            MDViewer is not directed at children under the age of 13. We do not
            knowingly collect personal information from children under 13. If we
            become aware that we have inadvertently collected personal data from
            a child under 13, we will take steps to delete that information as
            quickly as possible. If you believe we may have collected
            information from a child under 13, please contact us at{" "}
            <a
              href="mailto:support@mdviewer.in"
              className="text-primary hover:underline"
            >
              support@mdviewer.in
            </a>
            .
          </p>
        </section>

        {/* International Transfers */}
        <section
          id="international-transfers"
          className="space-y-4 scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold text-foreground">
            9. International Data Transfers
          </h2>
          <p>
            Our website is hosted on Vercel&apos;s global edge network, which
            means your requests may be processed in data centres around the
            world. Third-party services such as Google AdSense and Vercel
            Analytics may process data in countries outside your country of
            residence. These transfers are conducted in accordance with
            applicable data protection laws and appropriate safeguards.
          </p>
        </section>

        {/* Changes */}
        <section id="changes" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, technology, or legal requirements. When we
            make material changes, we will update the &quot;Last updated&quot;
            date at the top of this page. We encourage you to review this policy
            periodically to stay informed about how we are protecting your
            information.
          </p>
          <p>
            Your continued use of MDViewer after any changes to this policy
            constitutes your acceptance of the updated terms.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            11. Contact Us
          </h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, you can reach us through:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:support@mdviewer.in"
                className="text-primary hover:underline"
              >
                support@mdviewer.in
              </a>
            </li>
            <li>
              <strong>Contact form:</strong>{" "}
              <Link href="/contact" className="text-primary hover:underline">
                mdviewer.in/contact
              </Link>
            </li>
          </ul>
          <p>
            We aim to respond to all privacy-related inquiries within 30 days.
          </p>
        </section>
      </article>
    </Layout>
  );
}
