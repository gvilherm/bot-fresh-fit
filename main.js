require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');

/// INTENTS DO BOT  + CLIENT
global.client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent
    ],
});

client.commands = new Collection();
client.login(process.env.TOKEN); 
module.exports = client

/// MUDANDO STATUS DO BOT
client.on("ready", () => {

    const activities = [
      { name: `🍋 Fresh&Fit`, type: 2 }, 
      { name: `💛 Seu auxiliar`, type: 2 },
    ];
    
    let i = 0;
    setInterval(() => {
      if(i >= activities.length) i = 0
      client.user.setActivity(activities[i])
      i++;
    }, 15 * 1000);

});

/// PUXANDO HANDLER
require("./handler/index.js")(client);
require("./handler/bot.js")(client);
require("./handler/antiCrash.js")(client);