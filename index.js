require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

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
client.once("ready", () => {
  console.log(`✅ Bot login sebagai ${client.user.tag}`);
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "Terjadi error", ephemeral: true });
  }
});

// Login pakai token dari .env
client.login(process.env.DISCORD_TOKEN);
