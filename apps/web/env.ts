import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    server: {
        ANTHROPIC_API_KEY: z.string(),
        GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
        ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
    }, client: {
        NEXT_PUBLIC_BASE_URL: z.string().optional(),
    }, experimental__runtimeEnv: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : undefined)
    }
})