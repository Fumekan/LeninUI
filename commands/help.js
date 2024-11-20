const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Zobrazí seznam dostupných příkazů.'),
    async run(interaction) {
        const helpMessage = `
**Dostupné příkazy:**
/ping - Vrátí čas odezvy bota.
/say - Nechá bota zopakovat zadaný text.
/server - Zobrazí informace o serveru.
/notify - Pošle ti upozornění v zadaný čas.
/delete - Smaže zprávy starší než zadaný počet dní.
/clear - Vymaže určitý počet zpráv.
/channel - Zobrazí informace o aktuálním kanálu.
/cr - Zobrazí informace o černých rytířích s artefakty.
        `;

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Nápověda')
            .setDescription(helpMessage)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
