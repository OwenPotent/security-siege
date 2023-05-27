import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager } from "discord.js";
import BotClient from "../../structures/Client";
import { botDeveloperID } from "../../config.json";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server")
        .addUserOption(option => option
            .setName("user")
            .setDescription("User to kick")
            .setRequired(true))
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for kicking the user")
            .setRequired(false)),
    async execute(interaction: CommandInteraction): Promise<void> {
        const user = interaction.options.getMember("user") as GuildMember;
        const reason = interaction.options.get("reason")?.value as string | undefined;

        if (user.id === interaction.user.id) {
            await interaction.reply({
                content: "You can't kick yourself!",
                ephemeral: true
            });

            return;
        }

        if (user.id === interaction.client.user?.id) {
            await interaction.reply({
                content: "You can't kick me!",
                ephemeral: true
            });

            return;
        }

        if (botDeveloperID.includes(user.id)) {
            await interaction.reply({
                content: "You can't kick my developer!",
                ephemeral: true
            });

            return;
        }

        if (user.roles.highest.position >= (interaction.member.roles as GuildMemberRoleManager).highest.position) {
            await interaction.reply({
                content: "I can't kick that user!",
                ephemeral: true
            });

            return;
        }

        if (!user.kickable) {
            await interaction.reply({
                content: "I can't kick that user!",
                ephemeral: true
            });

            return;
        }

        await user.kick(reason);

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({
                name: `${user.user.tag} (${user.id})`,
                iconURL: user.user.displayAvatarURL({ forceStatic: false })
            })
            .setDescription(`**Action:** Kick\n**Reason:** ${reason ?? "No reason provided"}`)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;