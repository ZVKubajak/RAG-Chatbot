import { z } from "zod";

const promptSchema = z.string().max(500);

export default promptSchema;
