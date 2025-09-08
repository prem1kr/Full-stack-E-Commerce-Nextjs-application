# 🛍️ Next.js E-Commerce App

A modern e-commerce web application built with **Next.js 13 (App Router)**, **MongoDB**, **Clerk Authentication**, and **Cloudinary** for image hosting.  
This project implements a full-stack shopping platform with product management, cart, orders, and secure user authentication.

---

## 🚀 Features

- **Next.js 13 (App Router)** for fast, server-side rendered pages
- **Clerk** for authentication (sign in, sign up, user sessions)
- **MongoDB Atlas** as the database
- **Cloudinary** for image uploads and hosting
- **Responsive UI** with reusable components
- Product listing, featured products, and order management
- Add to cart, checkout, and address management
- Clean and modular folder structure

---

## 📂 Project Structure

```

app/
├── add-address/        # Add new shipping address
├── all-products/       # Show all products
├── api/                # API routes
│   ├── address/        # Address-related API
│   ├── cart/           # Cart APIs
│   ├── config/         # Config & utils
│   ├── models/         # Mongoose models
│   ├── order/          # Order-related APIs
│   └── user/           # User APIs
├── cart/               # Cart page
├── my-orders/          # User orders page
├── order-placed/       # Order confirmation page
├── product/            # Product detail page
├── layout.js           # Root layout
└── page.jsx            # Home page

components/
├── Banner.jsx
├── FeaturedProduct.jsx
├── Footer.jsx
├── HeaderSlider.jsx
├── HomeProducts.jsx
├── Loading.jsx
├── Navbar.jsx
├── NewsLetter.jsx
├── OrderSummary.jsx
└── ProductCard.jsx

context/                 # React Context (Cart/User state)
assets/                  # Static assets
globals.css              # Global styles

````

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# Currency Symbol
NEXT_PUBLIC_CURRENCY=$

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your key
CLERK_SECRET_KEY=your key

# MongoDB Connection
MONGODB_URI= your db

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
````

---

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ecommerce-nextjs.git
   cd ecommerce-nextjs
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   * Create a `.env.local` file in the root directory
   * Copy the variables from above

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Tech Stack

* [Next.js 13](https://nextjs.org/) – React framework
* [Clerk](https://clerk.com/) – Authentication
* [MongoDB](https://www.mongodb.com/) – Database
* [Mongoose](https://mongoosejs.com/) – ODM for MongoDB
* [Cloudinary](https://cloudinary.com/) – Image hosting
* \[Tailwind CSS] (if used) – Styling


