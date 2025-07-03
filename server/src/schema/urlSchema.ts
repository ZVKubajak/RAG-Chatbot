import { z } from "zod";

const urlSchema = z.string().url().max(200);

export default urlSchema;
