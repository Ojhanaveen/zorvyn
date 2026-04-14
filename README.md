# Finma Finance 🚀

A premium, role-based financial management engine designed for high-performance data tracking, deep-dive analytics, and secure organizational management.

## ✨ Core Features

### 🔒 Enterprise-Grade RBAC (Role-Based Access Control)
- **Granular Permissions**:
  - **Viewer**: Authorized to visualize **Dashboard Overview**, high-level summaries, and financial trends.
  - **Analyst**: Full access to **Dashboard**, **Transaction Logs**, and **Advanced Analytics**.
  - **Admin**: Full system control including **User Management**, **CRUD** on all financial records, and **Account Status** toggling.

### 🛡️ Access Control Matrix

| Feature | **Viewer** | **Analyst** | **Admin** |
| :--- | :---: | :---: | :---: |
| **Dashboard Overview** | ✅ View | ✅ View | ✅ View |
| **Financial Trends/Charts** | ✅ View | ✅ View | ✅ View |
| **Transaction Logs** | ❌ Blocked | ✅ View | ✅ CRUD |
| **Advanced Analytics** | ❌ Blocked | ✅ View | ✅ View |
| **User & Access Panel** | ❌ Blocked | ❌ Blocked | ✅ CRUD |

### 📊 Advanced Financial Engine
- **Full Ledger Management**: High-fidelity transaction tracking with support for amounts, categories, notes, and creator attribution.
- **Real-Time Data Intelligence**:
  - **Debounced Search**: Institutional-grade search across categories and descriptions.
  - **Multi-Level Filtering**: Analyze data by Type (Income/Expense), Date Range, and Category.
- **Data Integrity**: Backend-enforced validation via Joi and protected API endpoints.

### 📈 Interactive Dashboards & Analytics
- **Executive Summary**: Real-time aggregation of Total Income, Expenses, and Net Balance.
- **Trend Analysis**: 6-month historical cash flow visualization using **Recharts Area Charts**.
- **Spending Breakdown**: Categorical expense distribution via interactive Pie Charts.
- **Financial Health**: Automated calculation of Savings Rates and Transaction Velocity.

### 🎨 Premium UI/UX
- **Collapsible Sidebar**: A fluid, animated sidebar with an "Icon Only" mode to maximize workspace real estate.
- **Rich Aesthetics**: Modern design system utilizing Tailwind CSS, featuring smooth transitions, glassmorphism effects, and a responsive mobile-first grid.

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Recharts, Lucide Icons, Tailwind CSS |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB (Mongoose ODM) |
| **Security** | JWT, Joi Validation, Helmet, CORS Hardening, Mongo-Sanitize |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or Local Instance

### Installation
1. **Clone the repository**
2. **Setup Environment**: Create a `.env` in the root and backend folders.
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
3. **Install Dependencies**:
   ```bash
   # Root
   npm install
   # Backend
   cd backend && npm install
   # Frontend
   cd ../frontend && npm install
   ```
4. **Seed the Database**:
   ```bash
   cd backend/scripts
   node createAdmin.js
   node seedFinance.js
   ```
5. **Run Development Server**:
   ```bash
   # Both in their respective folders
   npm run dev
   ```

## 🛡️ Security Architecture
- **JWT Auth**: HttpOnly compatible token strategy.
- **Regex Protection**: Backend guards against NoSQL injection.
- **Strict Gating**: Middleware-enforced role checks on every non-public API endpoint.
