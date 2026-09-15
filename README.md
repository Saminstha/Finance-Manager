# 💰 Finance Manager

A full-stack personal finance management application built using the MERN stack. Finance Manager helps users manage their transactions, financial accounts, budgets, and savings goals while providing a dashboard for monitoring overall financial activity.

## 🚀 Live Demo

### 🌐 [Open Finance Manager](https://finance-manager-fe.onrender.com/)

The application is deployed on Render and can be accessed directly through the link above.

---

## 📌 Features

- 🔐 User registration and login
- 🔑 JWT-based authentication with access and refresh tokens
- 👤 User profile management
- 🔒 Secure password hashing using bcrypt
- 💸 Create, view, update, and delete transactions
- 🏦 Manage bank, cash, and digital wallet accounts
- 📊 Create and manage monthly budgets
- 📈 Track budget spending and remaining limits
- 💰 Create and manage savings goals
- 📊 Financial dashboard with summary cards
- 📅 Monthly income and expense analysis
- 🥧 Spending analysis by category
- 🔎 Search and filter transactions
- ✏️ Edit and delete financial records
- ✅ Request validation using Zod
- 🔄 Automatic access-token refresh
- 🛡️ Protected routes and user-specific financial data

---

## 🖥️ Application Overview

Finance Manager provides a centralized platform for managing personal finances.

The application includes the following main modules:

### 📊 Dashboard

The dashboard provides an overview of the user's financial situation, including:

- Total balance
- Total income
- Total expenses
- Total savings
- Monthly income and expense overview
- Spending by category
- Account balances
- Savings goals and progress
- Recent financial activity

---

### 💸 Transactions

The Transactions module allows users to manage their income and expenses.

Users can:

- Add new transactions
- Edit existing transactions
- Delete transactions
- Search transactions
- Filter by transaction type
- Filter by category
- Filter by account
- Filter by month
- Track income and expenses separately

Each transaction is associated with the authenticated user and a financial account.

---

### 🏦 Accounts

The Accounts module allows users to manage different sources of money, such as:

- Bank accounts
- Cash
- Digital wallets

Users can:

- Create accounts
- Edit accounts
- Delete accounts
- Track individual account balances
- View total balance across accounts

---

### 📊 Budgets

The Budgets module allows users to set monthly spending limits for different categories.

Users can:

- Create budgets
- Edit budgets
- Delete budgets
- Set monthly spending limits
- Monitor amount spent
- View remaining budget
- Track percentage of budget used

---

### 💰 Savings Goals

The Savings module allows users to create and manage financial savings goals.

Users can:

- Create savings goals
- Set target amounts
- Track current savings
- Monitor progress
- Update savings goals
- Delete savings goals

---

### 👤 User Profile

The application also provides user profile functionality.

Users can:

- View their profile
- Edit profile information
- Change their password
- Log out securely from the application

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Redux Toolkit
- React Router
- React Hook Form
- Axios
- Zod
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- TypeScript
- JSON Web Token (JWT)
- bcrypt
- Zod

### Database

- MongoDB
- Mongoose

### Deployment

- Render

---

## 🏗️ Project Architecture

The project follows a layered architecture where responsibilities are separated between routes, controllers, services, models, and validation.

```text
                         ┌─────────────────────┐
                         │      React Client   │
                         │     TypeScript      │
                         └──────────┬──────────┘
                                    │
                              HTTP / REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Express Server   │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
              Routes          Controllers       Middleware
                  │                 │                 │
                  │                 ▼                 │
                  │             Services              │
                  │                 │                 │
                  └─────────────────┼─────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Mongoose       │
                         │       Models        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       MongoDB       │
                         └─────────────────────┘
