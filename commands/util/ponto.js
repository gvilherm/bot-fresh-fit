const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const moment = require('moment');
moment.locale('pt-br');
require('dotenv').config();
require("moment-duration-format");

module.exports = {
    name: 'ponto',
    description: "🍋  bata seu ponto/registro no sistema da Fresh&Fit",
    type: ApplicationCommandType.ChatInput,

    async execute({ client, interaction }) {

        const db = new QuickDB();  

        /// TABELAS BANCO DE DADOS
        const tableStart = db.table('userStart');
        const tableUserId = db.table('userId');
        const tableHours = db.table('totalHours');

        /// PUXAR INFORMAÇÃO
        const User = interaction.user;

        /// EMBED ERRO
        let erro = new EmbedBuilder()
        .setColor('Red')
        .setDescription('<a:clock:1034564169250381875> Hmm... parece que você ja está em **SERVIÇO**\n**FINALIZE** o ponto atual para iniciar **OUTRO**')
        .setFooter({ text: "🍋 Sistema Fresh&Fit" });

        /// EMBED ERRO
        let erro2 = new EmbedBuilder()
        .setColor('Purple')
        .setDescription('<a:clock:1034564169250381875> Hmmm... acabei de criar sua ficha de **CARGA HORÁRIA SEMANAL**\nExecute o comando novamente para dar inicio ao trabalho!! \`/ponto\`')
        .setFooter({ text: "🍋 Sistema Fresh&Fit"});

        /// PARA PUXAR INFORMAÇÕES
        const getTotals = await tableHours.get(`Total_${User.id}`);

        ///FILTRO SE ESTIVER EM SERVIÇO
        const statusOne = 'service';
        const statusTwo = await tableUserId.get(`userId_${User.id}.status`);

        if (getTotals === null) {
            tableHours.set(`Total_${User.id}`, 0);
            return interaction.reply({ embeds: [erro2], ephemeral: true });
        } else {     
            if (statusOne === statusTwo) {
                return interaction.reply({ embeds: [erro], ephemeral: true });
            } else {   

        /// SET SERVICE
        await tableUserId.set(`userId_${User.id}`, { id: `${User.id}`, status: 'service' });

        /// PUXAR DADOS DO BANCO DE DADOS
        const userId = await tableUserId.get(`userId_${User.id}.id`);

        /// EMBED PRINCIPAL
        const embed = new EmbedBuilder()
        .setColor("2F3136")
        .setAuthor({ name: `🍋 FRESH`, iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true })})
        .setTitle(`<a:Estrela:982910613351178250> PONTO INICIADO`)
        .setDescription(`<a:timer:1039442200506925106> Olá ${User}, seu **PONTO** foi iniciado com **SUCESSO** e está em andamento...\n<:info:1039442872375717948> Todos os pontos precisam ser **FINALIZADOS** dentro de **8h** ou será cancelado`)
        .addFields(
            { name: "<:id:986415429801099345> Nome & ID", value: `> ${User}\n> \`${User.id}\``, inline: true },
            { name: "<:calendary:1039486871979442196> Data do Ponto", value: `> \`${moment(interaction.createdTimestamp).format("DD/MM/YYYY")}\``, inline: true },
            { name: "Entrada 📥", value: `> \`${moment(new Date()).format("HH:mm:ss")}\``, inline: true },
            { name: "Saída 📤", value: `<a:carregando1:982534898650869790> Em Serviço`, inline: true },
            { name: "<a:clock:1034564169250381875> Total", value: `<a:carregando2:982534862512750642> Calculando`, inline: true }
          );
        
        /// EMBED ERRO
        let inicio = new EmbedBuilder()
        .setColor('Purple')
        .setDescription('<a:clock:1034564169250381875> seu ponto foi **INICIADO** com **SUCESSO** \n<:info:1039442872375717948> o ponto é **VÁLIDO** por **8** horas... **FINALIZE** quando terminar o **EXPEDIENTE** para não perder sua carga horária!!')
        .setFooter({ text: "🍋 Sistema Fresh&Fit"});

        /// CRIANDO BOTÕES
        let finalizar =  new ButtonBuilder()
        .setCustomId('finalizar')
        .setEmoji('🕗')
        .setLabel('Finalizar')
        .setStyle('Secondary');
                    
        const button = new ActionRowBuilder().addComponents(finalizar);

        interaction.reply({ embeds: [inicio], ephemeral: true });
        /// SET BANCO DE DADOS
        await tableStart.set(`userStart_${User.id}`, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));

        await interaction.channel.send({  content: `${User}`, embeds: [embed], components: [button] }).then((msg) => {

        /// FILTRO + CRIADOR DE COLLECT
        let filtro = i =>  i.user.id === userId;
        /// MUDE O TIME PARA AUMENTAR OU DIMINUIR O TEMPO PARA O PONTO SER FINALIZADO AUTOMATICAMENTE SE ALGUEM NÃO FINALIZAR
        let collector = msg.createMessageComponentCollector({ filter: filtro, time: 28800000 });

        /// EXECUÇÃO DA COLLECT
        collector.on("collect", async (button) => {

                if (button.customId === "finalizar") {

                 /// EMBED ERRO
                 let calculando = new EmbedBuilder()
                .setColor('Purple')
                .setDescription('<a:clock:1034564169250381875> Estou **CALCULADO** o hórario expedido \n<:info:1039442872375717948> seu **HORÁRIO** vai ser adicionado a sua carga **HORÁRIA**')
                .setFooter({ text: "🍋 Sistema Fresh&Fit"});

                msg.edit({ embeds: [calculando], components: [] });

                /// PUXAR BANCO DE DADOS + SET
                const getStart = await tableStart.get(`userStart_${User.id}`);
                const getHour = await tableHours.get(`Total_${User.id}`);
                const youTotal = await tableStart.get(`All_${User.id}`);
                await tableUserId.set(`userId_${User.id}.status`, 'Fora');
        
                /// MOMENT SOMANDO DIFERENÇA ENTRE HORAS
                let date_start = moment(new Date(`${getStart}`));
                let date_end = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                const start = moment(date_start);
                const end = moment(date_end);
                const duration = moment.duration(end.diff(start));
                const time = moment.utc(duration.asMilliseconds()).format("H[h], m[m], s[s] ");
                const getHours = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");

                /// SOMAR HORAS SEMANAIS
                const ms = moment.duration(getHours).asMilliseconds();
                let total = moment.duration(getHour).add(ms);

                /// SOMAR HORAS TOTAL
                const ms1 = moment.duration(getHours).asMilliseconds();
                let total1 = moment.duration(youTotal).add(ms1);

                /// SET HORAS TOTAIS
                await tableHours.set(`Total_${User.id}`, total);
                await tableStart.set(`All_${User.id}`, total1);
                await tableStart.set(`Last_${User.id}`, getHours);

                /// PEGAR HORAS TOTAIS
                const fetchHour = await tableHours.get(`Total_${User.id}`);
                let allTime = moment.duration(fetchHour).format("H[h], m[m], s[s] ");
        
                /// EMBED FINALIZAÇÃO
                const embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: `🍋 FRESH`, iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true })})
                .setTitle(`<a:Estrela:982910613351178250> PONTO FINALIZADO`)
                .setDescription(`<a:timer:1039442200506925106> Olá ${User}, seu **PONTO** foi finalizado com **SUCESSO**.\n<:info:1039442872375717948> o sistema **GRAVOU** suas **INFORMAÇÕES** no banco de dados com **SUCESSO**`)
                .addFields(
                    { name: "<:id:986415429801099345> Nome & ID", value: `> ${User}\n> \`${User.id}\``, inline: true },
                    { name: "<:calendary:1039486871979442196> Data do Ponto", value: `> \`${moment(interaction.createdTimestamp).format("DD/MM/YYYY")}\``, inline: true },
                    { name: "Entrada 📥", value: `> \`${moment(new Date(`${getStart}`)).format("HH:mm:ss")}\``, inline: true },
                    { name: "Saída 📤", value: `> \`${moment(new Date()).format("HH:mm:ss")}\``, inline: true },
                    { name: "<a:clock:1034564169250381875> Total", value: `> Você trabalhou \`${time}\`\n> Carga horária semanal \`${allTime}\``, inline: true }
                  );

                client.users.cache.get(`${User.id}`).send({ embeds: [embed] });
                msg.edit({ content: `<a:verificado:982535389719953450> Finalizado`, embeds: [embed], components: [] });
                }
            });

            /// 8 HORAS PARA FINALIZAR A COLLECT
            collector.on('end', async collect => {
                if (collect.size === 0) {

                const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: '🍋 FRESH', iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true })})
                .setTitle(`<a:Estrela:982910613351178250> PONTO CANCELADO`)
                .setDescription(`<a:timer:1039442200506925106> Olá ${User}, seu **PONTO** foi cancelado\n<:info:1039442872375717948> você excedeu o tempo limite de **8H** e o ponto foi **CANCELADO**`);

                msg.edit({ content: `${User}`, embeds: [embed], components: [] });
                await tableUserId.set(`userId_${User.id}.status`, 'Fora');

                }
            });
        });

   /// FINAL DO CÓDIGO
      }
    }
  }
}