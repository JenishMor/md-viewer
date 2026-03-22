import Link from "next/link";

type EditorialNoteProps = {
  reviewedDate: string;
};

export function EditorialNote({ reviewedDate }: EditorialNoteProps) {
  return (
    <section
      className="rounded-2xl border bg-muted/40 p-5 space-y-3"
      aria-label="Editorial transparency"
    >
      <h2 className="text-base font-semibold">Editorial transparency</h2>
      <p className="text-sm text-muted-foreground">
        Written by Jenish Mor and reviewed by the MDViewer Editorial Team. We
        test examples in the MDViewer editor before publishing and update this
        page when workflows change.
      </p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Last reviewed: {reviewedDate}</span>
        <span>•</span>
        <Link href="/about" className="text-primary hover:underline">
          About the author and team
        </Link>
      </div>
    </section>
  );
}
