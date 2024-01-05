const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require('quick.db');
const moment = require('moment');
const wait = require('node:timers/promises').setTimeout;
moment.locale('pt-br');
require('dotenv').config();
require("moment-duration-format");

module.exports = {
    name: 'info',
    description: '📝 veja suas informações',
    options: [
        {
            name: 'user',
            description: '🕗 veja o perfil de algum usuário',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: '🕗 mencione o usuário que deseja ver o perfil',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                }
            ],
        },
        {
            name: 'meuperfil',
            description: '🕗 veja seu perfil de pontos',
            type: ApplicationCommandOptionType.Subcommand,
        }
        ],

    async execute({ client, interaction }) {

        switch (interaction.options.getSubcommand()) {
            case 'user': {

                const erro = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`<a:erro:964790683980410881> | Você não possui as permissões necessárias para executar este comando!!`);

                /// AQUI ESTÁ A PERMISSÃO PARA ACESSAR PERFIL DE USUARIOS
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                    return interaction.reply({ embeds: [erro], ephemeral: true });
                 }  else {

                const db = new QuickDB();

                /// PUXAR INFORMAÇÃO
                const userInfo = interaction.options.getUser('user');
                const User = interaction.user;
                const entrou = interaction.guild.members.cache.get(userInfo.id);

                /// TABELA BANCO DE DADOS
                const tableHours = db.table('totalHours');
                const userId = db.table('userId');
                const tableStart = db.table('userStart');

                /// PEGAR INFORMAÇÕES NO BANCO DE DADOS
                let lastPoint = await tableStart.get(`userStart_${userInfo.id}`);
                let statusJob = await userId.get(`userId_${userInfo.id}.status`);
                const Fora = "Fora";
                const service = "service";
                if (statusJob == Fora || statusJob == undefined) statusJob = "<a:tocando:982865694788042753> **Fora de Serviço**";
                if (statusJob == service) statusJob = "<a:carregando1:982534898650869790> **Em Serviço**";


                /// PUXANDO HORAS SEMANAIS E CONVERTENDO EM TEMPO
                const fetchHour = await tableHours.get(`Total_${userInfo.id}`);
                let allTime = moment.duration(fetchHour).format("H[h], m[m], s[s] ");

                /// CARGA HORÁRIA TOTAL
                const fetchHour1 = await tableStart.get(`All_${userInfo.id}`);
                let allTime1 = moment.duration(fetchHour1).format("H[h], m[m], s[s] ");

                /// ÚLTIMA CARGA
                const fetchHour2 = await tableStart.get(`Last_${userInfo.id}`);
                let allTime2 = moment.duration(fetchHour2).format("H[h], m[m], s[s] ");

                const info = new EmbedBuilder()
                .setColor("2F3136")
                .setAuthor({ name: `FRESH 🍋`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
                .setTitle(`<:user:1034565664809156718> INFORMAÇÕES DE USUÁRIO`)
                .setDescription(`<:info:1039442872375717948> **AQUI** está todas as **INFORMAÇÕES** de ${userInfo}`)
                .addFields(
                    { name: "<:id:986415429801099345> Nome & ID", value: `> ${userInfo}\n> \`${userInfo.id}\``, inline: true },
                    { name: "<:calendary:1039486871979442196> Último ponto iniciado", value: `> \`${moment(new Date(`${lastPoint}`)).format("DD/MM/YYYY")}\` Às \`${moment(new Date(`${lastPoint}`)).format("HH:mm:ss")}\`\n> <a:setabranca:1034923232400248974> Duração \`${allTime2}\``, inline: false },
                    { name: "<a:timer:1039442200506925106> Carga Horária Semanal & Total", value: `> <a:setabranca:1034923232400248974> Semanal \`${allTime}\`\n> <a:setabranca:1034923232400248974> Total \`${allTime1}\`\n> Status ${statusJob}`, inline: true },
                    { name: "📌 Informações da conta", value: `> 🔎 Criada em\n> <t:${parseInt(userInfo.createdTimestamp / 1000)}>\n> 🍋 Entrou na Fresh em\n> <t:${Math.ceil(entrou.joinedTimestamp / 1000)}:F>`, inline: false }
                )
                .setFooter({ text: `📜 Informações` });

                await interaction.deferReply({ ephemeral: true });
                await wait(1000);
                await interaction.editReply({ content: `${User}`, embeds: [info] });

            break;
             }
            }

            case 'meuperfil': {

                const db = new QuickDB();

                /// PUXAR INFORMAÇÃO
                const User = interaction.user;
                const entrou = interaction.guild.members.cache.get(User.id);

                /// TABELA BANCO DE DADOS
                const tableHours = db.table('totalHours');
                const userId = db.table('userId');
                const tableStart = db.table('userStart');

                /// PEGAR INFORMAÇÕES NO BANCO DE DADOS
                let lastPoint = await tableStart.get(`userStart_${User.id}`);
                let statusJob = await userId.get(`userId_${User.id}.status`);
                const Fora = "Fora";
                const service = "service";
                if (statusJob == Fora || statusJob == undefined) statusJob = "<a:tocando:982865694788042753> **Fora de Serviço**";
                if (statusJob == service) statusJob = "<a:carregando1:982534898650869790> **Em Serviço**";


                /// PUXANDO HORAS SEMANAIS E CONVERTENDO EM TEMPO
                const fetchHour = await tableHours.get(`Total_${User.id}`);
                let allTime = moment.duration(fetchHour).format("H[h], m[m], s[s] ");

                /// CARGA HORÁRIA TOTAL
                const fetchHour1 = await tableStart.get(`All_${User.id}`);
                let allTime1 = moment.duration(fetchHour1).format("H[h], m[m], s[s] ");

                /// ÚLTIMA CARGA
                const fetchHour2 = await tableStart.get(`Last_${User.id}`);
                let allTime2 = moment.duration(fetchHour2).format("H[h], m[m], s[s] ");

                const info = new EmbedBuilder()
                .setColor("e4ffa2")
                .setAuthor({ name: `FRESH 🍋`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
                .setTitle(`<:user:1034565664809156718> INFORMAÇÕES DE USUÁRIO`)
                .setDescription(`<:info:1039442872375717948> **AQUI** está todas as suas **INFORMAÇÕES**`)
                .addFields(
                    { name: "<:id:986415429801099345> Nome & ID", value: `> ${User}\n> \`${User.id}\``, inline: true },
                    { name: "<:calendary:1039486871979442196> Último ponto iniciado", value: `> \`${moment(new Date(`${lastPoint}`)).format("DD/MM/YYYY")}\` Às \`${moment(new Date(`${lastPoint}`)).format("HH:mm:ss")}\`\n> <a:setabranca:1034923232400248974> Duração \`${allTime2}\``, inline: false },
                    { name: "<a:timer:1039442200506925106> Carga Horária Semanal & Total", value: `> <a:setabranca:1034923232400248974> Semanal \`${allTime}\`\n> <a:setabranca:1034923232400248974> Total \`${allTime1}\`\n> Status ${statusJob}`, inline: true },
                    { name: "📌 Informações da conta", value: `> 🔎 Criada em\n> <t:${parseInt(User.createdTimestamp / 1000)}>\n> 🍋 Entrou na Fresh em\n> <t:${Math.ceil(entrou.joinedTimestamp / 1000)}:F>`, inline: false }
                )
                .setFooter({ text: `📜 Informações` });

                await interaction.deferReply({ ephemeral: true });
                await wait(1000);
                await interaction.editReply({ content: `${User}`, embeds: [info] });

            break;
            }


   /// FINAL DO CÓDIGO
        }
  }
}