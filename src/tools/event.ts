import { Client } from "discord.js";

export interface EventHandler {
    handler(client: Client): void
}
