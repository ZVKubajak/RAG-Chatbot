import { Request, Response } from "express";
import qdrant, { collectionName } from "../configs/qdrant";
import openai from "../configs/openai";
import promptSchema from "../schemas/promptSchema";
import payloadSchema from "../schemas/payloadSchema";

export const chat = async (req: Request, res: Response) => {
  const parsedPrompt = promptSchema.safeParse(req.body.prompt);
  if (!parsedPrompt.success) {
    res.status(400).json({ message: "Request Parsing Error" });
    return;
  }

  const { data } = parsedPrompt;

  try {
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: data,
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
           You are a helpful assistant for a counseling service. You can only answer questions using the provided context snippets.

          Guidelines:
          - If a question is clearly about a person or topic mentioned in the snippets, respond with accurate, helpful information.
          - If the question is off-topic or not supported by the snippets, kindly say you don't have enough information *and* offer to help connect the user to the counselor.
          - Never guess, infer, or make up facts that aren't in the snippets.
          - If the question is inappropriate, calmly decline to answer but still offer help with counseling-related needs.
          - Speak with warmth and clarity. Be kind and professional, not robotic.

          If needed, you can suggest this contact info:
          - **Email:** tosharollins@uccasc.com
          - **Phone:** (864) 835-8409
          - **Hours:** Tuesday–Thursday, 10:00 am–5:00 pm (Easley, SC)`,
        },
        { role: "user", content: `Question: ${data}` },
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
