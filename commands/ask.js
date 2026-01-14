const { SlashCommandBuilder } = require("discord.js");
const askGroq = require("../ai/groqAsk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Tanya ke AI")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Pertanyaan kamu")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const question = interaction.options.getString("question");
      const answer = await askGroq(question);

      await interaction.editReply(
        answer.length > 2000
          ? answer.slice(0, 1990) + "...\n(Dipotong)"
          : answer
      );
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Error AI");
    }
  }
};
