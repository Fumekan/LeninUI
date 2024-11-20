const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('Pošle ti upozornění v zadaný čas.')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Čas ve formátu HH:MM.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('událost')
                .setDescription('Zpráva, kterou ti Lenin připomene.')
                .setRequired(false)),
    async run(interaction) {
        const time = interaction.options.getString('time');
        const reason = interaction.options.getString('událost') || ''; // Výchozí text, pokud není zadán důvod

        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!timeRegex.test(time)) {
            await interaction.reply({ content: 'Neplatný formát času. Použij HH:MM.', ephemeral: true });
            return;
        }

        const [hours, minutes] = time.split(':');
        const now = moment().tz('Europe/Prague');
        let notifyTime = moment().tz('Europe/Prague').set({ hour: hours, minute: minutes, second: 0 });

        if (notifyTime.isBefore(now)) {
            notifyTime.add(1, 'days');
        }

        const timeDifference = notifyTime.diff(now);

        // Nastavení upozornění
        setTimeout(() => {
            interaction.user.send(`Připomenutí: Je ${time}. ${reason}`);
        }, timeDifference);

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Upozornění nastaveno')
            .setDescription(`Upozornění bylo nastaveno na ${time}.\n**Událost:** ${reason}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
