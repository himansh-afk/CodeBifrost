import { generateEmbedding } from "./embedder.js";
import { addChunks, searchSimilar } from "./vectorStore.js";

const testChunks = [
    {
        filePath: "authController.js",
        chunkText: `
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({
                    message: "Invalid credentials"
                });
            }

            const isMatch = await bcrypt.compare(
                password,
                user.password
            );
        `,
        chunkIndex: 0,
        startLine: 1,
        endLine: 15
    },

    {
        filePath: "authController.js",
        chunkText: `
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET
            );

            res.json({ token });
        `,
        chunkIndex: 1,
        startLine: 16,
        endLine: 25
    },

    {
        filePath: "postController.js",
        chunkText: `
            const posts = await Post.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        `,
        chunkIndex: 0,
        startLine: 20,
        endLine: 30
    }
];

for (const chunk of testChunks) {

    chunk.embedding = await generateEmbedding(
        chunk.chunkText
    );
}

addChunks(testChunks);

const question = "How does JWT authentication work?";

const questionEmbedding = await generateEmbedding(question);

const results = searchSimilar(
    questionEmbedding,
    2
);

console.log("\nQuestion:");
console.log(question);

console.log("\nTop results:\n");

for (const result of results) {

    console.log({
        filePath: result.filePath,
        chunkIndex: result.chunkIndex,
        score: result.score,
        chunkText: result.chunkText
    });

}