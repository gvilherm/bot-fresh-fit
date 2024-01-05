const { EmbedBuilder, InteractionType } = require('discord.js');

/// INTERAÇÕES COMO PERMISSÕES PARA O BOT E ERROS
module.exports = async (client, interaction) => {
  if(interaction.isCommand()) { 
    if (interaction.type === InteractionType.ApplicationCommand) {
    try {
      const command = client.commands.get(interaction.commandName);
      if (command.permissions && !interaction.member.permissions.has(command.permissions)) return interaction.reply({ embeds: [ new EmbedBuilder().setColor('Red').setDescription(`<a:erro:964790683980410881> | Você não possui as permissões necessárias para executar este comando!!`)], ephemeral: true, });
      if (!command) return interaction.reply({ embeds: [ new EmbedBuilder().setColor('Red').setDescription('<a:erro:964790683980410881> | Erro!')], ephemeral: true, }), client.slash.delete(interaction.commandName);
      command.execute({ interaction, client });
    } catch(e) { 
      console.log("Error: `" + e.message + "`");
    } 
    } else if(interaction.type === InteractionType.ApplicationCommand) { 
    await interaction.deferUpdate().catch(() => { })
   } 
  }
};