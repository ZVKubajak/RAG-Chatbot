import { Request, Response } from "express";
import qdrant, { collectionName } from "../configs/qdrant";
import openai from "../configs/openai";
import chatSchema from "../schemas/chatSchema";
import payloadSchema from "../schemas/payloadSchema";
import storeMessages from "../helpers/storeMessages";

const chat = async (req: Request, res: Response) => {
  const parsedReq = chatSchema.safeParse(req.body);
  if (!parsedReq.success) {
    res.status(400).json({ message: "Request Parsing Error" });
    return;
  }

  const { data } = parsedReq;

  try {
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: data.prompt,
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

    console.log("SNIPPET COUNT:", contextSnippets.length);
    console.log("USER'S PROMPT:", data.prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
           You are a helpful chatbot assistant.
           
           Only answer using the context snippets provided. Do not guess or invent any information.
           If the answer is not clearly stated in the context, tell the user you don't have enough information for that.
           NEVER reference the existence of context snippets in your response.`,
        },
        { role: "user", content: `User's Prompt: ${data.prompt}` },
        ...contextSnippets.map((context, i) => ({
          role: "user" as const,
          content: `Context Snippet #${i + 1}:\n\n${context}`,
        })),
      ],
    });

    const message = response.choices[0].message.content;
    const tokens = response.usage?.total_tokens;
    if (!message || !tokens)
      throw new Error("AI message and/or token usage not available.");

    const sessionId = await storeMessages(
      data.prompt,
      message,
      tokens,
      data.sessionId
    );

    res.status(200).json({ message, sessionId });
  } catch (error) {
    console.log("Error AI chat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default chat;
