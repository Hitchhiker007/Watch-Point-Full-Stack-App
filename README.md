# 📺 Watch Point – A Full Stack App / Youtube Clone

This project is a full stack app utilising Google Cloud Services. Users are allowed to sign up, upload videos, delete videos, comment and view other users videos. 


🔗 [Live Prototype Website (Figma)](todo)  
🔗 [Live Site](todo)

---

## 📚 Table of Contents

- [Features](#-features)
- [Showcase](#-showcase)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Disclaimer](#-disclaimer)
- [Credits](#-credits)
  
---

## ✨ Features

- Modern, mobile-friendly UI
- Modular, reusable HTML components (`header`, `footer`, `product grid`)
- Search functionality with live filtering
- Shopping cart with persistent state (localStorage)
- Clean, responsive layout built from scratch
- Fully working purchase flow (from search to confirmation)

---

## 🖼 Showcase

Each of the following pages was designed for usability, layout clarity, and mobile responsiveness.

### 🏠 Home Page

| HomePage |
|--------|-------|
| ![Home](photo)|

---

### 🔎 Search Results

| Search |
|--------|-------|
| ![Search](photo) |

---

### 👤 Account Page

|  Account Page |
|--------|-------|
| ![Product Before](photo) |

---

### 🛍 Watch Page

| Watch Page|
|--------|-------|
| ![Watch Page](photo) |

---

### 🛒 Comments Section

| Comments Section |
|--------|-------|
| ![Comments Section](photo) |

---

## 🛠 Tech Stack

- **HTML5** – Semantic structure  
- **CSS3** – Responsive layout with reusable modules  
- **Typscript ** – Component loading, search, general logic  
- **JSON** – Data handling  
- **Google Cloud Run** – Hosting (live deployment)

---

## 📁 Project Structure

```
WatchPoint/
├── assets/
│   ├── icons/              # All icon files used site-wide (e.g., SVGs)
│   └── images/             # All images for products, backgrounds, and visuals
│
├── yt-web-client/
│   ├── footer.html         # Reusable footer
│   ├── header.html         # Reusable header/navigation
│   └── product-grid.html   # Reusable product grid layout
│
├── yt-api-service/
│   ├── accessories.json
│   ├── bottoms.json
│   ├── fleece.json
│   ├── headwear.json
│   ├── jackets.json
│   ├── sale.json
│   ├── tshirts.json
│   └── shop-all.json       # All products combined
│
├── video-processing-service/
│   ├── accessories.html
│   ├── bottoms.html
│   ├── checkout.html
│   ├── confirmation.html
│   ├── fleece.html
│   ├── headwear.html
│   ├── jackets.html
│   ├── product.html
│   ├── sale.html
│   ├── shop-all.html
│   └── tshirts.html
|
├── .gitignore              # Files/folders excluded from version control
├── index.html              # Main landing page
└── README.md
```

---

## ⚠️ Disclaimer

This project is a personal project created for learning purposes.
Youtube's original branding and content belong to their respective owners.
All videos and content belong to their respective owners. 
I am not affiliated with Youtube — this is a non-commercial project for learning.

---

## 🌟 Credits

- **Design & Development:** William Wells 
