# CodeBifrost

CodeBifrost is an AI-powered code analysis tool that allows developers to analyze GitHub repositories and ask questions about their code, architecture, and implementation using natural language.

The application uses Retrieval-Augmented Generation (RAG) to retrieve relevant code from a repository before generating an answer with an LLM.

## Features

- GitHub OAuth authentication
- JWT-based authentication
- GitHub repository analysis
- Source-code filtering and chunking
- Code embeddings
- Semantic code retrieval with Pinecone
- Repository-specific Pinecone namespaces
- Local LLM responses using Ollama
- Repository-aware conversational Q&A
- Markdown and code-block responses
- File and line references in answers
- Dynamic repository list
- User profile and avatar
- Account deletion

## Architecture

```text
GitHub Repository
        |
        v
    GitHub API
        |
        v
  File Filtering
        |
        v
   Code Chunking
        |
        v
    Embeddings
        |
        v
 Pinecone Vector Store
        |
        v
    User Query
        |
        v
 Semantic Retrieval
        |
        v
 Relevant Code Chunks
        |
        v
    Ollama LLM
        |
        v
      Answer
```

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- CSS
- Lucide React
- React Markdown

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- GitHub API

**AI / RAG**
- Ollama
- Embeddings
- Pinecone
- Retrieval-Augmented Generation

## Project Structure

```
CodeBifrost/
├── client/
│   └── src/
│       ├── assets/
│       ├── components/
│       └── pages/
│
└── server/
    ├── config/
    ├── controller/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    │   ├── github/
    │   ├── llm/
    │   └── rag/
    └── utils/
```

## Environment Variables

Create a `.env` file inside the `server` directory.

```
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=your_github_callback_url

FRONTEND_URL=http://localhost:5173
```

> Do not commit `.env` or expose credentials in the repository.

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd CodeBifrost
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

Configure the required environment variables in `server/.env`.

## Running the Application

Start the backend:

```bash
cd server
npm start
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the frontend URL provided by Vite.

## How It Works

1. The user authenticates using GitHub OAuth.
2. The user provides a GitHub repository URL.
3. CodeBifrost retrieves the repository through the GitHub API.
4. Source files are filtered to remove irrelevant files and directories.
5. Relevant source code is divided into chunks.
6. Each chunk is converted into an embedding.
7. Embeddings are stored in a repository-specific Pinecone namespace.
8. The user asks a question about the repository.
9. CodeBifrost performs semantic retrieval to find relevant code chunks.
10. The retrieved context is provided to Ollama.
11. Ollama generates a repository-aware response with relevant source references.

## Purpose

CodeBifrost is built to help developers understand unfamiliar codebases faster by allowing them to interact with repository code using natural language instead of manually searching through every file.
