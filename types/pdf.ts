export type PDFPage = {
  pageContent: string;
  metadata: Metadata;
};
export type Metadata = {
  source: string;
  pdf: PDF;
  loc: Loc;
};

export type PDF = {
  version: string;
  info: Info;
  metadata: Metadata;
  totalPages: number;
};

export type Info = {
  PDFFormatVersion: string;
  IsAcroFormPresent: boolean;
  IsXFAPresent: boolean;
  Title: string;
  Producer: string;
  CreationDate: string;
  ModDate: string;
};

export type Loc = {
  pageNumber: number;
};
