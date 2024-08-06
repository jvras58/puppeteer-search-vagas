require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIES_PATH = path.resolve(__dirname, 'cookies.json');

// Função para gerar URL de pesquisa do LinkedIn com filtros
function generateLinkedInSearchUrl({ keywords = '', sortBy = '', datePosted = '' }) {
    const baseUrl = 'https://www.linkedin.com/jobs/search/?';
    const queryParameters = new URLSearchParams();

    if (keywords) {
        queryParameters.append('keywords', keywords);
    }

    if (sortBy) {
        queryParameters.append('sortBy', sortBy);
    }

    if (datePosted) {
        queryParameters.append('datePosted', datePosted);
    }

    return baseUrl + queryParameters.toString();
}

async function searchLinkedIn({ keywords, sortBy, datePosted } = {}) {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true }); // Mude para false para depurar
        const page = await browser.newPage();

        // Carregar cookies se existirem
        const previousSession = fs.existsSync(COOKIES_PATH);
        if (previousSession) {
            const cookiesString = fs.readFileSync(COOKIES_PATH, 'utf-8');
            const cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
        }

        await page.goto('https://www.linkedin.com/login');

        if (!previousSession) {
            // Fazer login no LinkedIn usando variáveis de ambiente
            await page.type('#username', process.env.LINKEDIN_USERNAME);
            await page.type('#password', process.env.LINKEDIN_PASSWORD);
            await page.click('button[type="submit"]');
            
            await page.waitForNavigation();

            // Salvar cookies após o login
            const cookies = await page.cookies();
            fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
        }

        // Realizar a pesquisa
        const searchQuery = process.env.SEARCHQUERY || keywords;
        const searchUrl = generateLinkedInSearchUrl({ keywords: searchQuery, sortBy, datePosted });
        console.log(`Acessando URL de pesquisa: ${searchUrl}`); // Log da URL
        await page.goto(searchUrl);

        try {
            // Use um seletor genérico para garantir que as alterações na página sejam tratadas
            await page.waitForSelector('.jobs-search-results__list-item, .search-results__list', { timeout: 10000 });
        } catch (error) {
            console.error('Falha ao encontrar o seletor esperado:', error);
            throw error; // Re-throw para permitir tratamento adequado
        }


        const results = await page.evaluate(() => {
            const jobElements = document.querySelectorAll('.jobs-search-results__list-item');
            const jobData = [];
            jobElements.forEach(job => {
                const title = job.querySelector('.job-card-list__title')?.innerText || 'Título não encontrado';
                const company = job.querySelector('.job-card-container__company-name')?.innerText || 'Empresa não encontrada';
                const location = job.querySelector('.job-card-container__metadata-item')?.innerText || 'Localização não encontrada';
                jobData.push({ title, company, location });
            });
            return jobData.slice(0, 10); // Limitar resultados a 10
        });

        return results;
    } catch (error) {
        console.error('Erro durante a automação do LinkedIn:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = searchLinkedIn;
