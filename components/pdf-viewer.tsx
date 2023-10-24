"use client";

type PDFViewerProps = { pdfUrl: string };

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  return !pdfUrl ? (
    <div className="h-full w-full bg-neutral-800" />
  ) : (
    <iframe
      src={`https://docs.google.com/gview?url=${encodeURI(
        pdfUrl
      )}&embedded=true`}
      className="h-full w-full bg-neutral-800"
    />
  );
}
