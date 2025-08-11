const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function scrapeFlipkart(url) {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true,   // sirf yahi change kiya hai
            slowMo: 50
        });
        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36"
        );

        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

        // Scroll to trigger lazy loading
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await new Promise(r => setTimeout(r, 2000)); // safe timeout

        // Title
        const title = await page.$eval("span.VU-ZEz", el => el.textContent.trim())
            .catch(() => null);

        // Price
        let priceText = await page.$eval("div.Nx9bqj", el => el.textContent.trim())
            .catch(() => null);

        // Clean price (₹ and commas remove)
        let price = null;
        if (priceText) {
            price = parseInt(priceText.replace(/[₹,]/g, ""));
        }

        // Image
        const imageURL = await page.$eval("img._0DkuPH", img => img.src)
            .catch(() => null);

        return { title, price, imageURL };

    } catch (error) {
        console.error("Flipkart scraping failed:", error.message);
        return { title: null, price: null, imageURL: null, error: error.message };
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = scrapeFlipkart;