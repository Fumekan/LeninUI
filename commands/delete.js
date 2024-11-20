const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Smaže zprávy starší než zadaný počet dní.')
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Počet dní, starší než zprávy, které se mají smazat.')
                .setRequired(true)),
    async run(interaction) {
        await interaction.deferReply({ ephemeral: true }); // Odloží odpověď na delší dobu

        const days = interaction.options.getInteger('days');
        if (days <= 0) {
            return interaction.editReply({ content: 'Zadej platný počet dní.' });
        }

        const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
        const deleteThreshold = days * MILLISECONDS_IN_A_DAY;
        let totalDeleted = 0;
        let lastMessageID;
        let shouldContinue = true;

        try {
            while (shouldContinue) {
                const options = { limit: 100 };
                if (lastMessageID) {
                    options.before = lastMessageID;
                }

                const messages = await interaction.channel.messages.fetch(options);
                if (messages.size === 0) {
                    shouldContinue = false;
                    break;
                }

                lastMessageID = messages.last().id;
                const oldMessages = messages.filter(msg => Date.now() - msg.createdTimestamp > deleteThreshold);

                await Promise.all(oldMessages.map(msg => msg.delete()));
                totalDeleted += oldMessages.size;

                // Pro případ, že by mazání trvalo dlouho, můžete přidat krátké pauzy:
                await new Promise(resolve => setTimeout(resolve, 500)); // Pauza 500 ms
            }

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Výsledek mazání')
                .setDescription(`Smazáno ${totalDeleted} zpráv starších než ${days} dní.`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'Něco se pokazilo při mazání zpráv.' });
        }
    },
};
