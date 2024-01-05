const { QuickDB } = require('quick.db');
const { EmbedBuilder } = require('discord.js');
require('dotenv').config();


module.exports = async (client) => {

/// CRIAR TABELAS 
client.on("ready", async () => {

    const db = new QuickDB();

    const tableHours = db.table('totalHours');
    const userId = db.table('userId');
    const tableStart = db.table('userStart');
    await userId.deleteAll();

    tableHours
    userId
    tableStart

    console.log(`[CONECTADO] Conectado a Table de Horas, [CONECTADO] Conectado a Tabela de ID, [CONECTADO] Conectado a Tabela de Start`);

});

/// INICIANDO SISTEMA CHAT AVISOS
client.on("ready", () => {
  
    let Ok = new EmbedBuilder()
    .setColor('Yellow')
    .setDescription(`<a:clock:1034564169250381875> Iniciando!!\n<:info:1039442872375717948> **SISTEMA SENDO INICIADO, ESTOU ESTABILIZANDO**\n**<a:carregando1:982534898650869790> Ping do sistema\`${client.ws.ping} ms\`.**`)
    .setFooter({ text: "🍋 Sistema Fresh&Fit" });
  
    client.channels.cache.get('985006850011443200').send({ content: '@everyone', embeds: [Ok] });
  
});

/// SISTEMA INICIADO CHAT PONTOS
client.on("ready", () => {

    let start = new EmbedBuilder()
    .setColor('Purple')
    .setDescription(`<a:clock:1034564169250381875> Meu sistema foi **INICIADO** com sucesso!!\n<:info:1039442872375717948> **PARA INICIAR O PONTO BASTA DAR\`/ponto\`**`)
    .setFooter({ text: "🍋 Sistema Fresh&Fit" });
  
    client.channels.cache.get('985006850011443200').send({ content: '@everyone', embeds: [start] });
  
});


}