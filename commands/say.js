const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Nechá bota zopakovat zadaný text.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Text, který bot zopakuje.')
                .setRequired(true)),
    async run(interaction) {
        const message = interaction.options.getString('message');
        await interaction.reply(message);
    },
};
