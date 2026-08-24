import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const index = pc.index(process.env.PINECONE_INDEX_NAME);

export const addChunks = async (chunks, namespace) => {
    if (!namespace) throw new Error("Namespace required");
    if (!chunks || chunks.length === 0) return;

    const records = chunks.map((chunk) => ({
        id: `${chunk.filePath.replace(/\//g, "_")}-${chunk.chunkIndex}`,
        values: chunk.embedding,
        metadata: {
            filePath: chunk.filePath,
            chunkIndex: chunk.chunkIndex,
            startLine: chunk.startLine,
            endLine: chunk.endLine,
            chunkText: chunk.chunkText
        }
    }));
    console.log("Records to upsert:", records.length);
    //console.log("Sample record:", JSON.stringify(records[0], null, 2));
    const batchsize = 100;
    for (let i = 0; i < records.length; i += batchsize) {
        const batch = records.slice(i, i + batchsize);
        await index.namespace(namespace).upsert({ records: batch });
        console.log(`Upserted batch ${Math.floor(i / batchsize) + 1}: ${batch.length} records`);
    }
    console.log(`Upserted ${records.length} chunks into namespace: ${namespace}`);
};

export const clearStore = async (namespace) => {
    if (!namespace) throw new Error("Namespace required");
    const size = await getNamespaceSize(namespace);
    if (size === 0) {
        console.log("Nothing to clear");
        return;
    }
    await index.namespace(namespace).deleteAll();
    console.log(`Cleared namespace: ${namespace}`);
};

export const searchSimilar = async (queryEmbedding, namespace, topK = 8) => {
    if (!namespace) throw new Error("Namespace required");

    const response = await index.namespace(namespace).query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true
    });

    return (response.matches || []).map(match => ({
        filePath: match.metadata?.filePath,
        chunkIndex: match.metadata?.chunkIndex,
        startLine: match.metadata?.startLine,
        endLine: match.metadata?.endLine,
        chunkText: match.metadata?.chunkText,
        score: match.score
    }));
};

export const getNamespaceSize = async (namespace) => {
    const stats = await index.describeIndexStats();
    const ns = stats.namespaces?.[namespace];
    return ns?.recordCount ?? 0;
};