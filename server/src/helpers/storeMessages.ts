import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const clientId = process.env.CLIENT_ID!;

const storeMessages = async (
  userMessage: string,
  AIMessage: string,
  tokens: number,
  sessionId?: string
) => {
  try {
    await prisma.client.update({
      where: { id: clientId },
      data: {
        usage: {
          update: {
            messages: { increment: 2 },
            tokensUsed: { increment: tokens },
          },
        },
      },
    });

    let session;
    if (sessionId) {
      session = await prisma.session.update({
        where: { id: sessionId },
        data: {
          messages: {
            push: [
              { text: userMessage, isBot: false },
              { text: AIMessage, isBot: true },
            ],
          },
        },
      });
    } else {
      session = await prisma.session.create({
        data: {
          clientId,
          messages: [
            { text: userMessage, isBot: false },
            { text: AIMessage, isBot: true },
          ],
        },
      });
    }

    return session.id;
  } catch (error) {
    console.error("Error storing messages:", error);
    throw error;
  }
};

export default storeMessages;
