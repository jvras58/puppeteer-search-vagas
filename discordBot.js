const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`logado como ${client.user.tag}!`);
});

async function sendDiscordMessage(channelId, message) {
    const channel = await client.channels.fetch(channelId);
    if (channel) {
        await channel.send(message);
    }
}

client.login(process.env.DISCORD_TOKEN);

module.exports = sendDiscordMessage;
