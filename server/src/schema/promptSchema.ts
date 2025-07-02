import { z } from "zod";

export type Prompt = z.infer<typeof promptSchema>;

const promptSchema = z.string().max(500);

export default promptSchema;
