# Kharcha Mitra 🪙
> **"Track. Split. Understand."**

A complete, student-focused personal expense management, budgeting, and group-splitting web application built with React, Vite, Recharts, Lucide Icons, Express, and Qwen AI.

---

## 🌟 Key Features

1. **Dashboard**
   - **Monthly Budget Overview**: Visual progress bar tracking spending vs. budget target with dynamic status indicators (Green < 60%, Yellow 60-85%, Red > 85%).
   - **Key Metrics Cards**: Monthly Spending, Remaining Budget, Transaction Count, Top Spending Category.
   - **Category Spending Donut/Pie Chart**: Interactive Recharts breakdown by category (*Food, Transport, Education, Shopping, Entertainment, Bills, Other*).
   - **Recent Transactions**: Quick view of latest expenses with fast navigation to full expense management.

2. **Expense Management**
   - **Full CRUD**: Add, edit, delete, and view transactions.
   - **Search & Filter**: Real-time search by title, category filtering, and sorting (by Date Newest/Oldest, Amount High/Low).
   - **Validation**: Title required, amount must be > 0, category must be selected.
   - **Persistence**: Instant synchronization with `localStorage` updating charts and dashboard across the entire app.

3. **Splits & Groups**
   - **Group Management**: Create groups (e.g., Flatmates, Goa Trip, College Project) and add members.
   - **Shared Expenses**: Specify title, total amount, payer, and select who participated in the expense.
   - **Deterministic Settlements Algorithm**: Automatically calculates net balances and greedy settlement transactions (*who owes whom and exactly how much* in ₹).

4. **Insights**
   - **Category Breakdown**: Dynamic Bar Chart visualizing expenditure by category.
   - **Deterministic Spending Observations**: Automated rule-based insights:
     - Total spent and transaction count
     - Percentage of budget utilized
     - High-spending category alerts (categories exceeding 30% of total)
     - Budget threshold alerts (> 80% warning / < 50% praise)

5. **Kharcha AI (Powered by Qwen)**
   - Dedicated interactive AI financial assistant.
   - Quick prompts: *"Where am I overspending?"*, *"Give me a student budget plan"*, *"Summarize my expenses"*, etc.
   - Sends sanitized expense context, current budget, and group split info to the backend.
   - Backend interacts securely with Qwen through an OpenAI-compatible API without exposing credentials to the client.

6. **Settings & Data Management**
   - Update monthly budget target.
   - Granular data management with safety confirmation modals (Clear Expenses, Clear Groups, Reset All Data).
   - Reload demo data with a single click.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 6, JavaScript (ES Modules), CSS3 Variables & Responsive Design
- **Charts**: Recharts (PieChart, BarChart, ResponsiveContainer)
- **Icons**: Lucide React
- **Local Storage Layer**: Robust storage abstraction (`client/src/utils/storage.js`) with error handling
- **Backend**: Node.js, Express, CORS, Dotenv, OpenAI SDK (for Qwen API integration)

---

## 📁 Project Architecture

```
kharcha-mitra/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          # Proxies /api requests to Express (:8787)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # SPA routing & responsive sidebar layout
│       ├── styles.css          # Design system & dark theme variables
│       ├── components/
│       │   ├── Sidebar.jsx     # Desktop sidebar + mobile responsive drawer
│       │   ├── StatCard.jsx
│       │   ├── ChartCard.jsx
│       │   ├── Modal.jsx
│       │   ├── ExpenseForm.jsx # Add/edit expense with validation
│       │   ├── ExpenseList.jsx # Filtered & sorted expense cards
│       │   ├── GroupCard.jsx   # Shared expenses & settlement calculation
│       │   └── AIChat.jsx      # Chat UI with quick prompts
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Expenses.jsx
│       │   ├── SplitsGroups.jsx
│       │   ├── Insights.jsx
│       │   ├── KharchaAI.jsx
│       │   └── Settings.jsx
│       └── utils/
│           └── storage.js      # LocalStorage layer & settlement math
└── server/
    ├── package.json
    ├── index.js                # Express server with /api/health and /api/qwen
    ├── .env                    # Environment variables (API keys)
    ├── .env.example
    └── .gitignore
```

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js (v18+) and npm installed.

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
Backend runs on: `http://localhost:8787`

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🤖 Configuring Qwen AI

In `server/.env`:
```env
DASHSCOPE_API_KEY=YOUR_ACTUAL_DASHSCOPE_KEY
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
PORT=8787
```

*Note: The frontend never directly talks to DashScope / Alibaba Cloud. All AI requests pass securely through the Node.js Express server.*

---

## 📱 Mobile App & Android APK

Kharcha Mitra provides two ways to run on Android and smartphones:

### 1. Instant 1-Tap Smartphone Install (PWA / WebAPK)
- Ensure your phone and computer are on the same Wi-Fi.
- Open **`http://192.168.1.39:5173`** (or your local IP) in Google Chrome or Samsung Internet on your phone.
- Tap **⋮** &rarr; **"Install app"** or **"Add to Home screen"**.
- A native-feeling app with custom Kharcha Mitra icon will install on your phone's app drawer and home screen. It works offline and runs full-screen without browser address bars!

### 2. Native Android APK (Capacitor)
- The repository includes a full native Android project under `client/android/` configured with package ID `com.kharchamitra.app`.
- **Cloud Build via GitHub Actions**:
  - Push this repository to GitHub.
  - The workflow in `.github/workflows/build-apk.yml` runs automatically on GitHub's Ubuntu runners (equipped with Java 17 and full Android SDK) and outputs `KharchaMitra-debug.apk` as a downloadable artifact.
- **Local Gradle Build**:
  - Open terminal:
    ```bash
    cd client/android
    ./gradlew assembleDebug
    ```
  - The generated APK is located at:
    `client/android/app/build/outputs/apk/debug/app-debug.apk`
- **In-App Download**:
  - Visit the **"Get Mobile App"** tab in the sidebar navigation or visit `/api/download-apk` to directly download the APK.

