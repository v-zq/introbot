const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});
const token = 'X'; // 
const botResponse = `## Introduce yourself in a few words:
- **Name/Nickname:**
- **Where are you from:**
- **Interests:**
- **Fun Fact:**`;
const targetChannelId = '1180340828409954344'; // The specific channel ID
const messageIdFile = 'lastMessageId.txt';
let delayTimer;

client.on('ready', () => {
    sendBotMessage();
});

client.on('messageCreate', message => {
    if (message.channel.id !== targetChannelId || message.author.bot) return;

    message.react('👋');

    clearTimeout(delayTimer);
    delayTimer = setTimeout(sendBotMessage, 500); // 
});

async function sendBotMessage() {
    if (fs.existsSync(messageIdFile)) {
        try {
            const lastMessageId = fs.readFileSync(messageIdFile, 'utf8');
            const channel = await client.channels.fetch(targetChannelId);
            const lastMessage = await channel.messages.fetch(lastMessageId).catch(() => null);
            if (lastMessage) await lastMessage.delete();
        } catch (error) {
        }
    }

    try {
        const channel = await client.channels.fetch(targetChannelId);
        const sentMessage = await channel.send(botResponse);
        fs.writeFileSync(messageIdFile, sentMessage.id);
    } catch (error) {
    }
}

client.login(token).catch(error => {
});
