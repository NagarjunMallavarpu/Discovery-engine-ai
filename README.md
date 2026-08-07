# 🧠 AI Discovery Engine

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.12-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-8E44AD?logo=google&logoColor=white)](https://ai.google.dev/)
[![JWT Auth](https://img.shields.io/badge/JWT-Protected-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Hackathon](https://img.shields.io/badge/Hackathon-AI_BUILD_2026-FF5722?logo=rocket&logoColor=white)](#-hackathon-information)

An AI-powered product discovery and personalized recommendation platform that transforms traditional static keyword search into a real-time, intent-aware shopping experience.

---

## 🎯 Project Objective

Traditional e-commerce platforms rely heavily on exact keyword matching. When shoppers enter natural language requests like *"lightweight laptop for coding and video editing under ₹1,000,000"* or *"gaming setup for immersive audio"*, keyword search engines often return irrelevant results or empty pages.

**AI Discovery Engine** solves this by:
1. **Understanding Natural Language Intent**: Parsing intent, budget limits, target categories, and specification requirements using **Google Gemini 1.5 Flash**.
2. **Transparent Explainable AI**: Providing multi-metric confidence scores (Confidence %, Attribute Similarity %, Category Match %) alongside human-readable rationales so shoppers understand *why* an item was recommended.
3. **Smart Ecosystem Bundling**: Assembling complementary 4-piece product ecosystems (*Complete The Look*) and Amazon-style *Frequently Bought Together* widgets with 1-click cart addition.
4. **Never-Empty Cold Start Guarantee**: Ensuring new or unauthenticated users immediately receive high-affinity trending and popular catalog items.

---

## 🏆 Hackathon Information

This project was developed for **AI BUILD 2026**:
- **Event**: AI BUILD 2026
- **Track**: **Track 7 – Discovery Engine**
- **Focus Area**: Personalized Multi-Intent Product Recommendations & Discovery

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User([👤 User / Shopper]) <-->|HTTPS / JSON| Frontend[⚛️ React 18 + Vite Frontend]
    Frontend <-->|REST API / Axios| Backend[🚀 Express.js API Server]
    
    subgraph Core AI & Discovery Logic
        Backend <--> IntentDet[🧠 Intent Detector Service]
        Backend <--> RecEngine[⚙️ Multi-Factor Recommendation Engine]
        Backend <--> BundleEng[📦 Smart Bundle Engine]
        Backend <--> Analytics[📈 Analytics & Feedback Service]
    end

    Backend <-->|@google/generative-ai| Gemini[✨ Google Gemini 1.5 Flash AI API]
    Backend <-->|Prisma ORM| DB[(💾 SQLite Database / dev.db)]

    IntentDet -->|Extract Intent & Category| RecEngine
    RecEngine -->|Compute Composite Score| Frontend
    Analytics -->|Track SHOWN / CLICKED / CARTED| DB
```

---

## ⚙️ Recommendation & Scoring Engine Workflow

Candidates are evaluated through a **Multi-Factor Scoring Formula** generating a composite score $S \in [0, 100]$:

$$S = (0.35 \times S_{\text{intent}}) + (0.25 \times S_{\text{sim}}) + (0.20 \times S_{\text{cat}}) + (0.10 \times S_{\text{brand}}) + (0.10 \times S_{\text{pop}})$$

```mermaid
sequenceDiagram
    autonumber
    actor Shopper
    participant Client as React App
    participant API as Express Controller
    participant Engine as Recommendation Engine
    participant Gemini as Gemini AI
    participant DB as SQLite DB

    Shopper->>Client: Enters Search Query or Views Product
    Client->>API: POST /api/search/smart or GET /api/recommendations/personalized
    API->>Gemini: Request Intent Extraction & Rationale
    alt Gemini Active
        Gemini-->>API: JSON (Category, MaxPrice, Purpose, Keywords)
    else Gemini Offline / Rate-Limited
        API->>API: Fallback to Heuristic Regex Intent Parser
    end
    API->>Engine: Run Multi-Factor Scoring Engine
    Engine->>DB: Fetch Candidate Products & View History
    DB-->>Engine: Raw Products List
    Engine->>Engine: Calculate S = (W_intent * S_intent) + (W_sim * S_sim) + ...
    Engine-->>API: Ranked Recommendations with Match %
    API-->>Client: JSON Response (Items + AI Rationales + Confidence Meters)
    Client->>Shopper: Render Apple / Perplexity Style Discovery UI
    Shopper->>Client: Interacts (Click / Cart / Purchase / Dismiss)
    Client->>API: POST /api/admin/analytics/track-recommendation
    API->>DB: Record Event & Update Affinity Weights
```

---

## 🌟 Key Features

### 🧠 AI & Recommendation Features
- **Natural Language Intent Parsing**: Concurrently extracts intent tags, budget caps, category constraints, and brand preferences.
- **Cold-Start Fallback Guarantee**: Gracefully transitions new visitors to high-velocity trending items when explicit history is absent.
- **Explainable AI Confidence Meters**: Visual multi-bar display showing **Confidence %**, **Attribute Similarity Score %**, and **Category Match Score %**.
- **Smart Ecosystem Bundles**:
  - *Frequently Bought Together*: Interactive Amazon-style checkboxes with bundled price calculations and 1-click cart addition.
  - *Complete The Look*: Curated 4-piece ecosystem package showcase offering package discount savings.
- **Gemini Shopper Intelligence**: Profile-level shopper personality summary generated on the User Profile dashboard.

### 🛒 Shopping Experience Features
- **Command-K Spotlight AI Search**: Overlay modal with interactive quick-prompt shortcuts, Gemini thinking animation, and intent breakdown chips.
- **Apple Store / Nike Product Cards**: Soft rounded corners (`22px`), smooth image hover zoom (`scale(1.06)`), micro-shadows, and elegant AI rationale badges.
- **Interactive Product Details**: Multi-image preview gallery with hover zoom, technical specification tables, glass AI rationale cards, and horizontal snap-scroll carousels.
- **Streamlined Apple / Amazon Style Checkout**: Delivery address form, order summary sidebar, default *Cash on Delivery* payment option, and order success confirmation page with estimated delivery dates.

### 📊 Enterprise Admin & Analytics Features
- **Enterprise Dashboard**: High-level overview KPIs (*Users, Revenue, Orders, Active Products*).
- **Search Analytics**: Top searched terms bar chart, zero-inventory demand alerts, search conversion %, AI usage %, and response latency metrics.
- **Customer Journey Funnel**: 6-stage conversion tracking (`Home → Search → Product View → Wishlist → Cart → Purchase`) with drop-off percentages.
- **Recommendation Feedback Loop**: Real-time tracking of recommendation events (`SHOWN`, `CLICKED`, `CARTED`, `PURCHASED`, `DISMISSED`) and CTR % metrics.
- **Catalog Management (CRUD)**: Modal interface for admins to create, edit, or remove catalog items.

### 🔒 Infrastructure & Security Features
- **Authentication & Authorization**: Stateless JWT authentication with BCrypt password hashing and Role-Based Access Control (`CUSTOMER` vs `ADMIN`).
- **Silent Heuristic Failover**: Zero downtime fallback logic ensuring full application functionality even if third-party AI APIs are unreachable.

---

## 🛠️ Technology Stack

| Layer | Technology | Usage in Project |
|---|---|---|
| **Frontend Framework** | **React 18.3** | Component-driven user interface |
| **Build Tool** | **Vite 5.4** | High-speed ESM bundler and HMR server |
| **Routing** | **React Router DOM 6.22** | Client-side page navigation & protected routes |
| **Styling** | **Vanilla CSS Tokens** | Custom design system (`index.css`) with Apple/Vercel aesthetics |
| **Data Visualization** | **Recharts 2.12** | Enterprise analytics charts & funnel visualizations |
| **Icons** | **Lucide React 0.344** | Modern vector icon system |
| **Backend Runtime** | **Node.js v18+** | Server-side JavaScript environment |
| **Web Framework** | **Express.js 4.19** | REST API routing and middleware pipeline |
| **Database & ORM** | **Prisma ORM 5.12 + SQLite** | Type-safe schema definition and query builder |
| **Artificial Intelligence** | **Google Gemini 1.5 Flash SDK** | `@google/generative-ai` natural language intent parsing |
| **Security** | **JWT & BCryptJS** | Token authentication and password encryption |

---

## 📁 Folder Structure

```
Discovery Engine/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Database schemas & relationship definitions
│   │   ├── dev.db                # SQLite database file
│   │   └── seed.js               # Data seeder (18 tech products across 8 flagship brands)
│   ├── src/
│   │   ├── ai/
│   │   │   └── geminiService.js  # Gemini 1.5 Flash AI Intent Parser & Rationale Generator
│   │   ├── config/               # Environment variables & DB client setup
│   │   ├── controllers/          # Request handlers for Auth, Products, Search, Recs, Cart, Orders, Admin
│   │   ├── middleware/           # Auth JWT, RBAC, and centralized Error Handler
│   │   ├── routes/               # Express API route declarations
│   │   ├── services/             # IntentDetector, RecommendationEngine, BundleEngine, AnalyticsService
│   │   └── server.js             # Express server entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # AIConfidenceMeter, AISearchModal, FrequentlyBoughtTogether, CompleteTheLookBundle, Navbar, Footer
│   │   ├── context/              # AuthContext, CartContext, WishlistContext, ThemeContext
│   │   ├── pages/                # Home, Browse, ProductDetail, CartPage, CheckoutPage, OrderSuccessPage, UserProfilePage, AdminDashboard
│   │   ├── services/             # Axios API client configuration
│   │   ├── App.jsx               # Main router & provider wrapper
│   │   ├── index.css             # Design tokens, mesh gradients & keyframe animations
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md
└── .gitignore
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |

### Products & Categories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Filter and sort catalog products |
| `GET` | `/api/products/:id` | Public | Fetch product details by ID or slug |
| `GET` | `/api/categories` | Public | List all product categories |

### AI Discovery & Recommendations
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/search/smart` | Public | Perform Gemini AI natural language intent search |
| `GET` | `/api/recommendations/personalized` | Public/Auth | Fetch multi-factor personalized recommendation feed |
| `GET` | `/api/recommendations/intent` | Public/Auth | Get active session intent breakdown |
| `GET` | `/api/recommendations/trending` | Public | Get top trending products feed |
| `GET` | `/api/recommendations/similar/:productId` | Public | Fetch similar products for product detail pages |
| `GET` | `/api/recommendations/frequently-bought/:productId` | Public | Fetch Amazon-style FBT bundle items |
| `GET` | `/api/recommendations/smart-bundle/:productId` | Public | Fetch Complete The Look 4-piece ecosystem package |
| `GET` | `/api/recommendations/ai-insights` | Protected | Generate Gemini AI profile shopper summary |

### Shopping Cart, Wishlist & Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Protected | Fetch user active cart items |
| `POST` | `/api/cart` | Protected | Add item to cart |
| `PUT` | `/api/cart/:itemId` | Protected | Update item quantity in cart |
| `DELETE` | `/api/cart/:itemId` | Protected | Remove item from cart |
| `GET` | `/api/wishlist` | Protected | Fetch user saved wishlist items |
| `POST` | `/api/wishlist` | Protected | Toggle item in wishlist |
| `POST` | `/api/orders/checkout` | Protected | Place customer order (Cash on Delivery) |
| `GET` | `/api/orders/my-orders` | Protected | List customer order history |

### Admin Analytics & Product Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/admin/products` | Admin | Create a new catalog product |
| `PUT` | `/api/admin/products/:id` | Admin | Update existing product details |
| `DELETE` | `/api/admin/products/:id` | Admin | Remove product from catalog |
| `GET` | `/api/admin/analytics/overview` | Admin | Retrieve enterprise KPI overview metrics |
| `GET` | `/api/admin/analytics/search` | Admin | Retrieve search term analytics & zero-inventory alerts |
| `GET` | `/api/admin/analytics/journey` | Admin | Retrieve customer conversion funnel metrics |
| `GET` | `/api/admin/analytics/recommendations` | Admin | Retrieve recommendation feedback loop & CTR % metrics |

---

## 🖼️ Application Screenshots

> *Note: Place screenshots of your live application inside a `docs/screenshots/` folder in your repository to display them here.*

| Section | Screenshot Preview |
|---|---|
| **Funded AI Startup Landing Page** | ![Homepage Preview](docs/screenshots/homepage.png) |
| **Command-K Spotlight AI Search** | ![AI Search Preview](docs/screenshots/ai-search.png) |
| **Rich AI Product Details Page** | ![Product Detail Preview](docs/screenshots/product-detail.png) |
| **Personalized Recommendations Feed** | ![Recommendations Preview](docs/screenshots/recommendations.png) |
| **Shopping Cart Experience** | ![Cart Preview](docs/screenshots/cart.png) |
| **Minimal Apple / Amazon Style Checkout** | ![Checkout Preview](docs/screenshots/checkout.png) |
| **Enterprise Admin Analytics Dashboard** | ![Admin Dashboard Preview](docs/screenshots/admin-dashboard.png) |

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
DATABASE_URL="file:./dev.db"

# Security
JWT_SECRET="discovery-engine-secret-jwt-key-2026"

# Google Gemini AI Integration (Optional - Fallback active if omitted)
GEMINI_API_KEY="your-google-gemini-api-key-here"
```

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/NagarjunMallavarpu/Discovery-engine-ai.git
cd Discovery-engine-ai
```

### 2. Backend Setup & Seeding
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Push database schema & generate Prisma Client
npx prisma db push

# Seed database with flagship products across Apple, Asus, Sony, Samsung, Lenovo, Razer, Philips, Dell
node prisma/seed.js

# Launch backend development server
npm run dev
```
*The Express REST API server will run at: `http://localhost:5000`*

### 3. Frontend Setup & Launch
Open a second terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Launch Vite development server
npm run dev
```
*The React application will run at: `http://localhost:5173`*

---

## 🔑 Demo Account Credentials

| Portal | Email | Password | Role & Permissions |
|---|---|---|---|
| **Customer Portal** | `user@discovery.ai` | `password123` | Personal recommendations, Wishlist, Cart, Checkout, User Profile |
| **Admin Dashboard** | `admin@discovery.ai` | `password123` | Enterprise Analytics, Inventory CRUD, Funnel Metrics, Feedback Loop |

---

## 💼 Business Value & Impact

1. **Reduced Search Friction**: Natural language intent parsing eliminates zero-result search pages and helps shoppers locate multi-attribute products faster.
2. **Higher Average Order Value (AOV)**: Automated ecosystem packages (*Complete The Look*) and 1-click *Frequently Bought Together* widgets drive cross-category accessory purchases.
3. **Consumer Trust Through Explainability**: Exposing visual confidence scores and natural language rationales demystifies AI recommendations, increasing click-through rates.
4. **Data-Driven Inventory Insights**: Admins receive zero-inventory search demand alerts, allowing product managers to identify unfulfilled customer demand.

---

## 🔮 Future Scope & Roadmap

- [ ] **Vector Database Integration**: Migration to pgvector / Qdrant for dense vector similarity embeddings.
- [ ] **RAG Architecture**: Retrieval-Augmented Generation using product manuals and user reviews for conversational shopping assistants.
- [ ] **Multilingual & Voice Search**: Native speech-to-text search input and multi-language translation.
- [ ] **Collaborative Filtering**: Matrix factorization to complement content-based recommendation scoring.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

- **Nagarjun Mallavarpu** — *Full Stack Lead & Product Architect* — [GitHub Profile](https://github.com/NagarjunMallavarpu)

---

<p align="center">
  Built for <b>AI BUILD 2026</b> • Track 7 – Discovery Engine
</p>
