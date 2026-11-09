<div align="center">

# 🌙 Scentia Fragrances

### *Where Luxury Meets Scent*

A full-stack, dark-luxury e-commerce platform for premium perfumes — built with the MERN stack, styled with a "Snyder aesthetic," and engineered for a seamless fragrance shopping experience.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-D4AF37?style=for-the-badge)](LICENSE)

</div>

---

## ✨ The Experience

**Scentia** is not just another online store. It is a curated digital boutique designed to evoke the same emotion you feel when you uncork a bottle of *Oud Wood* or spritz *Bleu de Chanel*. Every pixel is intentional. Every interaction is smooth. Every scent has a story.

> *"A fragrance is a memory waiting to be worn."*

Built with a striking **black-and-gold** palette, serif typography, and cinematic loading states, Scentia delivers a shopping experience that feels less like browsing and more like walking into a private atelier.

---

## 🚀 Features

### 🛍️ For the Customer
- **Curated Fragrance Catalog** — Browse premium perfumes with rich detail pages, notes (top, heart, base), and pricing.
- **Smart Cart & Persistence** — Cart state is saved to MongoDB and restored on login, so nothing is ever lost.
- **Secure Authentication** — JWT-based login and signup with a sleek dark UI.
- **1LINK / PayFast Integration** — Pakistan's leading payment gateway with a secure handshake flow and bill generation.
- **Order Success Flow** — Real-time redirection and confirmation after payment.
- **Elegant Loading States** — Custom "Establishing Secure Connection..." states with animated gold loaders.
- **Fully Responsive** — Flawless on mobile, tablet, and desktop.

### 🛡️ For the Admin / Developer
- **RESTful API** — Clean Express endpoints for auth, products, cart, and orders.
- **JWT Protection** — Protected routes for authenticated users.
- **Environment-Safe** — Secrets managed via `.env`, never committed.
- **Scalable Folder Structure** — Clean separation of `client/` and `server/`.
- **API-Ready** — Easy to plug into any payment gateway or analytics tool.

---

## 🧰 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Redux Toolkit, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) + Mongoose |
| **Auth** | JWT (JSON Web Tokens) + bcrypt |
| **Payments** | 1LINK / PayFast (Pakistan) |
| **Styling** | Inline CSS + Custom Gold/Black Theme, Playfair Display, Inter |
| **Deployment** | Vercel (Frontend), Render / Vercel Serverless (Backend) |

---

## 🖼️ Preview

<img width="940" height="428" alt="Screenshot 2026-11-09 232442" src="https://github.com/user-attachments/assets/e48fc6ec-0dc2-4b2f-9a08-415b6588a3ae" />
<img width="713" height="353" alt="Screenshot 2026-11-09 232415" src="https://github.com/user-attachments/assets/debb70e5-d118-49ac-8144-1a778ece3f42" />
<img width="494" height="395" alt="Screenshot 2026-11-09 232651" src="https://github.com/user-attachments/assets/c3723ab0-0aae-488f-8ad2-466cd30ffb8c" />
<img width="870" height="431" alt="Screenshot 2026-11-09 232339" src="https://github.com/user-attachments/assets/8df4f394-f921-4210-a385-c8ff7169fb3a" />
<img width="568" height="434" alt="Screenshot 2026-11-09 232255" src="https://github.com/user-attachments/assets/526e92fd-58a6-4ee4-8ce7-450a60e395ac" />
<img width="463" height="442" alt="Screenshot 2026-11-09 232400" src="https://github.com/user-attachments/assets/d0b80725-c9fa-4178-9557-5b2ab383ef44" />
<img width="947" height="443" alt="Screenshot 2026-11-09 232219" src="https://github.com/user-attachments/assets/8ab8294a-5e7b-404b-8ae2-5a851a2b7499" />

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local or Atlas URI)
- **npm** or **yarn**
- **1LINK / PayFast Sandbox Credentials** (for payment testing)

### 1. Clone the Repository
```bash
git clone https://github.com/TahaBinKhalid/Scentia-Fragrances.git
cd Scentia-Fragrances
```

### 2. Install Dependencies

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the **`server/`** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000

# 1LINK / PayFast
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_SECRET=your_secret
PAYFAST_API_URL=https://sandbox.1link.com.pk/api
```

Create a `.env` file in the **`client/`** directory (optional, for API base URL):

```env
REACT_APP_API_URL=http://localhost:5000
```

> ⚠️ **Never commit your `.env` files.** They are already in `.gitignore`.

### 4. Run the App

**Start the backend:**
```bash
cd server
npm run dev
# or: npm start
```

**Start the frontend (in a new terminal):**
```bash
cd client
npm start
```

The app will be live at **`http://localhost:3000`** and the API at **`http://localhost:5000`**.

---

## 📁 Project Structure

```text
Scentia-Fragrances/
│
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, ProductCard, Loader...)
│   │   ├── context/            # AuthContext
│   │   ├── pages/              # Home, Login, Signup, Product, Cart, Checkout
│   │   ├── redux/              # cartSlice, store
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── controllers/            # authController, productController, orderController
│   ├── models/                 # User, Product, Order
│   ├── routes/                 # authRoutes, productRoutes, paymentRoutes
│   ├── middleware/             # authMiddleware
│   ├── index.js                # Server entry
│   └── package.json
│
├── .gitignore
├── vercel.json                 # (if deploying both on Vercel)
└── README.md
```

---

## 🔌 API Endpoints (Sample)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive JWT |
| `GET` | `/api/products` | Fetch all fragrances |
| `GET` | `/api/products/:id` | Fetch a single fragrance |
| `POST` | `/api/cart` | Sync cart to database |
| `POST` | `/api/payment/initiate` | Start 1LINK handshake |

---

## 🌐 Deployment

### Option A: Frontend on Vercel + Backend on Render
- Deploy `client/` to **Vercel**
- Deploy `server/` to **Render** as a Web Service
- Update CORS in `server/index.js` to allow your Vercel domain
- Set `REACT_APP_API_URL` on Vercel to your Render URL

### Option B: Full Stack on Vercel
- Export your Express `app` from `server/index.js`
- Add a `vercel.json` with rewrites for `/api/*`
- Deploy the whole repo as one Vercel project

> See the deployment notes in the repo or open an issue for a step-by-step guide.

---

## 🧪 Roadmap

- [ ] Product reviews and ratings
- [ ] Wishlist / favorites
- [ ] Admin dashboard for inventory
- [ ] Email order confirmations (Nodemailer)
- [ ] Stripe / international payments
- [ ] Fragrance recommendation quiz
- [ ] Multi-language support (English / Urdu)

---

## 🤝 Contributing

Contributions are welcome and appreciated. To contribute:

1. Fork the repo
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

Please follow the existing code style and keep PRs focused.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 👤 Author

**Taha Bin Khalid**

[![GitHub](https://img.shields.io/badge/GitHub-TahaBinKhalid-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TahaBinKhalid)

> *"Built with obsession, scented with ambition."*

---

## 💛 Acknowledgments

- Inspired by the timeless elegance of luxury fragrance houses.
- Built with the MERN stack and a relentless attention to detail.
- Icons and badges courtesy of [Shields.io](https://shields.io).
- Fonts: **Playfair Display** & **Inter** via Google Fonts.

---

<div align="center">

### ⭐ If you love this project, give it a star!

**Scentia Fragrances** — *Wear the Invisible. Remember the Moment.*

</div>
