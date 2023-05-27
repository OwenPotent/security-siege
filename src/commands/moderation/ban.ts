import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, GuildMember, GuildMemberRoleManager } from "discord.js";
import BotClient from "../../structures/Client";
import { botDeveloperID } from "../../config.json";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the server")
        .addUserOption(option => option
            .setName("user")
            .setDescription("User to ban")
            .setRequired(true))
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for banning the user")
            .setRequired(false)),
    async execute(interaction: CommandInteraction): Promise<void> {
        const user = interaction.options.getMember("user") as GuildMember;
        const reason = interaction.options.get("reason")?.value as string | undefined;

        if (user.id === interaction.user.id) {
            await interaction.reply({
                content: "You can't ban yourself!",
                ephemeral: true
            });

            return;
        }

        if (user.id === interaction.client.user?.id) {
            await interaction.reply({
                content: "You can't ban me!",
                ephemeral: true
            });

            return;
        }

        if (botDeveloperID.includes(user.id)) {
            await interaction.reply({
                content: "You can't ban my developer!",
                ephemeral: true
            });

            return;
        }

        if (user.roles.highest.position >= (interaction.member.roles as GuildMemberRoleManager).highest.position) {
            await interaction.reply({
                content: "I can't ban that user!",
                ephemeral: true
            });

            return;
        }

        if (!user.bannable) {
            await interaction.reply({
                content: "That user is not bannable!",
                ephemeral: true
            });

            return;
        }

        await interaction.reply({
            content: `Are you sure you want to ban ${user.user.tag}?`,
            components: [
                {
                    type: 1,
                    components: [
                        new ButtonBuilder()
                            .setCustomId("confirm")
                            .setLabel("Confirm")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("cancel")
                            .setLabel("Cancel")
                            .setStyle(ButtonStyle.Danger)
                    ]
                }
            ],
            ephemeral: true
        });

        const collector = interaction.channel?.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 30000
        });

        collector?.on("collect", async i => {
            if (i.customId === "confirm") {
                await i.update({
                    content: `Successfully banned ${user.user.tag}!`,
                    components: []
                });

                await user.send({
                    content: `You have been banned from ${interaction.guild?.name}!`,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Ban")
                            .setColor("Red")
                            .setFooter({
                                text: interaction.user.tag,
                                iconURL: interaction.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .addFields(
                                {
                                    name: "Reason",
                                    value: reason ? reason : "No reason provided"
                                }
                            )
                    ]
                });

                await user.ban({
                    reason: reason
                });

                collector?.stop();
            } else if (i.customId === "cancel") {
                await i.update({
                    content: "Cancelled ban!",
                    components: []
                });

                collector?.stop();
            }
        });
    
        collector?.on("end", async () => {
            await interaction.editReply({
                content: "Ban timed out!",
                components: []
            });
        });
    }
} as Command;