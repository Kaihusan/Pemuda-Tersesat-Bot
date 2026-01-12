require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

// Bot online
client.once("ready", () => {
	console.log(`✅ Bot login sebagai ${client.user.tag}`);
});

// Event pesan
client.on("messageCreate", (message) => {
	if (message.author.bot) return;

	if (message.content === "!ping") {
		message.reply("🏓 Pong!");
	}
});

// Login pakai token dari .env
client.login(process.env.DISCORD_TOKEN);
