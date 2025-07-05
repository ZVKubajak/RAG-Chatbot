import { z } from "zod";

const chatSchema = z.object({
  prompt: z.string().max(500),
  sessionId: z.string().length(24).optional(),
});

export default chatSchema;
