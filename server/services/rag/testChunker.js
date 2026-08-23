import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chunkCode } from "./chunker.js";

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const testDataPath = path.join(
    __dirname,
    "test-data",
    "authController.js"
);

const code = fs.readFileSync(testDataPath, "utf-8");

const chunks = chunkCode(code, "authController.js");

console.log(chunks);