const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ukáže ping bota'),
    async run(interaction) {
        // Vytvoření embed zprávy
        const embed = new MessageEmbed()
            .setColor('#0099ff') // Nastavení barvy
            .setTitle('Pong!')
          //.setDescription('Toto je odpověď')
            .setTimestamp() // Přidá aktuální čas jako timestamp
          //.setFooter('Lenin Bot', 'URL/odkaz na obrázek s ikonou'); // Volitelné logo nebo text v zápatí

        // Odeslání embed zprávy jako odpovědi
        await interaction.reply({ embeds: [embed] });
    },
};
