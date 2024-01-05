const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const moment = require('moment');
moment.locale('pt-br');
require('dotenv').config();
require("moment-duration-format");

module.exports = {
    name: 'resetpontos',
    description: '📜 resetar pontos',
    /// AQUI ESTÁ A PERMISSÃO PARA APAGAR OS DADOS
    permissions: PermissionFlagsBits.Administrator,
    options: [
        {
            name: 'user',
            description: '📜 reset a carga horária semanal de um usuário',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: '📜 mencione o usuário que deseja resetar',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                }
            ],
        },
        {
            name: 'geral',
            description: '📜 reset carga horária de todos',
            type: ApplicationCommandOptionType.Subcommand,
        }
        ],

    async execute({ client, interaction }) {

        switch (interaction.options.getSubcommand()) {
            case 'user': {
                const db = new QuickDB();

                /// PUXAR INFORMAÇÃO
                const userReset = interaction.options.getUser('user');
                const User = interaction.user;

                /// TABELA BANCO DE DADOS
                const tableHours = db.table('totalHours');
                const userId = db.table('userId');
                const getTotal = await tableHours.get(`Total_${userReset.id}`);

                let erro = new EmbedBuilder()
                .setColor('Purple')
                .setDescription(`<a:clock:1034564169250381875> Hmm... não encontrei **NENHUMA** carga horária de ${userReset}\n<:info:1039442872375717948> a carga **HORÁRIA** pode ter sido **APAGADA** ou não foi **INICIADA**`)
                .setFooter({ text: "🍋 Sistema Fresh&Fit" });

                if (getTotal === null || getTotal === 0) {
                    return interaction.reply({ embeds: [erro], ephemeral: true });
                  }  else {

                /// PUXANDO HORAS SEMANAIS E CONVERTENDO EM TEMPO
                const fetchHour = await tableHours.get(`Total_${userReset.id}`);
                let allTime = moment.duration(fetchHour).format("H[h], m[m], s[s] ");

                let embed = new EmbedBuilder()
                .setColor('Purple')
                .setDescription(`<a:clock:1034564169250381875> Hmm... ${User} **DESEJA** realmente apagar todos os **DADOS** de **HORAS** semanais de ${userReset} ??\n<:info:1039442872375717948> **ESSA AÇÃO NÃO PODE SER REVERTIDA**\n**HORAS TOTAIS de ${userReset}** <a:setabranca:1034923232400248974> \`${allTime}\``)
                .setFooter({ text: "🍋 Sistema Fresh&Fit" });
        
                // CRIANDO BOTÕES
                let reset =  new ButtonBuilder()
                .setCustomId('reset')
                .setEmoji('✔️')
                .setLabel('Resetar')
                .setStyle('Secondary');
                                    
                const button = new ActionRowBuilder().addComponents(reset);
         
                await interaction.reply({ embeds: [embed], components: [button], ephemeral: true }).then((msg) => {
        
                let collector = msg.createMessageComponentCollector({ time: 300000 });
        
                collector.on("collect", async (button) => {
        
                if (button.customId === "reset") {

                await tableHours.delete(`Total_${userReset.id}`);
                await userId.set(`userId_${userReset.id}.status`, "Fora");

                let embed = new EmbedBuilder()
                .setColor('Purple')
                .setDescription(`<a:clock:1034564169250381875> Okok... ${User} acabei de **RESETAR** a carga horária de ${userReset}\n<:info:1039442872375717948> **TODA** a carga horária foi zerada, **PEÇA** que o usuário **inicie** uma nova usando \`/ponto\``)
                .setFooter({ text: "🍋 Sistema Fresh&Fit" });

                let resetDm = new EmbedBuilder()
                .setColor('Purple')
                .setDescription(`<a:clock:1034564169250381875> Olá ${userReset} parece que **SUA** carga **HORÁRIA** semanal foi **RESETADA**\n<:info:1039442872375717948> não se **PREOCUPE** você pode **INICIAR** outra usando \`/ponto\``)
                .setFooter({ text: "🍋 Sistema Fresh&Fit" });

                let channelInfo = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`<a:clock:1034564169250381875> ${User} acabou de **RESETAR** a carga **HORÁRIA** de ${userReset}\n<:info:1039442872375717948> **ESSA AÇÃO NÃO PODE SER REVERTIDA**`)
                .setFooter({ text: "🍋 Sistema Fresh&Fit" });

                client.users.cache.get(`${userReset.id}`).send({ embeds: [resetDm] });
                /// LOGS PARA O CANAL ABAIXO, CRIEI PARA TODO VEZ QUE ALGUEM RESETAR ENVIAR UMA LOG NO CHAT DE QUEM RESETOU
                client.channels.cache.get('DIGITE O ID DO CANAL DE LOGS AQUI').send({ content: '@everyone', embeds: [channelInfo] });
                await interaction.editReply({ embeds: [embed], components: [], ephemeral: true })
        
                  }
                });
            
                /// 24 HORAS PARA FINALIZAR A COLLECT
                collector.on('end', async collect => {
                    if (collect.size === 0) {
        
                    let embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`<a:clock:1034564169250381875> Hmm... ação **CANCELADA** por falta de **INTERAÇÃO**`)
                    .setFooter({ text: "🍋 Sistema Fresh&Fit" });
        
                    interaction.editReply({ content: `${User}`, embeds: [embed], components: [] });
        
                    }
                });
            });
               break;
             }
            }
            case 'geral': {

                const db = new QuickDB();

                /// PUXAR INFORMAÇÃO
                const User = interaction.user;

                /// TABELA BANCO DE DADOS
                const tableHours = db.table('totalHours');
                const userId = db.table('userId');

                let geral = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`<a:clock:1034564169250381875> **⚠️ ATENÇÃO ⚠️**\n<:info:1039442872375717948> **ESSE COMANDO RESETA TODA A CARGA HORÁRIA DE TODOS OS USUÁRIOS E A AÇÃO NÃO PODE SER REVERTIDA... DESEJA REALMENTE CONTINUAR ??**`)
                .setFooter({ text: "🍋 Sistema Fresh&Fit" });

                // CRIANDO BOTÕES
                let resetAll =  new ButtonBuilder()
                .setCustomId('resetAll')
                .setEmoji('✔️')
                .setLabel('Resetar')
                .setStyle('Secondary');
                                                    
                const button = new ActionRowBuilder().addComponents(resetAll);
                         
                await interaction.reply({ embeds: [geral], components: [button], ephemeral: true }).then((msg) => {
                let collector = msg.createMessageComponentCollector({ time: 300000 });
        
                    collector.on("collect", async (button) => {
            
                    if (button.customId === "resetAll") {
    
                    await userId.deleteAll();
                    await tableHours.deleteAll();
    
                    let embed = new EmbedBuilder()
                    .setColor('Purple')
                    .setDescription(`<a:clock:1034564169250381875> Okok... ${User} **ACABEI DE RESETAR TODA A CARGA HORÁRIA DE TODOS OS USUÁRIOS DO SERVIDOR**\n<:info:1039442872375717948> **ESSA AÇÃO É IRREVERSÍVEL... TODOS OS DADOS FORAM PERDIDOS**`)
                    .setFooter({ text: "🍋 Sistema Fresh&Fit" });
    
                    let channelWarn = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`<a:clock:1034564169250381875> **TODO A CARGA HORÁRIA SEMANAL DE TODOS OS USUÁRIOS FORAM RESETADAS**\n<:info:1039442872375717948> inicie **UMA** nova **CARGA SEMANAL** usando \`/ponto\``)
                    .setFooter({ text: "🍋 Sistema Fresh&Fit" });

                    let channelStaff = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`<a:clock:1034564169250381875> ${User} **ACABOU DE RESETAR TODA CARGA SEMANA DE TODOS OS USUÁRIOS**\n<:info:1039442872375717948> **ESSA AÇÃO É IRREVERSÍVEL... TODOS OS DADOS FORAM PERDIDOS**`)
                    .setFooter({ text: "🍋 Sistema Fresh&Fit" });

                     /// LOGS PARA O CANAL ABAIXO, CRIEI PARA TODO VEZ QUE ALGUEM RESETAR ENVIAR UMA LOG NO CHAT DE QUEM RESETOU
                    /// CHAT STAFF
                    client.channels.cache.get('DIGITE O ID DO CANAL DE LOGS AQUI').send({ content: '@everyone', embeds: [channelStaff] });
                    /// CHAT AVISOS
                    client.channels.cache.get('DIGITE O ID DO CANAL DE LOGS AQUI').send({ content: '@everyone', embeds: [channelWarn] });
                    /// CHAT PONTO
                    client.channels.cache.get('DIGITE O ID DO CANAL DE LOGS AQUI').send({ content: '@everyone', embeds: [channelWarn] });
                    await interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
            
                      }
                    });
                
                    /// 24 HORAS PARA FINALIZAR A COLLECT
                    collector.on('end', async collect => {
                        if (collect.size === 0) {
            
                        let embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<a:clock:1034564169250381875> Hmm... ação **CANCELADA** por falta de **INTERAÇÃO**`)
                        .setFooter({ text: "🍋 Sistema Fresh&Fit" });
            
                        interaction.editReply({ content: `${User}`, embeds: [embed], components: [] });
            
                        }
                    });
                    
                });
                break;
            }
        
  /// FINAL DO CÓDIGO
  }
 }
}