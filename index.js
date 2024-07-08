const express = require('express');
const cron = require('node-cron');
const searchLinkedIn = require('./search');
const sendDiscordMessage = require('./discordBot');
require('dotenv').config();

const app = express();
const port = 3000;

// ID do canal do Discord onde as mensagens serão enviadas
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID

app.get('/', (req, res) => {
    res.send('O bot de pesquisa do LinkedIn está em execução');
});

app.get('/pesquisar', async (req, res) => {
    console.log('Rodando a pesquisa no LinkedIn');
    try {
        const results = await searchLinkedIn();
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
