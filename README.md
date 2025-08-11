# Backend Wishlist Price Tracker

This repository contains the backend service for the Wishlist Price Tracker app.  
Built with Node.js, it scrapes product prices from Flipkart and Amazon and updates the data in Firebase Firestore for real-time price tracking and notifications.

---

## Features

- Scrapes product prices from Flipkart and Amazon product URLs  
- Updates product price data in Firebase Firestore  
- Supports real-time monitoring of price changes and notifications  
- Modular scraper architecture for easy addition of new e-commerce sites  

---

## Technologies Used

- Node.js  
- Axios  
- Cheerio / Puppeteer (for scraping)  
- Firebase Admin SDK (Firestore)  
- dotenv for environment variable management  

---

## Setup Instructions

1. Clone the repository

```bash
git clone https://github.com/Mannagurung121/Backend-WishList.git
cd Backend-WishList
