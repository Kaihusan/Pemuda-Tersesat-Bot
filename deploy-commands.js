const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  {
    name: 'ping',
    description: 'Balas pong!'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('⏳ Deploying slash commands...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Slash commands deployed!');
  } catch (error) {
    console.error(error);
  }
})();
