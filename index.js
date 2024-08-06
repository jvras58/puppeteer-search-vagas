const express = require('express');
const cron = require('node-cron');
const searchLinkedIn = require('./search');
const sendDiscordMessage = require('./discordBot');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3005;

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ID do canal do Discord onde as mensagens serão enviadas
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

app.get('/', (req, res) => {
    res.send('O bot de pesquisa do LinkedIn está em execução');
});

app.get('/pesquisar', async (req, res) => {
    console.log('Rodando a pesquisa no LinkedIn');
    try {
        const results = await searchLinkedIn({
            // TODO: EU PRECISO FAZER COM QUE QUANDO FOR ADICINADO ALGO DO TIPO FILTRO_PUBLICAÇÕES E PASSADO ESSES PARAMETROS PARA ELE PELO DISCORD ELE USE OUTRA URL NÃO A https://www.linkedin.com/jobs/search/?keywords=%22Junior%22+AND+%22Python%22+AND+%22Remoto%22&sortBy=date_posted&datePosted=past-week E SIM https://www.linkedin.com/search/results/content/?keywords=Junior%20Python%20Remoto&origin=SWITCH_SEARCH_VERTICAL&sid=na* E CASO NÃO PASSE NENHUM PARAMETRO ELE SÓ EXECUTE https://www.linkedin.com/jobs/search/? COMO JÁ ESTA FAZENDO...
            keywords: '"Junior" AND "Python" AND "Remoto"',
            sortBy: 'date_posted', // Pode ser 'relevance' ou 'date_posted'
            datePosted: 'past-week' // Pode ser 'past-24h', 'past-week', ou 'past-month'
        });
        if (results.length > 0) {
            const message = results.map(r => `${r.title} at ${r.company} in ${r.location}`).join('\n');
            await sendDiscordMessage(DISCORD_CHANNEL_ID, `Aqui estão os resultados do trabalho:\n\n${message}`);
            res.send('Pesquisa concluída e resultados enviados para Discord.');
        } else {
            res.send('Nenhum novo resultado de trabalho encontrado.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro durante a pesquisa.');
    }
});

// Agendar a pesquisa diária às 9h
cron.schedule('0 9 * * *', async () => {
    console.log('Executando pesquisa no LinkedIn');
    try {
        const results = await searchLinkedIn();
        if (results.length > 0) {
            const message = results.map(r => `${r.title} at ${r.company} in ${r.location}`).join('\n');
            await sendDiscordMessage(DISCORD_CHANNEL_ID, `Aqui estão os resultados do trabalho:\n\n${message}`);
        }
    } catch (error) {
        console.error('Ocorreu um erro durante a pesquisa agendada:', error);
    }
});

app.listen(port, () => {
    console.log(`O servidor está em execução: http://localhost:${port}`);
});
