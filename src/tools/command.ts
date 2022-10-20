import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    run(interaction: ChatInputCommandInteraction): Promise<void> | void
}
