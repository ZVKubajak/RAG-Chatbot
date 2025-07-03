import { z } from "zod";

export type Payload = z.infer<typeof payloadSchema>;

const payloadSchema = z.object({
  content: z.string(),
  chars: z.number().int().nonnegative(),
  file: z
    .object({
      name: z.string().max(100),
      type: z.string().max(100),
      size: z.number().int().nonnegative(),
    })
    .optional(),
});

export default payloadSchema;
