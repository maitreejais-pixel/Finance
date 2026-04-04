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
* **Analyst Onboarding:** A dedicated **Registration Page** allows new analysts to join the terminal. Upon registration, users are assigned the 'Analyst' role by default.
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

### 3. Dashboard Summary & Aggregation
The backend uses **MongoDB Aggregation Pipelines** to provide real-time financial intelligence:
* **Total Income / Total Expenses:** Summed dynamically across all records.
* **Net Balance:** Real-time liquidity calculation.
* **Category-wise Totals:** Visual breakdown of spending/earning habits.
* **Automated Flagging:** High-value transactions (>$50,000) are automatically flagged for Admin audit.

### 4. Access Control Logic
Access control is enforced at the API level using custom middleware:
* **Validation:** Every request is checked against a JWT token.
* **Permission Guards:** The backend verifies if the `user.role` has the required permissions (e.g., `records:delete`) before execution.
* **UI Hardening:** The "Admin Terminal" and "Delete" buttons are conditionally rendered only for authorized roles.

### 5. Validation and Error Handling
* **Input Validation:** Ensures "Amount" is a valid number and required fields are not empty.
* **Status Codes:** Uses standard HTTP codes (e.g., 201 Created, 401 Unauthorized, 403 Forbidden).
* **Error Responses:** Provides clear, non-sensitive error messages like "Connection refused by Zorvyn Gateway" to guide the user without exposing system internals.

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

---

## 🛠️ Technical Stack
* **Frontend:** React.js, Tailwind CSS, Lucide Icons (Vite-based).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (NoSQL) with Mongoose modeling.
* **Deployment:** Fully optimized and hosted on **Render**.

---

## ⚙️ Environment Variables
Create a `.env` file in the **backend** directory:

```plaintext
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_string
NODE_ENV=production
```

---

## 💻 Local Development

### Backend

```
cd backend
npm install
node server.js
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

*The application follows a decoupled architecture, deployed on Render as two separate, secure services:
*Vite-React Frontend: Deployed as a Static Site with routing redirects to index.html to support client-side navigation.
*Node.js Backend: Deployed as a Web Service, communicating via a secure REST API with custom CORS configurations to authorize the frontend origin.

---

## 💡 📝 Design Assumptions & Trade-offs
*Analyst Autonomy: Analysts are granted the ability to delete their own records to ensure they can fix data entry errors without requiring Admin intervention.
*Enterprise Readiness: The Viewer and Editor roles are already modeled in the database, allowing for immediate UI activation without backend structural changes.
*Cloud Strategy: Chose MongoDB Atlas over a local store to demonstrate real-world cloud connection handling.

 ---


## 🧠 Interview Explanation

This project demonstrates:
*This project demonstrates high-level proficiency in:
*Full-stack Architecture: Seamless integration and state management between a React frontend and a Node.js/Express backend.
*Complex Data Modeling: Leveraging the MongoDB Aggregation Pipeline to serve real-time financial summaries and category-wise totals.
*Security First: Implementation of JWT-based authentication and Role-Based Access Control (RBAC) to safeguard sensitive financial data.
*Cloud Infrastructure: Successful configuration of production environments, including environment variable management and CORS policy enforcement on Render.

---

Project developed by Maitree Jaiswal — 2026
