import { ChatInputCommandInteraction, Client, ClientOptions, Collection, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js"
import { DependencyContainer } from "tsyringe"
import { constructor } from "tsyringe/dist/typings/types"
import { Command } from "@/tools/command"
import { EventHandler } from "@/tools/event"

export type BotCreateOptions = { options: ClientOptions, container: DependencyContainer }

export class Bot {
    public client: Client
    public commands: Collection<string, Command>

    private commandData: RESTPostAPIApplicationCommandsJSONBody[] | null = null

    /**
     * Create discord bot instance
     * 
     * stores a dependency container for resolving other dependencies
     * @param container dependency injection container
     * @param options discord client options
     */
    constructor(protected container: DependencyContainer, options: ClientOptions) {
        this.client = new Client(options)
        this.commands = new Collection()
    }

    /**
     * Add commands.
     * @param commands injectable command constructors
     */
    public addCommands(commands: constructor<Command>[]) {
        for (const command of commands) {
            // resolve command instance
            const commandInstance = this.container.resolve(command)

            // add command to commands collection
            this.commands.set(commandInstance.data.name, commandInstance)

            // add command data to commandData array, creating the array if null
            if (this.commandData === null) this.commandData = [commandInstance.data.toJSON()]
            else this.commandData.push(commandInstance.data.toJSON())
        }
    }

    /**
     * Register events.
     * @param events injectable event constructors
     */
    public registerEvents(events: constructor<EventHandler>[]) {
        for (const event of events) {
            const eventHandlerInstance = this.container.resolve(event)
            eventHandlerInstance.handler(this.client)
        }
    }
    
    /**
     * Register commands on client `interactionCreate` event
     * @param fallbackInteraction fallback interaction, called when interaction command name is not found
     */
    public registerInteractionCommands(fallbackInteraction: (interaction: ChatInputCommandInteraction) => Promise<void>) {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isChatInputCommand()) return

            const command = this.commands.get(interaction.commandName)

            if (!command) {
                return fallbackInteraction(interaction)
            }

            return command.run(interaction)
        })
    }
    
    /**
     * Register discord REST API commands on client `ready` event
     * @param token bot token
     * @param debug indicates if bot is being run in debug mode
     * @param guildId guild id, required if debug is set to true
     */
    public registerRestCommands(token: string, debug: boolean, guildId: string | undefined) {
        this.client.once("ready", async (readyClient) => {
            if (!this.commandData) return
    
            const rest = new REST({ version: "10" }).setToken(token)
    
            if (debug) {
                if (!guildId) throw new Error("guild id is required during development")
                await rest.put(Routes.applicationGuildCommands(readyClient.user.id, guildId), { body: this.commandData })
            } else {
                await rest.put(Routes.applicationCommands(readyClient.user.id), { body: this.commandData })
            }
    
            this.commandData = null
        })
    }
}
