import "reflect-metadata"
import { IntentsBitField } from "discord.js"
import { injectable } from "tsyringe";
import { container } from "@/container";
import { Bot } from "@/tools/bot";
import { autoDiscover } from "@/tools/discovery";
import { Config } from "@/services/config";

@injectable()
class App {
    constructor(private config: Config) { }

    public async start() {
        // create bot instance
        const bot = new Bot(container, {
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
            ]
        })

        // register events
        bot.registerEvents(autoDiscover("./events"))

        // register commands
        bot.addCommands(autoDiscover("./commands"))

        const token = this.config.get("DISCORD_TOKEN")
        const guildId = this.config.get("GUILD_ID")
        const debug = this.config.get("NODE_ENV") === "development"

        // register commands on interactionCreate event
        bot.registerInteractionCommands(async (interaction) => {
            await interaction.reply("Sorry you used a command that does not exist.")
        })

        // register rest api commands on ready event
        bot.registerRestCommands(token, debug, guildId)

        // login client
        await bot.client.login(token)
            .then(() => console.log("bot connected successfully"))
            .catch((error) => console.error("bot connection failed:", error))
    }
}

container.resolve(App).start()
