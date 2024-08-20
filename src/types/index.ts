export interface PDFInfo {
  PDFFormatVersion: string;
  IsAcroFormPresent: boolean;
  IsXFAPresent: boolean;
  Title: string;
  Author: string;
  Creator: string;
  Producer: string;
  CreationDate: string;
  ModDate: string;
}

export interface PDFMetadata {
  version: string;
  info: PDFInfo;
  metadata: null | object;
  totalPages: number;
}

export interface Location {
  pageNumber: number;
}

export interface Metadata {
  source: string;
  pdf: PDFMetadata;
  loc: Location;
}

export interface LangChainDocument {
  pageContent: string;
  metadata: Metadata;
}
