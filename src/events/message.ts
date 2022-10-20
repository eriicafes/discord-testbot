import { Client } from "discord.js";
import { EventHandler } from "@/tools/event";
import { injectable } from "tsyringe";

@injectable()
export default class MessageCreateEvent implements EventHandler {

    public handler(client: Client) {
        client.on("messageCreate", async (message) => {
            if (message.author.bot) return

            console.log("incoming:", message.content, "from:", message.author.username)

            await message.reply(`<@${message.author.id}> said ${message.content}`)
            console.log("replied user message")
        })
    }
}
