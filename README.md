# 📒 KhataBook – Business Account Manager

A simple, fully client-side business management web app to track income, expenses, loans, and customers — all in one place. No server or installation required.

---

## 🚀 Getting Started

1. Download or clone this project
2. Open `index.html` in any modern browser
3. Register a new account and start managing your business

> ⚠️ All data is stored in your browser's **localStorage**. Clearing browser data will erase all records.

---

## 📁 Project Structure

```
Khata-Book/
├── index.html          # Login & Registration page
├── dashboard.html      # Main dashboard with stats & charts
├── transactions.html   # Income & Expense management
├── loans.html          # Loan tracking (given / taken)
├── customers.html      # Customer directory
├── styles.css          # All shared styles
└── app.js              # Auth, localStorage helpers, utilities
```

---

## ✨ Features

### 🔐 Authentication
- Register with name, email, and password
- Login with email & password validation
- Session persisted via localStorage
- All pages are protected — auto-redirect to login if not authenticated
- Logout from any page via the sidebar

### 📊 Dashboard
- Summary stats: Total Income, Total Expenses, Net Balance, Pending Loans, Customer Count
- **Bar chart** — Monthly Income vs Expenses (last 6 months)
- **Doughnut chart** — Expense breakdown by category
- Recent transactions table with quick link to view all

### 💰 Transactions
- Add, edit, and delete income or expense entries
- Fields: Type, Description, Category, Amount, Date, Note
- Categories: Salary, Business, Freelance, Rent, Food, Transport, Utilities, Medical, Shopping, Entertainment, Other
- Filter by type (income/expense), month, or keyword search
- **Line chart** showing monthly income vs expense trend
- Running totals: Total Income, Total Expenses, Net Balance, Transaction Count

### 🏦 Loans
- Track money you **gave** (lent) and money you **took** (borrowed)
- Fields: Person Name, Phone, Amount, Amount Paid, Loan Date, Due Date, Note
- Record partial or full payments with the 💳 Pay button
- Automatic status: `Pending`, `Partial`, `Paid`
- Overdue detection — highlights loans past their due date with ⚠️
- Stats: Total to Receive, Total to Pay, Total Loans, Overdue Count
- Filter by status and loan direction

### 👥 Customers
- Add customers with name, phone, email, address, and opening balance
- Balance type: **Credit** (customer owes you) or **Debit** (you owe customer)
- Card-based layout with avatar initials
- Click any card to view full customer details including linked loan history
- Search by name or phone, sort by name / date / balance
- Stats: Total Customers, Total Receivable, Total Payable

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling, layout, responsive design |
| Vanilla JavaScript | Logic, DOM manipulation, routing |
| [Chart.js](https://www.chartjs.org/) | Bar, Line, and Doughnut charts |
| localStorage | Client-side data persistence |

> No frameworks, no build tools, no dependencies to install.

---

## 📸 Pages Overview

| Page | URL | Description |
|---|---|---|
| Login / Register | `index.html` | Entry point for all users |
| Dashboard | `dashboard.html` | Overview of business health |
| Transactions | `transactions.html` | Manage income & expenses |
| Loans | `loans.html` | Track lending & borrowing |
| Customers | `customers.html` | Manage customer records |

---

## 📱 Responsive Design

The app is responsive and works on:
- 🖥️ Desktop
- 💻 Laptop
- 📱 Mobile (sidebar collapses to icon-only mode)

---

## ⚙️ How Data is Stored

All data is saved in the browser's `localStorage` under these keys:

| Key | Description |
|---|---|
| `users` | Array of registered user accounts |
| `currentUser` | Currently logged-in user object |
| `transactions` | Array of income/expense records |
| `loans` | Array of loan records |
| `customers` | Array of customer records |

---

## 🔒 Notes & Limitations

- Data is **browser-specific** — data won't sync across devices or browsers
- Passwords are stored in plain text in localStorage — not suitable for production use
- No backend or database — purely frontend
- Clearing browser cache/localStorage will delete all data

---

## 📄 License

This project is open source and free to use for personal or educational purposes.

---

> Built with ❤️ using plain HTML, CSS, and JavaScript — no frameworks needed.
