const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Zobrazí informace o serveru.'),
    async run(interaction) {
        const { guild } = interaction;
        const serverInfo = `
Název serveru: ${guild.name}
ID: ${guild.id}
Vlastník: <@${guild.ownerId}>
Region: ${guild.preferredLocale}
Počet členů: ${guild.memberCount}
Datum vytvoření: ${guild.createdAt.toDateString()}
        `;

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Informace o serveru')
            .setDescription(serverInfo)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
