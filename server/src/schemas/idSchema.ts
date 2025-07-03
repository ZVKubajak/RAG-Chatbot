import { z } from "zod";

export const idSchema = z.string().uuid();
export const idsSchema = z.array(idSchema);
