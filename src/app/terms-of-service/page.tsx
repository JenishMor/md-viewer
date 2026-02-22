import { Metadata } from "next";
import { Layout } from "@/components/layout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | MDViewer - Usage Terms and Conditions",
  description:
    "Read the MDViewer Terms of Service. Understand your rights and responsibilities when using our free online Markdown editor, including usage policies, intellectual property, and liability.",
  alternates: {
    canonical: "https://mdviewer.in/terms-of-service",
  },
};

export default function TermsOfService() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-10">
        <header className="space-y-4 border-b pb-6">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: February 22, 2026
          </p>
          <p className="text-muted-foreground text-sm">
            These terms apply to the website{" "}
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
              <a href="#acceptance" className="text-primary hover:underline">
                Acceptance of Terms
              </a>
            </li>
            <li>
              <a href="#description" className="text-primary hover:underline">
                Description of Service
              </a>
            </li>
            <li>
              <a
                href="#use-of-service"
                className="text-primary hover:underline"
              >
                Use of the Service
              </a>
            </li>
            <li>
              <a
                href="#prohibited-uses"
                className="text-primary hover:underline"
              >
                Prohibited Uses
              </a>
            </li>
            <li>
              <a
                href="#intellectual-property"
                className="text-primary hover:underline"
              >
                Intellectual Property
              </a>
            </li>
            <li>
              <a href="#user-content" className="text-primary hover:underline">
                User Content
              </a>
            </li>
            <li>
              <a
                href="#third-party-links"
                className="text-primary hover:underline"
              >
                Third-Party Links and Advertising
              </a>
            </li>
            <li>
              <a href="#disclaimer" className="text-primary hover:underline">
                Disclaimer of Warranties
              </a>
            </li>
            <li>
              <a href="#limitation" className="text-primary hover:underline">
                Limitation of Liability
              </a>
            </li>
            <li>
              <a
                href="#indemnification"
                className="text-primary hover:underline"
              >
                Indemnification
              </a>
            </li>
            <li>
              <a href="#governing-law" className="text-primary hover:underline">
                Governing Law
              </a>
            </li>
            <li>
              <a href="#changes" className="text-primary hover:underline">
                Changes to These Terms
              </a>
            </li>
            <li>
              <a href="#severability" className="text-primary hover:underline">
                Severability
              </a>
            </li>
            <li>
              <a href="#contact" className="text-primary hover:underline">
                Contact Us
              </a>
            </li>
          </ol>
        </nav>

        {/* Acceptance of Terms */}
        <section id="acceptance" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using{" "}
            <Link
              href="https://mdviewer.in"
              className="text-primary hover:underline"
            >
              MDViewer
            </Link>
            , you acknowledge that you have read, understood, and agree to be
            bound by these Terms of Service. If you do not agree to these terms,
            please do not use our website.
          </p>
          <p>
            These Terms of Service constitute a legally binding agreement
            between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;)
            and MDViewer. We recommend that you review these terms periodically,
            as your continued use of the website after any modifications
            constitutes acceptance of the revised terms.
          </p>
        </section>

        {/* Description of Service */}
        <section id="description" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            2. Description of Service
          </h2>
          <p>
            MDViewer is a free, browser-based Markdown editor and previewer. The
            service allows you to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Write and edit Markdown content in a real-time split-pane editor
            </li>
            <li>Preview rendered Markdown with live syntax highlighting</li>
            <li>Export your rendered content as HTML</li>
            <li>
              Store your work locally in your browser using localStorage (no
              server-side storage)
            </li>
            <li>
              Access educational guides and tutorials about Markdown syntax and
              best practices
            </li>
          </ul>
          <p>
            The service is provided free of charge and is supported by
            advertising through Google AdSense. MDViewer does not require user
            registration or account creation to use the editor.
          </p>
        </section>

        {/* Use of the Service */}
        <section id="use-of-service" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            3. Use of the Service
          </h2>
          <p>
            You agree to use MDViewer only for lawful purposes and in accordance
            with these Terms. You are solely responsible for any content you
            enter into the editor. By using our service, you represent and
            warrant that:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              You are at least 13 years of age (or the minimum age required in
              your jurisdiction)
            </li>
            <li>
              You will comply with all applicable local, national, and
              international laws
            </li>
            <li>
              You will not use the service to process, store, or transmit
              content that infringes the intellectual property rights of any
              third party
            </li>
            <li>
              You will not attempt to interfere with the proper functioning of
              the website
            </li>
          </ul>
        </section>

        {/* Prohibited Uses */}
        <section id="prohibited-uses" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            4. Prohibited Uses
          </h2>
          <p>You agree not to use MDViewer to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Transmit, upload, or distribute any harmful, threatening, abusive,
              defamatory, obscene, or otherwise objectionable material
            </li>
            <li>Violate the privacy rights of any third party</li>
            <li>
              Attempt to gain unauthorised access to our systems, servers, or
              networks
            </li>
            <li>
              Use automated tools, bots, or scrapers to access the service in a
              manner that exceeds reasonable use
            </li>
            <li>
              Introduce viruses, malware, or any other harmful code through the
              service
            </li>
            <li>
              Circumvent, disable, or interfere with security-related features
              of the website
            </li>
            <li>
              Use the service in any way that could damage, disable, overburden,
              or impair our servers or infrastructure
            </li>
          </ul>
          <p>
            We reserve the right to restrict access to the service for any user
            who violates these prohibited use provisions.
          </p>
        </section>

        {/* Intellectual Property */}
        <section id="intellectual-property" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            5. Intellectual Property
          </h2>
          <p>
            The MDViewer website, including but not limited to its design,
            layout, graphics, logos, icons, written content (including guides
            and tutorials), and underlying software code, is the intellectual
            property of MDViewer and is protected by copyright, trademark, and
            other intellectual property laws.
          </p>
          <p>You may not, without our prior written consent:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Reproduce, distribute, or create derivative works from our website
              or its content
            </li>
            <li>Use our name, logo, or branding for any commercial purpose</li>
            <li>
              Frame, mirror, or otherwise incorporate any part of our website
              into another website or application
            </li>
          </ul>
          <p>
            MDViewer is open-source software. Use of the source code is governed
            by the terms of the applicable open-source licence as specified in
            the project repository.
          </p>
        </section>

        {/* User Content */}
        <section id="user-content" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            6. User Content
          </h2>
          <p>
            Any Markdown content you create, edit, or preview using MDViewer
            remains entirely your property. We do not claim any ownership rights
            over your content.
          </p>
          <p>
            Because MDViewer stores your content exclusively in your
            browser&apos;s localStorage:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>
                Your content is never uploaded to or stored on our servers.
              </strong>{" "}
              We have no access to the Markdown you write.
            </li>
            <li>
              <strong>
                You are responsible for backing up your own content.
              </strong>{" "}
              Clearing your browser data, switching browsers, or using a
              different device will result in the loss of locally stored
              content.
            </li>
            <li>
              <strong>We are not liable for any loss of content</strong> due to
              browser storage limitations, browser updates, or user actions.
            </li>
          </ul>
        </section>

        {/* Third-Party Links and Advertising */}
        <section id="third-party-links" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            7. Third-Party Links and Advertising
          </h2>
          <p>
            MDViewer displays advertisements provided by Google AdSense. These
            advertisements may contain links to third-party websites that are
            not owned or controlled by MDViewer.
          </p>
          <p>
            We have no control over, and assume no responsibility for, the
            content, privacy policies, or practices of any third-party websites
            or services. Clicking on third-party advertisements or links is at
            your own risk, and we encourage you to review the terms and privacy
            policies of any third-party website you visit.
          </p>
          <p>
            The inclusion of any link or advertisement does not imply
            endorsement, approval, or recommendation by MDViewer.
          </p>
        </section>

        {/* Disclaimer of Warranties */}
        <section id="disclaimer" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            8. Disclaimer of Warranties
          </h2>
          <p>
            MDViewer is provided on an &quot;AS IS&quot; and &quot;AS
            AVAILABLE&quot; basis without any warranties of any kind, either
            express or implied. To the fullest extent permitted by applicable
            law, we disclaim all warranties, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Implied warranties of merchantability and fitness for a particular
              purpose
            </li>
            <li>
              Warranties that the service will be uninterrupted, timely, secure,
              or error-free
            </li>
            <li>
              Warranties regarding the accuracy, reliability, or completeness of
              any content on the website, including guides and tutorials
            </li>
            <li>
              Warranties that the service will meet your specific requirements
              or expectations
            </li>
          </ul>
          <p>
            You acknowledge that you use the service at your own risk and that
            you are solely responsible for any consequences arising from your
            use of MDViewer.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section id="limitation" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            9. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall
            MDViewer, its owners, operators, contributors, or affiliates be
            liable for any direct, indirect, incidental, special, consequential,
            or punitive damages arising out of or in connection with:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your use of, or inability to use, the service</li>
            <li>
              Any loss of data, content, or work resulting from browser storage
              limitations or failures
            </li>
            <li>Any unauthorised access to or alteration of your data</li>
            <li>
              Any content or conduct of any third party on or through the
              service, including advertisements
            </li>
            <li>
              Any errors, omissions, or inaccuracies in the service or its
              content
            </li>
          </ul>
          <p>
            This limitation applies regardless of the legal theory on which the
            claim is based, whether in contract, tort (including negligence),
            strict liability, or otherwise.
          </p>
        </section>

        {/* Indemnification */}
        <section id="indemnification" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            10. Indemnification
          </h2>
          <p>
            You agree to indemnify, defend, and hold harmless MDViewer, its
            owners, operators, and affiliates from and against any claims,
            liabilities, damages, losses, and expenses (including reasonable
            legal fees) arising out of or in any way connected with:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Your use of the service or any content you create using the
              service
            </li>
            <li>Your violation of these Terms of Service</li>
            <li>Your violation of any applicable law or regulation</li>
            <li>Your infringement of any third-party rights</li>
          </ul>
        </section>

        {/* Governing Law */}
        <section id="governing-law" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            11. Governing Law
          </h2>
          <p>
            These Terms of Service shall be governed by and construed in
            accordance with the laws of India, without regard to its conflict of
            law principles. Any disputes arising from or relating to these terms
            or your use of MDViewer shall be subject to the exclusive
            jurisdiction of the courts located in India.
          </p>
          <p>
            If any dispute arises between you and MDViewer, we encourage you to
            first contact us directly at{" "}
            <a
              href="mailto:support@mdviewer.in"
              className="text-primary hover:underline"
            >
              support@mdviewer.in
            </a>{" "}
            to attempt to resolve the matter informally before pursuing formal
            legal action.
          </p>
        </section>

        {/* Changes to Terms */}
        <section id="changes" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            12. Changes to These Terms
          </h2>
          <p>
            We reserve the right to modify or replace these Terms of Service at
            any time. When we make material changes, we will update the
            &quot;Last updated&quot; date at the top of this page. It is your
            responsibility to review these Terms periodically.
          </p>
          <p>
            Your continued use of MDViewer following the posting of any changes
            constitutes your acceptance of those changes. If you do not agree to
            the revised terms, please discontinue use of the service.
          </p>
        </section>

        {/* Severability */}
        <section id="severability" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            13. Severability
          </h2>
          <p>
            If any provision of these Terms of Service is found to be invalid,
            illegal, or unenforceable by a court of competent jurisdiction, the
            remaining provisions shall continue in full force and effect. The
            invalid or unenforceable provision shall be modified to the minimum
            extent necessary to make it valid and enforceable while preserving
            its original intent.
          </p>
          <p>
            These Terms of Service, together with our{" "}
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            , constitute the entire agreement between you and MDViewer regarding
            the use of the service and supersede any prior agreements or
            understandings.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-4 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground">
            14. Contact Us
          </h2>
          <p>
            If you have any questions, concerns, or feedback regarding these
            Terms of Service, you can reach us through:
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
          <p>We aim to respond to all inquiries within 30 days.</p>
        </section>
      </article>
    </Layout>
  );
}
