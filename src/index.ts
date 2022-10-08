require("dotenv").config()
import { Client, IntentsBitField } from "discord.js"

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
    ]
})

client.on("messageCreate", (message) => {
    console.log("message:", message)

    if (message.author.bot) {
        return console.log("ignored bot message", message.content)
    }
    
    message.reply("You said:" + message.content)
})

client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log("connected"))
    .catch(() => console.log("connection failed"))
