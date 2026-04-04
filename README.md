# 🏦 Zorvyn Finance: Secure Audit & Ledger System

**Backend Live URL:** [https://zorvyn-finance.onrender.com/](https://zorvyn-finance.onrender.com/)  
**Frontend Live URL:** [https://zorvyn-finance-frontend.onrender.com](https://zorvyn-finance-frontend.onrender.com)

---

## 🔑 Evaluation Access (Admin Terminal)
To evaluate the full administrative functionality, please use the pre-configured Master Account:
* **Email:** `admin@zorvyn.com`
* **Password:** `123456`

---

## 🚀 Requirement Implementation Mapping

### 1. User Authentication & Portal Access
* **Analyst Onboarding:** A dedicated **Registration Page** allows new analysts to join the terminal.
* **Secure Login:** The **Login Page** handles credential verification and issues a JWT token for session persistence.
* **Session Termination:** A prominent **Logout Button** is available to securely clear the local session and redirect the user back to the terminal gateway.

### 2. User and Role Management (RBAC)
The system implements a scalable 4-tier RBAC model. While the UI is optimized for the Admin and Analyst workflow, the MongoDB Atlas database is pre-configured for enterprise scaling:

| Role | Database Description | Current System Context |
| :--- | :--- | :--- |
| **Admin** | "Full system administration" | **Master Auth:** Oversees all users and the Global Ledger. |
| **Analyst** | "Manage financial entries" | **Data Entry:** Creates and manages their own specific records. |
| **Editor** | "Upload & manage records" | **Audit Ready:** Backend support for record modification. |
| **Viewer** | "Read financial records only" | **Observation:** Read-only access to summaries. |

### 3. Financial Records Management (CRUD & Filtering)
The **New Transaction** interface provides a detailed data entry terminal:
* **Input Fields:** Capture **Description**, **Amount**, **Type** (Income/Expense), and **Category**.
* **Categories:** Includes diverse options such as Income Sources, Variable Expenses, Fixed Costs, and others.
* **Transaction Ledger:** A robust "Transaction Legend" allows for granular filtering by **Type** (Income/Expense) and **Status** (Verified/Flagged).
* **Ownership-Based CRUD:** Analysts have full control to Create, Read, Update, and Delete the specific records they have authored.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new Analyst |
| **POST** | `/api/auth/login` | Authorize session and receive JWT |

### Financial Records
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/records` | Fetch all records (Filtered by role) |
| **POST** | `/api/records` | Create a new financial entry |
| **PUT** | `/api/records/:id` | Update an existing record |
| **DELETE** | `/api/records/:id` | Remove a record (Owner or Admin only) |

### Admin & Insights
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/admin/users` | (Admin Only) View all registered analysts |
| **GET** | `/api/records/summary` | Fetch aggregated totals (Income/Expense/Net) |

---

## ⚙️ Environment Variables
Create a `.env` file in the **backend** directory:

```plaintext
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_string
NODE_ENV=production

---

## 💻 Local Development

### 1. Backend Setup
```bash
cd backend
npm install
node server.js

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev

---

## 🚀 **DEPLOYMENT STRATEGY**

> **The application follows a decoupled architecture, deployed on Render as two separate, secure services:**

* **Vite-React Frontend:** Deployed as a **Static Site** with routing redirects to `index.html` to support client-side navigation.
* **Node.js Backend:** Deployed as a **Web Service**, communicating via a secure **REST API** with custom **CORS** configurations to authorize the frontend origin.

---

## 🧠 **INTERVIEW EXPLANATION**

**This project demonstrates high-level proficiency in:**

* **Full-stack Architecture:** Seamless integration and state management between a **React frontend** and a **Node.js/Express backend**.
* **Complex Data Modeling:** Leveraging the **MongoDB Aggregation Pipeline** to serve real-time financial summaries and category-wise totals.
* **Security First:** Implementation of **JWT-based authentication** and **Role-Based Access Control (RBAC)** to safeguard sensitive financial data.
* **Cloud Infrastructure:** Successful configuration of production environments, including environment variable management and **CORS policy enforcement** on Render.

---

**Project developed by Maitree Jaiswal — 2026**
