# PrestoDental - Modern Full-Stack Dental Supply Platform

A full-stack, enterprise-grade B2B dental supplies and clinical procurement web platform built with **React 19**, **TypeScript**, **Vite**, **Bootstrap 5 / SCSS**, **Django 5 REST Framework**, and **Python 3.12+**.

---

## 🚀 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19.x** | Modern component-driven UI with Hooks & Context API |
| **Language & Tooling** | **TypeScript 5.7+ & Vite 6** | Strict type safety, ultra-fast HMR, and optimized bundler |
| **Routing** | **React Router 7** | Client-side routing with clean layout wrappers |
| **Styling** | **Bootstrap 5.3 + SCSS** | Modular design tokens, custom micro-animations & icons |
| **HTTP Client** | **Axios 1.7+** | Centralized API client with interceptors and fallbacks |
| **Backend Framework** | **Django 5.x / 5.2 LTS** | Enterprise Python web framework with modular architecture |
| **REST API** | **Django REST Framework** | Serializers, ViewSets, and CORS-enabled endpoints |
| **Runtime** | **Node.js 22 LTS / Python 3.12+** | High performance modern runtime environments |


 

## 📁 Project Architecture & Folder Structure

```
Prestodental_Website/
│
├── config/                          # Django Root Settings & Routing
│   ├── settings.py                  # App definitions, CORS, DRF, & WhiteNoise config
│   ├── urls.py                      # Root URL dispatcher routing /api/ and admin
│   ├── wsgi.py                      # Production WSGI server entry
│   └── asgi.py                      # Modern ASGI server entry
│
├── prestodental/                    # Backend Application
│   ├── api/                         # Django REST Framework API Layer
│   │   ├── __init__.py              # API package initializer
│   │   ├── serializers.py           # Serializers (Product, Category, Showcase, Stats)
│   │   ├── views.py                 # REST API Views with search & category filtering
│   │   └── urls.py                  # API endpoints (/api/categories/, /api/products/...)
│   ├── views/                       # Legacy Template Views (Preserved for fallback)
│   ├── models.py                    # Data Models
│   └── apps.py                      # Application Configuration
│
├── frontend/                        # Modern React 19 + TypeScript + Vite Application
│   ├── index.html                   # HTML entry with Google Fonts (Manrope & Sora)
│   ├── vite.config.ts               # Vite configuration with proxy to Django /api/
│   ├── tsconfig.json                # Strict TypeScript configuration
│   ├── package.json                 # Dependencies (React 19, Bootstrap 5, Axios, etc.)
│   └── src/
│       ├── main.tsx                 # React DOM bootstrap entrypoint
│       ├── App.tsx                  # Master routing, layout & provider tree
│       ├── index.scss               # Master SCSS design system (Bootstrap 5 + Tokens)
│       ├── types/                   # TypeScript interfaces
│       │   └── index.ts             # Product, Category, Showcase, Cart & Stats types
│       ├── context/                 # Reactive Global State
│       │   ├── CartContext.tsx      # Shopping Cart with LocalStorage persistence
│       │   └── ToastContext.tsx     # Dynamic Toast feedback alerts
│       ├── services/                # API Services
│       │   ├── api.ts               # Configured Axios instance
│       │   └── dentalService.ts     # Typed calls for Products, Categories, Stats & Auth
│       ├── components/              # Modular & Well-Commented UI Components
│       │   ├── layout/
│       │   │   ├── Header.tsx       # Sticky navbar, Search box, Cart badge, Mobile drawer
│       │   │   └── Footer.tsx       # Multi-column footer, trust pills, Back-to-top
│       │   ├── common/
│       │   │   ├── ProductCard.tsx  # Product item with wishlist & cart trigger
│       │   │   └── Toast.tsx        # Floating notification toast
│       │   └── home/
│       │       ├── HeroSlider.tsx   # 3-Slide dynamic hero with animated progress bars
│       │       ├── CategoryGrid.tsx # 6 Catalog specialty cards with hover animations
│       │       ├── ProductCatalog.tsx # Featured items with category filter tabs
│       │       ├── ShowcaseCards.tsx  # Why PrestoDental compact cards
│       │       ├── SuperendoBrand.tsx # Superendo precision endodontics showcase
│       │       └── AboutSection.tsx # 3-Slide auto about card with dot pagination
│       └── pages/                   # Application Routed Views
│           ├── HomePage.tsx         # Main PrestoDental storefront page
│           ├── AdminLoginPage.tsx   # Administrator authentication portal
│           ├── AdminDashboardPage.tsx # Admin dashboard with status & KPI metrics
│           └── NotFoundPage.tsx     # 404 handler
│
├── static/                          # Django Static Assets (Images, SCSS, CSS)
├── templates/                       # Django Templates
├── requirements.txt                 # Python dependencies
└── manage.py                        # Django management script
```

---

## ⚡ Getting Started (Running Locally)

### 1. Start the Django Backend API
```bash
# In the root project directory:
# Activate your Python virtual environment (e.g. .\venv\Scripts\activate on Windows)
python manage.py runserver
```
The Django REST API will be active at: `http://127.0.0.1:8000/api/`

---

### 2. Start the React Frontend (Vite)
```bash
# Open a new terminal and navigate to the frontend directory:
cd frontend

# Run the development server:
npm run dev
```
Open your browser at: `http://localhost:5173/`

---

## 🌐 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/categories/` | `GET` | Returns list of all 6 dental specialty categories |
| `/api/products/` | `GET` | Returns product catalog with optional query filters (`?category=...&search=...&spotlight=true/false`) |
| `/api/showcase/` | `GET` | Returns 'Why PrestoDental' value proposition cards |
| `/api/stats/` | `GET` | Returns live administrator dashboard metrics and status |
| `/api/auth/login/` | `POST` | Validates administrator login credentials |

---

## 📦 Production Build

To build the React 19 application for production:
```bash
cd frontend
npm run build
```
This produces an optimized production bundle in `frontend/dist/` ready to be served by Django WhiteNoise, Nginx, or any cloud host (Vercel, Netlify, AWS S3 / CloudFront).
