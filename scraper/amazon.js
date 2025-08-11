// scraper/amazon.js
const puppeteer = require('puppeteer');

async function scrapeAmazon(url) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const data = await page.evaluate(() => {
    const title = document.getElementById('productTitle')?.innerText?.trim();
    const priceText = document.querySelector('.a-price .a-offscreen')?.innerText?.replace(/[₹,]/g, '');
    const price = priceText ? parseFloat(priceText) : NaN;
    const imageURL = document.querySelector('#landingImage')?.src;

    return { title, price, imageURL };
  });

  await browser.close();
  return data;
}

module.exports = scrapeAmazon;