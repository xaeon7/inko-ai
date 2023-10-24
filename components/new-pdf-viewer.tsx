"use client";
import { Document, Page, pdfjs } from "react-pdf";

import React from "react";
import { ChevronLeft, ChevronRight } from "./icons/chevron";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

type PDFViewerProps = { pdfUrl: string };

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = React.useState<number>(0);
  const [pageNumber, setPageNumber] = React.useState<number>(1); // start on first page
  const [loading, setLoading] = React.useState(true);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }) {
    setNumPages(nextNumPages);
  }

  function onPageLoadSuccess() {
    setLoading(false);
  }

  // Go to next page
  function goToNextPage() {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  }

  function goToPreviousPage() {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  }
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="h-full w-full bg-neutral-800" />;
  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col">
      <Nav
        pageNumber={pageNumber}
        numPages={numPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />

      <div
        hidden={loading}
        className="flex items-center w-full h-full text-neutral-400 overflow-hidden bg-neutral-800 relative"
      >
        <div className="h-full w-full mx-auto overflow-auto scroll-smooth">
          <Document
            file={encodeURI(pdfUrl)}
            onLoadSuccess={onDocumentLoadSuccess}
            renderMode="canvas"
            className="flex justify-center items-center h-full w-full"
          >
            <Page
              className="h-full"
              key={pageNumber}
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onLoadSuccess={onPageLoadSuccess}
              onRenderError={() => setLoading(false)}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}

function Nav({
  pageNumber,
  numPages,
  goToPreviousPage,
  goToNextPage,
}: {
  pageNumber: number;
  numPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}) {
  return (
    <nav className="w-full bg-neutral-900 border-b border-neutral-600 flex items-center justify-center p-3">
      <div className="flex items-center gap-3">
        <button
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
          className="select-none text-neutral-200 duration-200 hover:text-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="w-3 h-3" />
        </button>

        <div className="bg-neutral-800 border border-neutral-600 text-neutral-100 rounded-md px-3 py-2 text-sm font-medium">
          <span>{pageNumber}</span>
          <span className="text-neutral-400"> / {numPages}</span>
        </div>

        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="select-none text-neutral-200 duration-200 hover:text-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </nav>
  );
}
