"use client";

import { useEffect, useState } from "react";
import LZString from "lz-string";
import { ClipboardCopy, Code2, Link2, Newspaper } from "lucide-react";
import { Modal, buttonStyles } from "@/components/modal";
import { buildStandaloneHtml, copyRichHtml, copyText } from "@/lib/export";

// Kept well under common URL limits of browsers, chat apps and link shorteners.
export const MAX_SHARE_URL_LENGTH = 8000;

export function createShareUrl(markdown: string) {
  const compressed = LZString.compressToEncodedURIComponent(markdown);
  return `${window.location.origin}${window.location.pathname}#lz=${compressed}`;
}

type Destination = "link" | "blog";

export function PublishDialog({
  open,
  onClose,
  markdown,
  title,
  getFragment,
  notify,
}: {
  open: boolean;
  onClose: () => void;
  markdown: string;
  title: string;
  getFragment: () => Promise<{ html: string; notes: string[] }>;
  notify: (message: string, kind?: "success" | "error" | "info") => void;
}) {
  const [destination, setDestination] = useState<Destination>("link");
  const [confirmed, setConfirmed] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [fragment, setFragment] = useState<{ html: string; notes: string[] } | null>(null);

  const close = () => {
    setConfirmed(false);
    setLink(null);
    setFragment(null);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getFragment().then((f) => !cancelled && setFragment(f));
    return () => {
      cancelled = true;
    };
  }, [open, getFragment]);

  const shareUrl = open ? createShareUrl(markdown) : "";
  const tooLong = shareUrl.length > MAX_SHARE_URL_LENGTH;

  const createLink = async () => {
    setLink(shareUrl);
    try {
      await copyText(shareUrl);
      notify("Share link copied to clipboard.", "success");
    } catch {
      notify("Link created, but the clipboard is blocked. Copy it from the box below.", "error");
    }
  };

  const copyRich = async () => {
    if (!fragment) return;
    try {
      await copyRichHtml(fragment.html, markdown);
      notify("Formatted content copied. Paste it into your blog editor's visual mode.", "success");
    } catch {
      notify("Clipboard access was blocked by the browser.", "error");
    }
  };

  const copySource = async () => {
    if (!fragment) return;
    try {
      await copyText(fragment.html);
      notify("HTML source copied. Paste it into your platform's HTML/code view.", "success");
    } catch {
      notify("Clipboard access was blocked by the browser.", "error");
    }
  };

  const tab = (id: Destination, label: string, Icon: typeof Link2) => (
    <button
      type="button"
      role="tab"
      aria-selected={destination === id}
      onClick={() => {
        setDestination(id);
        setConfirmed(false);
      }}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium cursor-pointer ${
        destination === id ? "bg-background shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden /> {label}
    </button>
  );

  return (
    <Modal open={open} onClose={close} title="Publish / Share" size="lg">
      <div role="tablist" aria-label="Destination" className="mb-4 inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1">
        {tab("link", "Share link", Link2)}
        {tab("blog", "Copy for blog platforms", Newspaper)}
      </div>

      {destination === "link" ? (
        <div className="space-y-3" role="tabpanel">
          <p>
            Creates a link that contains your whole document, compressed into the
            part of the URL after <code>#</code>. That part is never sent to the
            MDViewer server — the document is decoded in the recipient&apos;s browser.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Anyone who has the link can read the document.</li>
            <li>
              The link can&apos;t be revoked or expire: the content lives in the link
              itself. Only share it with people you trust, and never include secrets.
            </li>
            <li>Opening the link adds a copy to the recipient&apos;s local documents. Later edits are not shared.</li>
          </ul>
          <p className="text-muted-foreground">
            Link length: {shareUrl.length.toLocaleString()} / {MAX_SHARE_URL_LENGTH.toLocaleString()} characters.
          </p>
          {tooLong ? (
            <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100" role="alert">
              This document is too large to share as a link. Export it as a file
              (Export → Download Markdown) and share the file instead.
            </p>
          ) : (
            <>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                <span>I understand that anyone with this link can read this document.</span>
              </label>
              <button type="button" className={buttonStyles.primary} disabled={!confirmed} onClick={createLink}>
                <Link2 className="h-4 w-4" /> Create &amp; copy link
              </button>
              {link && (
                <input
                  readOnly
                  aria-label="Share link"
                  value={link}
                  onFocus={(e) => e.currentTarget.select()}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs"
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3" role="tabpanel">
          <p>
            Copy the rendered document and paste it into WordPress, Blogger,
            Medium, Ghost or another editor. Nothing is uploaded — you paste it
            yourself. Review exactly what will be copied:
          </p>
          <div className="overflow-hidden rounded-lg border border-border">
            {fragment ? (
              <iframe
                title="Preview of content to copy"
                sandbox=""
                srcDoc={buildStandaloneHtml(title, fragment.html)}
                className="h-72 w-full bg-white"
              />
            ) : (
              <div className="h-72 animate-pulse bg-muted" />
            )}
          </div>
          {fragment && fragment.notes.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              {fragment.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Images must be hosted at public URLs to appear on your site.</li>
            <li>Diagrams are copied as inline SVG; some platforms strip SVG — use Export → HTML for a faithful copy.</li>
            <li>Math needs KaTeX styles on the destination site to display correctly.</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonStyles.primary} disabled={!fragment} onClick={copyRich}>
              <ClipboardCopy className="h-4 w-4" /> Copy formatted content
            </button>
            <button type="button" className={buttonStyles.secondary} disabled={!fragment} onClick={copySource}>
              <Code2 className="h-4 w-4" /> Copy HTML source
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
