import dotenv from "dotenv"
import { injectable } from "tsyringe";
import { z } from "zod"

const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]),
    DISCORD_TOKEN: z.string(),
    GUILD_ID: z.string().optional()
})
    .refine((data) => data.NODE_ENV === "production" || data.GUILD_ID, {
        message: "Guild ID is required in development mode",
        path: ["GUILD_ID"]
    })

export type Env = z.infer<typeof EnvSchema>

@injectable()
export class Config {
    public parsed: Env

    constructor() {
        dotenv.config()

        const data = EnvSchema.safeParse(process.env)

        if (!data.success) {
            console.error("Invalid config:", data.error.issues)
            process.exit(1)
        }

        this.parsed = data.data
    }

    public get<K extends keyof Env>(key: K): Env[K] {
        return this.parsed[key]
    }
}
