// services/firestore.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // adjust path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const wishlistRef = db.collection('wishlist');
const historyRef = db.collection('price_history');

async function getWishlistItems(source) {
  const snapshot = await wishlistRef.where('source', '==', source).get();
  const items = [];
  snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
  return items;
}

// update currentPrice, lastChecked and optionally targetHit
async function updateCurrentPrice(id, newPrice, targetHit = false) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  await wishlistRef.doc(id).update({
    currentPrice: newPrice,
    lastChecked: now,
    targetHit
  });
  // log history
  await historyRef.add({
    wishlistItemId: id,
    newPrice,
    changedAt: now
  });
}

module.exports = { getWishlistItems, updateCurrentPrice };