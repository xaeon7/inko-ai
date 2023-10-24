"use client";

import React from "react";

type PDFViewerProps = { pdfUrl: string };

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  return !pdfUrl || !isClient ? (
    <div className="h-full w-full bg-neutral-800" />
  ) : (
    <embed
      src={`https://docs.google.com/viewerng/viewer?embedded=true&url=${encodeURI(
        pdfUrl
      )}`}
      className="h-full w-full bg-neutral-800"
    />
  );
}
