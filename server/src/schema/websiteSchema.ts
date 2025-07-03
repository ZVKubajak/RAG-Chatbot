import { z } from "zod";

const websiteSchema = z.string().url().max(200);

export default websiteSchema;
