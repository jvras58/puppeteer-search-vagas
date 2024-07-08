require('dotenv').config(); 
const puppeteer = require('puppeteer');

async function searchLinkedIn() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto('https://www.linkedin.com/login');
    
    // Faça login no LinkedIn usando variáveis de ambiente
    await page.type('#username', process.env.LINKEDIN_USERNAME); 
    await page.type('#password', process.env.LINKEDIN_PASSWORD);
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation();
    
    // Realizar a pesquisa
    const searchQuery = '"Estágio" AND "Python" AND "Remoto"';
    await page.goto(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery)}`);
    
    await page.waitForSelector('.jobs-search-results__list-item');
    
    const results = await page.evaluate(() => {
        const jobElements = document.querySelectorAll('.jobs-search-results__list-item');
        const jobData = [];
        jobElements.forEach(job => {
            const title = job.querySelector('.job-card-list__title')?.innerText;
            const company = job.querySelector('.job-card-container__company-name')?.innerText;
            const location = job.querySelector('.job-card-container__metadata-item')?.innerText;
            jobData.push({ title, company, location });
        });
        return jobData;
    });
    
    await browser.close();
    
    return results;
}

module.exports = searchLinkedIn;