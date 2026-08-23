import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { chunkCode } from "./chunker.js";
import { generateEmbedding } from "./embedder.js";

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const testDataPath = path.join(
    __dirname,
    "test-data",
    "authController.js"
);

const code = fs.readFileSync(testDataPath, "utf-8");

// Step 1: Chunk the code
const chunks = chunkCode(code, "authController.js");

console.log(`Total chunks: ${chunks.length}`);

// Step 2: Generate embedding for each chunk
for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.chunkText);

    chunk.embedding = embedding;

    console.log(
        `Chunk ${chunk.chunkIndex} → ${embedding.length} dimensions`
    );
}

console.log("\nFirst chunk:");
console.log(chunks[0]);