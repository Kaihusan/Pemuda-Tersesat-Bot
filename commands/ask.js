const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  name: 'ask',
  description: 'Tanya ke AI',

  async execute(interaction) {
    await interaction.deferReply();

    const question = interaction.options.getString('question');

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: question }
          ]
        })
      }
    );

    const data = await response.json();

    await interaction.editReply(
      data.choices?.[0]?.message?.content || 'AI tidak menjawab 😢'
    );
  }
};