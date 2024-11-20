const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Vymaže určitý počet zpráv.')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Počet zpráv, které chceš smazat.')
                .setRequired(true)),
    async run(interaction) {
        const count = interaction.options.getInteger('count');

        if (count <= 0 || count > 100) {
            return interaction.reply({ content: 'Zadej počet zpráv mezi 1 a 100.', ephemeral: true });
        }

        try {
            await interaction.channel.bulkDelete(count, true);
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Smazání zpráv')
                .setDescription(`Smazáno ${count} zpráv.`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Něco se pokazilo při mazání zpráv.', ephemeral: true });
        }
    },
};
