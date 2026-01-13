const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Tanya ke AI Gemini")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Apa yang ingin kamu tanyakan?")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const question = interaction.options.getString("question");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: question }]
              }
            ]
          })
        }
      );

      const data = await response.json();

      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI tidak menjawab 😢";

      await interaction.editReply(reply);

    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ Terjadi error saat menghubungi AI");
    }
  }
};
