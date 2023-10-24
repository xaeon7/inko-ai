import { getEmbeddings } from "./embeddings";
import { type Metadata } from "@/types/pinecone";
import { getPineconeClient } from "./config";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  file_key: string
) {
  const pinecone = await getPineconeClient();

  const index = pinecone.Index(process.env.PINECONE_INDEX!);

  try {
    const queryResult = await index.query({
      queryRequest: {
        topK: 10,
        vector: embeddings,
        includeMetadata: true,
        filter: {
          fileKey: {
            $eq: file_key,
          },
        },
      },
    });

    return queryResult.matches ?? [];
  } catch (error) {
    console.log("error querying embeddings");
    throw error;
  }
}

export async function getContext(query: string, file_key: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, file_key);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  const docs = qualifyingDocs.map((match) => match.metadata as Metadata);

  const results = docs.map((doc) => `${doc.text}`);

  return results.join("\n");
}
