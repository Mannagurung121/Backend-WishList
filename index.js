// index.js
const express = require('express');
const bodyParser = require('body-parser');
const scrapeAmazon = require('./scraper/amazon');
const scrapeFlipkart = require('./scraper/flipkart');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url in request body' });
  }

  try {
    let product = null;
    if (url.includes('amazon')) {
      product = await scrapeAmazon(url);
    } else if (url.includes('flipkart')) {
      product = await scrapeFlipkart(url);
    } else {
      return res.status(400).json({ error: 'Unsupported site. Use Amazon or Flipkart URL.' });
    }

    // Ensure we return shape expected by iOS Product struct:
    // { title: String, price: Int, image: String }
    if (!product) return res.status(500).json({ error: 'Scrape failed' });

    const title = product.title || '';
    // coerce price to integer or null
    const price = (typeof product.price === 'number') ? Math.round(product.price) :
                  (typeof product.price === 'string') ? parseInt(product.price.replace(/[^\d]/g, ''), 10) || null :
                  null;
    const image = product.imageURL || product.image || product.imageUrl || null;

    return res.json({ title, price, image });
  } catch (err) {
    console.error('❌ /scrape error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});