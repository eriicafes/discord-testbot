import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { Command } from "@/tools/command";
import { injectable } from "tsyringe";

@injectable()
export default class GreetCommand implements Command {
    public data = new SlashCommandBuilder()
        .setName("greet")
        .setDescription("reply with a greeting")
        .addStringOption(
            new SlashCommandStringOption()
                .setName("time")
                .setDescription("what time of the day is it?")
                .addChoices(
                    { name: "Morning", value: "morning" },
                    { name: "Afternoon", value: "afternoon" },
                    { name: "Evening", value: "evening" },
                )
        )

    public run(interaction: ChatInputCommandInteraction) {
        console.log(interaction)

        const time = interaction.options.get("time")?.value ?? "day"

        interaction.reply(`Good ${time} <@${interaction.user.id}>`)
    }
}
