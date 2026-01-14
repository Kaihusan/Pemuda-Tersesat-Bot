require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Ready
client.once("ready", () => {
  console.log(`✅ Bot login sebagai ${client.user.tag}`);
});

// Slash command handler
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("❌ Terjadi error");
    } else {
      await interaction.reply({ content: "❌ Terjadi error", ephemeral: true });
    }
  }
});
const askGroq = require("./ai/groqAsk");

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!ask")) return;

  const question = message.content.slice(4).trim();
  if (!question) {
    return message.reply("❓ Contoh: `!ask apa itu AI?`");
  }

  try {
    const reply = await message.reply("🤖 AI sedang berpikir...");

    const answer = await askGroq(question);

    await reply.edit(
      answer.length > 2000
        ? answer.slice(0, 1990) + "...\n(Dipotong)"
        : answer
    );
  } catch (err) {
    console.error(err);
    message.reply("❌ Gagal menjawab");
  }
});
client.login(process.env.DISCORD_TOKEN);
