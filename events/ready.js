module.exports = async (client) => {

    /// APENAS UM LOG PARA O CONSOLE MOSTRANDO QUE ESTÁ ATIVO NO CLIENT
    const member = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    console.log(`Conectado ao cliente ${client.user.username}\n-> Estou em ${client.guilds.cache.size} servidores para um total de ${member} usuários`);
};