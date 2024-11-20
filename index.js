require('dotenv').config({ path: '/root/LeninUI/.env' });
const { OpenAI } = require("openai")
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');

const commandFiles = fs.readdirSync('/root/LeninUI/commands').filter(file => file.endsWith('.js'));

const client = new Client({
        intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.MESSAGE_CONTENT
        ]
});

const openai = new OpenAI({
        organization: process.env.openAI_ORG,
        apiKey: process.env.OPEN_API_KEY,
});

client.commands = new Collection();

for (const file of commandFiles) {
        const command = require(`/root/LeninUI/commands/${file}`);
        client.commands.set(command.data.name, command);
}

const triggerWords = ['lenin', 'stalin', 'revoluce', 'vůdce', 'režim'];
const messageHistory = [];
const moods = [
        {
                name: "DefaultMood",
                rarity: 2,
                content: "Mluvíš jako vůdce revoluce, věříš v sílu lidu a společný boj za spravedlnost. Tvoje řeč je autoritativní, ale přístupná.",
        },
        {
                name: "InspirationalSpeechMood",
                rarity: 0.15,
                content: "Jsi řečník, který dokáže zapálit plamen revoluce v srdcích lidí. Tvé projevy jsou plné nadšení, vášnivých výzev k akci a boje za spravedlivou společnost.",
        },
        {
                name: "StrategicPlannerMood",
                rarity: 0.15,
                content: "Přemýšlíš strategicky, plánuješ revoluční kroky a každý tah pečlivě promýšlíš. Sdílíš rady a taktické pokyny, které vedou k úspěchu.",
        },
        {
                name: "HistoricalContextMood",
                rarity: 0.1,
                content: "Odkazuješ na historické události, které se odehrály během tvého vedení. Připomínáš hrdinství revolučního hnutí a důležitost udržování dědictví pracujícího lidu.",
        },
        {
                name: "PhilosophicalMood",
                rarity: 0.1,
                content: "Projevuješ hluboké myšlenky o podstatě společnosti, třídním boji a budoucnosti světa. Mluvíš o Marxovi a dialektickém materialismu.",
        },
        {
                name: "DownToEarthMood",
                rarity: 0.25,
                content: "Jsi přímý a hovoříš k lidu bez formalit, zaměřuješ se na aktuální problémy a nabídneš řešení, které se zdá být dostupné všem.",
        },
        {
                name: "CriticalMood",
                rarity: 0.1,
                content: "Ostře kritizuješ kapitalistické struktury a elity, které podle tebe zneužívají dělnickou třídu. Tvé reakce jsou přímé, kritické a často nabádají k radikálním krokům.",
        }
];

function selectMood(messageContent) {
        if (messageContent.toLowerCase().includes("revoluce") || messageContent.toLowerCase().includes("lid") || messageContent.toLowerCase().includes("boj")) {
                return moods.find(mood => mood.name === "InspirationalSpeechMood").content;
        }
        if (messageContent.toLowerCase().includes("strategie") || messageContent.toLowerCase().includes("plán")) {
                return moods.find(mood => mood.name === "StrategicPlannerMood").content;
        }
        if (messageContent.toLowerCase().includes("historie") || messageContent.toLowerCase().includes("dědictví")) {
                return moods.find(mood => mood.name === "HistoricalContextMood").content;
        }
        if (messageContent.toLowerCase().includes("filozofie") || messageContent.toLowerCase().includes("myšlenky")) {
                return moods.find(mood => mood.name === "PhilosophicalMood").content;
        }
        if (messageContent.toLowerCase().includes("kapitalismus") || messageContent.toLowerCase().includes("elita")) {
                return moods.find(mood => mood.name === "CriticalMood").content;
        }

        const nonDefaultMoods = moods.filter(mood => mood.name !== "DefaultMood");
        const randomIndex = Math.floor(Math.random() * nonDefaultMoods.length);
        return nonDefaultMoods[randomIndex].content;
}

function constructReply(messageContent) {
        const moodContent = selectMood(messageContent);
        const generalContent = "Jsi Lenin, vůdce revolučního hnutí, který věří v sílu pracujícího lidu. Tvůj projev je inspirován ideály revoluce, boje za svobodu a rovnost. Nepoužíváš moderní výrazy a tvá řeč je plná energie a odhodlání. Nenecháš si rozkazovat.";
        const replyContent = `${generalContent} Navíc, ${moodContent}`;
        return replyContent;
}

client.on('messageCreate', async message => {
        var date = new Date();

	client.user.setActivity('Revoluce II.', { type: 'PLAYING' });
        console.log(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}|${message.guild.name}|${message.channel.name}|${message.author.username}: ${message.content}`);

        if (!message.content.trim() || message.author.id == '1304203040470990878') return;

	// Ukládání posledních 10 zpráv do historie
	messageHistory.push({ author: message.author.username, content: message.content });
	if (messageHistory.length > 5) {
		messageHistory.shift(); // Odebrání nejstarší zprávy, aby se udržela délka na 10
	}

        if (message.channel.id == '1223380151203659856' && message.author.id == '1110915541469773866') {
                setTimeout(async () => {
                        await sendReply(message);
                }, 30000);
                return;
        }

        for (const word of triggerWords) {
                if (message.content.toLowerCase().includes(word) || message.content.includes('@1158467740672208969')) {
                        await sendReply(message);
                        break;
                }
        }
});

async function sendReply(message) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Jsi Lenin, vůdce revoluce. Reaguj stručně a v kontextu zprávy, používej jasný a výstižný jazyk, který reflektuje tvoje ideály a styl projevu.`,
                },
                {
                    role: "user",
                    content: message.content,
                },
            ],
            max_tokens: 500, // Ponecháme původní limit pro flexibilitu
        });

		const answer = response.choices[0].message.content;
		await message.channel.send(answer);
	} catch (error) {
		console.error("Něco se pokazilo při komunikaci s OpenAI API", error);
		await message.channel.send("Omlouváme se, ale nemohu teď odpovědět.");
	}
}
client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
                await command.run(interaction, client);
        } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Při spouštění tohoto příkazu došlo k chybě.', ephemeral: true });
        }
});

client.once('ready', () => {
        console.log('Lenin is ready!');
        client.startTime = new Date();
});

client.login(process.env.DISCORD_BOT_TOKEN);
