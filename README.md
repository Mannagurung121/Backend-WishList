# Backend Wishlist Price Tracker

This repository contains the backend service for a Wishlist Price Tracker application.  
Built with Node.js, it scrapes product prices from popular e-commerce sites like Flipkart and Amazon and updates price data in Firebase Firestore. This enables real-time tracking of product prices and supports price drop notifications in the frontend app.

---

## Features

- Scrapes product prices from Flipkart and Amazon  
- Updates price data in Firebase Firestore  
- Modular scraper design for easy maintenance and extension  
- Supports real-time price tracking and notifications  

---

## Setup Instructions

1. Clone the repository

```bash
git clone <repo-url>
cd <repo-folder>

npm install
run
node index.js


index.js              # Main entry point
scraper/              # Scraper scripts for different e-commerce sites
  ├── amazon.js
  └── flipkart.js
services/             # Firebase utilities and other services
  └── firestore.js
package.json
README.md
