import { generateAnswer } from "./llmService.js";

const question = "is JWT authentication implemented?";

const chunks = [
    {
        filePath: "authController.js",
        startLine: 1,
        endLine: 15,
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
        `
    },

    {
        filePath: "authController.js",
        startLine: 16,
        endLine: 25,
        chunkText: `
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET
            );

            res.json({ token });
        `
    }
];

const answer = await generateAnswer(
    question,
    chunks
);

console.log("\nANSWER:\n");
console.log(answer);