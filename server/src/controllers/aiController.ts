import { Request, Response } from "express";
import qdrant, { collectionName } from "../config/qdrant";
import openai from "../config/openai";
import promptSchema from "../schema/promptSchema";
import payloadSchema from "../schema/payloadSchema";

export const chat = async (req: Request, res: Response) => {
  const parsedPrompt = promptSchema.safeParse(req.body.question);
  if (!parsedPrompt.success) {
    res.status(400).json({ message: "Request Parsing Error" });
    return;
  }

  const question = parsedPrompt.data;

  try {
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: parsedPrompt.data,
    });

    const vector = queryEmbedding.data[0].embedding;
    const points = await qdrant.search(collectionName, {
      vector,
      limit: 5,
      with_payload: true,
    });

    const contextSnippets = points.map(({ payload }) => {
      const parsedPayload = payloadSchema.parse(payload);
      return parsedPayload.content;
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            You are a document-based assistant.

            - You can only answer questions using the context snippets provided.
            - Each snippet may mention a specific person (e.g. Goblin, Bryce, Mike).
            - Only use snippets that clearly refer to the person asked about.
            - Do not infer or assume things based on similarity or prior knowledge.
            - If no snippet talks about the person, reply: "I don’t have enough information to answer that."
            - Do not answer questions about people not mentioned in any snippet.
            - Be concise and factual.`,
        },
        { role: "user", content: `Question: ${question}` },
        ...contextSnippets.map((context, i) => ({
          role: "user" as const,
          content: `Context Snippet #${i + 1}:\n\n${context}`,
        })),
      ],
    });

    res.status(200).json(response.choices[0].message.content);
  } catch (error) {
    console.log("Error AI chat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
