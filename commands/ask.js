const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Tanya ke AI Gemini")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Pertanyaan kamu")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const question = interaction.options.getString("question");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: question }]
              }
            ]
          })
        }
      );

      const data = await response.json();

      console.log("Gemini response:", JSON.stringify(data, null, 2));

      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ AI tidak memberi jawaban.";

      await interaction.editReply(reply);

    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Gagal menghubungi AI Gemini");
    }
  }
};
