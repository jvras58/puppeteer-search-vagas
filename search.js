require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIES_PATH = path.resolve(__dirname, 'cookies.json');

async function searchLinkedIn() {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
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
        const searchQuery = process.env.SEARCHQUERY;
        console.log(`Pesquisando por: ${searchQuery}`);
        const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery)}`;
        console.log(`Acessando URL: ${searchUrl}`);
        await page.goto(searchUrl);
        await page.waitForSelector('.jobs-search-results__list-item', { timeout: 10000 });

        const results = await page.evaluate(() => {
            const jobElements = document.querySelectorAll('.jobs-search-results__list-item');
            const jobData = [];
            jobElements.forEach(job => {
                const title = job.querySelector('.job-card-list__title')?.innerText;
                const company = job.querySelector('.job-card-container__company-name')?.innerText;
                const location = job.querySelector('.job-card-container__metadata-item')?.innerText;
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