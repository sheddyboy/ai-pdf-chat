import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { LangChainDocument } from "@/types";
import { getEmbeddings } from "@/lib/openai";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export default pc;

export function truncateStringByByte(str: string, bytes: number) {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
}

export async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function prepareDocument({
  pageContent,
  metadata,
}: LangChainDocument) {
  pageContent = pageContent.replace(/\n/g, " ");
  const splitter = new RecursiveCharacterTextSplitter();
  try {
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByByte(pageContent, 36000),
        },
      }),
    ]);
    return docs;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getRelevantContextFromPinecone({
  query,
  namespace,
}: {
  query: string;
  namespace: string;
}) {
  try {
    const vectors = await getEmbeddings(query);
    const matches = await getMatchesFromPinecone({
      index: "chat-with-pdf",
      namespace,
      vectors,
    });
    const qualifiedMatches = matches.filter(
      (match) => match.score && match.score > 0.7,
    );
    const context = qualifiedMatches
      .map(
        (match) =>
          (match.metadata as { text: string; pageNumber: number }).text,
      )
      .join("\n")
      .substring(0, 3000);

    return context;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getMatchesFromPinecone({
  namespace,
  index,
  vectors,
}: {
  namespace: string;
  index: string;
  vectors: number[];
}) {
  try {
    const pineconeIndex = pc.Index(index);
    const pineconeNamespace = pineconeIndex.namespace(namespace);
    const queryResponse = await pineconeNamespace.query({
      topK: 5,
      vector: vectors,
      includeMetadata: true,
    });
    return queryResponse.matches;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
