const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Zobrazí informace o aktuálním kanálu.'),
    async run(interaction) {
        const channel = interaction.channel;
        const messageCount = (await channel.messages.fetch()).size;

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Informace o kanálu')
            .setDescription(`
Název: ${channel.name}
ID: ${channel.id}
Typ: ${channel.type}
Počet zpráv: ${messageCount}
Popis: ${channel.topic || 'Žádný popis'}
            `)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
