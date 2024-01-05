const { Collection } = require("discord.js");
const { readdirSync } = require("fs");

/// CARREGANDO EVENTOS E COMANDOS DO BOT
client.commands = new Collection()
commandList = []

module.exports = async (client) => {
  const SlashCommands = []

  const events = readdirSync('./events/').filter(file => file.endsWith('.js'));

console.log(`Carregando eventos...`);

for (const file of events) {
    const event = require(`../events/${file}`);
    console.log(`-> Evento carregado ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`../events/${file}`)];
};

console.log(`Carregando comandos...`);
readdirSync('./commands/').forEach(dirs => {
  const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));
  for (const file of commands) {
      const command = require(`../commands/${dirs}/${file}`);
      if (command.name && command.description) {
        SlashCommands.push(command);
        console.log(`-> Comando carregado ${command.name.toLowerCase()}`);
        client.commands.set(command.name.toLowerCase(), command);
        delete require.cache[require.resolve(`../commands/${dirs}/${file}`)];
      } else console.log(`[Comando Com Erro]  ${command.name.toLowerCase()}`)
    }
  });
  
client.on("ready", () => {
    console.log(client.user.username + ' Aplicação online') //...
    console.log("Comandos Slash Carregados com Sucesso!!")
    client.application.commands.set(SlashCommands)
  });

}