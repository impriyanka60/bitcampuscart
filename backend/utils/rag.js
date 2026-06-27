const mongoose = require("mongoose");
const OpenAI = require("openai");
const { PDFParse } = require("pdf-parse");

const COLLECTION_NAME = "campus_documents";
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;
const TOP_K = 5;

let openai;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured on the backend");
  }
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
}

function getCollection() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected");
  }
  return mongoose.connection.collection(COLLECTION_NAME);
}

function chunkText(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const chunks = [];
  let start = 0;
  while (start < normalized.length) {
    let end = Math.min(start + CHUNK_SIZE, normalized.length);
    if (end < normalized.length) {
      const boundary = normalized.lastIndexOf(" ", end);
      if (boundary > start + CHUNK_SIZE / 2) end = boundary;
    }
    chunks.push(normalized.slice(start, end).trim());
    if (end === normalized.length) break;
    start = Math.max(end - CHUNK_OVERLAP, start + 1);
  }
  return chunks;
}

async function createEmbeddings(texts) {
  const embeddings = [];
  for (let index = 0; index < texts.length; index += 100) {
    const response = await getOpenAI().embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
      input: texts.slice(index, index + 100),
    });
    embeddings.push(...response.data.map((item) => item.embedding));
  }
  return embeddings;
}

async function ingestPDF(buffer, metadata = {}) {
  const parser = new PDFParse({ data: buffer });
  let parsed;
  try {
    parsed = await parser.getText();
  } finally {
    await parser.destroy();
  }

  const chunks = parsed.pages.flatMap((page) =>
    chunkText(page.text).map((text, index) => ({ text, page: page.num, chunk: index }))
  );
  if (chunks.length === 0) throw new Error("No readable text was found in the PDF");

  const embeddings = await createEmbeddings(chunks.map((chunk) => chunk.text));
  const documentId = new mongoose.Types.ObjectId();
  await getCollection().insertMany(
    chunks.map((chunk, index) => ({
      documentId,
      text: chunk.text,
      embedding: embeddings[index],
      metadata: { ...metadata, page: chunk.page, chunk: chunk.chunk },
      createdAt: new Date(),
    }))
  );

  return {
    success: true,
    documentId: documentId.toString(),
    pages: parsed.total,
    chunksIngested: chunks.length,
  };
}

function cosineSimilarity(left, right) {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude) || 1);
}

async function fallbackSearch(collection, queryVector, type) {
  const filter = type ? { "metadata.type": type } : {};
  const candidates = await collection
    .find(filter, { projection: { text: 1, embedding: 1, metadata: 1 } })
    .limit(2000)
    .toArray();
  return candidates
    .map((document) => ({
      ...document,
      score: cosineSimilarity(queryVector, document.embedding),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, TOP_K);
}

async function retrieveChunks(question, type) {
  const [queryVector] = await createEmbeddings([question]);
  const collection = getCollection();
  const vectorSearch = {
    index: process.env.ATLAS_VECTOR_INDEX || "vector_index",
    path: "embedding",
    queryVector,
    numCandidates: 100,
    limit: TOP_K,
  };
  if (type) vectorSearch.filter = { "metadata.type": type };

  try {
    return await collection
      .aggregate([
        { $vectorSearch: vectorSearch },
        { $project: { text: 1, metadata: 1, score: { $meta: "vectorSearchScore" } } },
      ])
      .toArray();
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    return fallbackSearch(collection, queryVector, type);
  }
}

async function queryCampus(question, filters = {}) {
  const chunks = await retrieveChunks(question, filters.type);
  if (chunks.length === 0) {
    return { answer: "I couldn't find that in the uploaded campus documents.", sources: [] };
  }

  const context = chunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1}: ${chunk.metadata?.name || chunk.metadata?.filename || "Campus document"}, page ${chunk.metadata?.page || "?"}]\n${chunk.text}`
    )
    .join("\n\n");
  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are CampusConnect AI for BIT Mesra students. Answer only from the supplied context. If the context does not contain the answer, say so clearly. Cite sources using [Source N].",
      },
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
    ],
  });

  return {
    answer: completion.choices[0]?.message?.content || "No answer was generated.",
    sources: chunks.map((chunk) => ({
      name: chunk.metadata?.name || chunk.metadata?.filename || "Campus document",
      page: chunk.metadata?.page,
      type: chunk.metadata?.type,
      score: chunk.score,
    })),
  };
}

async function generateListing(details) {
  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Create a student-friendly campus marketplace listing. Return JSON with title, description, tags, suggestedPrice, and tips.",
      },
      { role: "user", content: JSON.stringify(details) },
    ],
  });
  return JSON.parse(completion.choices[0]?.message?.content || "{}");
}

module.exports = { generateListing, ingestPDF, queryCampus };
