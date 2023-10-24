import {
  type Vector,
  utils as PineconeUtils,
} from "@pinecone-database/pinecone";
import { deleteFile, downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { type PDFPage } from "@/types/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { getPineconeClient } from "./config";

export async function loadS3ToPinecone(file_key: string) {
  // 1. Get the pdf => Download and read from the pdf
  console.log("Downloading pdf...");
  const file_name = await downloadFromS3(file_key);

  if (!file_name) {
    throw new Error("could not download pdf");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. Split and segment the pdf
  try {
    const documents = await Promise.all(
      pages.map((document) => prepareDocument(document, file_key))
    );

    // 3. Vectorize and embed doc documents
    const vectors = await Promise.all(
      documents.flat().map((document) => embedDocument(document, file_key))
    );

    // 4. Upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX!);

    //   const namespace = convertToAscii(file_key);
    void PineconeUtils.chunkedUpsert(pineconeIndex, vectors, "", 10);

    return documents[0];
  } catch (err) {
    console.error(err);
  } finally {
    deleteFile(file_name);
  }
}

export function truncateStringByBytes(str: string, bytes: number) {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage, file_key: string) {
  const { pageContent, metadata } = page;
  const content = pageContent.replace(/\n/g, "");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent: content,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(content, 36000),
        fileKey: file_key,
      },
    }),
  ]);

  return docs;
}

async function embedDocument(doc: Document, file_key: string) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
        fileKey: file_key,
      },
    } as Vector;
  } catch (error) {
    console.log("error embedding the document", error);
    throw error;
  }
}
