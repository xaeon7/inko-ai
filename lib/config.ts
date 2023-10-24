import { PineconeClient } from "@pinecone-database/pinecone";

let pinecone: PineconeClient | null = null;

export async function getPineconeClient() {
  if (!pinecone) {
    pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  return pinecone;
}
