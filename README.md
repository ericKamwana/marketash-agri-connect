# Marketash AgriConnect 🌿

Marketash AgriConnect is a modern, AI-enabled online agricultural marketplace that connects African farmers directly with buyers. It allows users to browse fresh produce, search, filter by category and location, and view detailed information about the products and the farmers behind them.

## 🌍 Project Goal

This project bridges the gap between African smallholder farmers and markets by digitizing the sales process, creating transparency, and supporting fair trade through technology.

---

## 🚀 Live Demo

Deployed on Netlify: [https://marketash.netlify.app](https://marketash.netlify.app)

---

## 🛠 Features

- ✅ Dynamic product listing
- ✅ Filter by category and location
- ✅ Farmer profile display (image, name, rating)
- ✅ Clean and responsive UI (Tailwind CSS)
- ✅ Marketplace search with real-time results
- ✅ AI integrations ready (via Genkit or Lovable AI)
- ✅ Support for Netlify deployment with special handling for image paths with spaces

---

## 🧰 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Deployment**: Netlify
- **Image hosting**: `public/lovable-uploads/`
- **AI-ready**: Structured to integrate with Lovable/Genkit AI tools

---

## 📁 Folder Structure
marketash-agri-connect/
├── public/
│ └── lovable-uploads/ # Static assets and product images
├── src/
│ ├── components/ # Reusable UI components
│ ├── data/ # Mock data (products, categories, locations)
│ ├── pages/ # Main page views
│ └── styles/ # Tailwind and custom styles
├── README.md
├── package.json
└── tsconfig.json

# 🧪 How to Run Locally

1. **Clone the repo:**

```bash
git clone https://github.com/ericKamwana/marketash-agri-connect.git
cd marketash-agri-connect

Install dependencies:

bash
Copy code
npm install
Start development server:

bash
Copy code
npm run dev
Open in browser:

arduino
Copy code
http://localhost:3000
📦 Deployment Notes
Netlify does not support spaces in static file paths unless properly encoded.

✅ Make sure all image src attributes with spaces are URL-encoded, e.g.:

tsx
Copy code
<img src="/lovable-uploads/Premium%20Coffee%20Beans.jpg" alt="Coffee" />
❌ Avoid this:

tsx
Copy code
<img src="/lovable-uploads/Premium Coffee Beans.jpg" />
🤖 Prompt to Recreate This with Lovable AI
If you'd like to build a similar agricultural marketplace using Lovable AI, here’s the prompt you can use to guide the assistant:

Prompt:

"Create a modern agricultural marketplace web app called AgriConnect. It should:

Display a list of farm produce from various African countries

Include product images, prices, locations, quantities, and farmer profiles (with ratings and photos)

Allow filtering by category (vegetables, fruits, grains, etc.) and location (Kenya, Nigeria, Ghana, etc.)

Include a search bar that filters products in real-time

Use React and Tailwind CSS

Host images from a /public/lovable-uploads/ folder (with proper encoding for image filenames with spaces)

Make the UI mobile-friendly and clean

Include dummy data for 10 sample products and 5 categories

Deploy it on Netlify"

You can further instruct Lovable AI to:

Add animations or transitions

Integrate Firebase or Supabase for live data

Add a bidding system

👥 Contributing
Contributions are welcome! If you'd like to suggest a feature, fix a bug, or improve documentation:

Fork the repository

Create a new branch: git checkout -b feature-name

Commit your changes

Push and submit a pull request

©️ License
MIT License — free to use, modify, and distribute.

🌱 Built with love by Eric Kamwana
yaml
Copy code




