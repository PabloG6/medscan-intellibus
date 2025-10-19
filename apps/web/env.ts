import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    server: {
        ANTHROPIC_API_KEY: z.string(),
        GOOGLE_GENERATIVE_AI_API_KEY: z.string()
    }, client: {
        NEXT_PUBLIC_BASE_URL: z.string(),
    }, experimental__runtimeEnv: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
    }
})