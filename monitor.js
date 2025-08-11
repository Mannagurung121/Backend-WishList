// monitor.js
const { getWishlistItems, updateCurrentPrice } = require('./services/firestore');
const scrapeAmazon = require('./scraper/amazon');
const scrapeFlipkart = require('./scraper/flipkart');

async function checkAll() {
  console.log('🔍 Starting price check', new Date().toISOString());

  // Flipkart
  const fk = await getWishlistItems('Flipkart');
  for (const item of fk) {
    try {
      const scraped = await scrapeFlipkart(item.url || item.productURL);
      if (scraped && scraped.price != null) {
        if (scraped.price <= item.targetPrice && scraped.price < (item.currentPrice || Infinity)) {
          console.log(`📉 Flipkart ${item.title} target hit: ${scraped.price} <= ${item.targetPrice}`);
          await updateCurrentPrice(item.id, scraped.price, true);
        } else {
          // update current price if changed (but not target hit)
          if (scraped.price !== item.currentPrice) {
            console.log(`↔️ Flipkart ${item.title} update currentPrice: ${scraped.price}`);
            await updateCurrentPrice(item.id, scraped.price, false);
          }
        }
      } else {
        console.warn('⚠️ Flipkart no price for', item.url);
      }
    } catch (e) {
      console.error('Error checking Flipkart item', e.message);
    }
  }

  // Amazon
  const am = await getWishlistItems('Amazon');
  for (const item of am) {
    try {
      const scraped = await scrapeAmazon(item.url || item.productURL);
      if (scraped && scraped.price != null) {
        if (scraped.price <= item.targetPrice && scraped.price < (item.currentPrice || Infinity)) {
          console.log(`📉 Amazon ${item.title} target hit: ${scraped.price} <= ${item.targetPrice}`);
          await updateCurrentPrice(item.id, scraped.price, true);
        } else {
          if (scraped.price !== item.currentPrice) {
            console.log(`↔️ Amazon ${item.title} update currentPrice: ${scraped.price}`);
            await updateCurrentPrice(item.id, scraped.price, false);
          }
        }
      } else {
        console.warn('⚠️ Amazon no price for', item.url);
      }
    } catch (e) {
      console.error('Error checking Amazon item', e.message);
    }
  }

  console.log('✅ Price check finished', new Date().toISOString());
}

// Run immediately and then every 10 hours
checkAll();
setInterval(checkAll, 10 * 60 * 60 * 1000);