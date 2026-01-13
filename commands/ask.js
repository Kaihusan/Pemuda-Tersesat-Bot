const { SlashCommandBuilder } = require("discord.js");
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify(data)
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Tanya AI")
    .addStringOption(option =>
      option
        .setName("prompt")
        .setDescription("Apa yang ingin kamu tanyakan?")
        .setRequired(true)
    ),

  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");

    await interaction.deferReply(); // biar gak timeout

    // === CONTOH AI (DUMMY) ===
    // Nanti ini kita ganti ke OpenAI
    const aiReply = `Kamu bertanya: "${prompt}"\n\n(Jawaban AI di sini)`;

    await interaction.editReply(aiReply);
  }
};
