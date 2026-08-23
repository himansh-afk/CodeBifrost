import { generateEmbedding } from "./embedder.js";

const text = `
JWT authentication allows a server
to verify the identity of user.
`;

const embeddings = await generateEmbedding(text);

console.log("Embedding generated!");
console.log("Dimensions:", embeddings.length);
console.log("First 10 values:", embeddings.slice(0, 10));