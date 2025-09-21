# Sakila Webapp (Node.js + MySQL, SSR, Callbacks)

A full-stack **movie rental system** built with **Node.js**, **Express.js**, and the official **Sakila MySQL sample database**.  
The app demonstrates **server-side rendering (EJS)**, **repository-based data access**, and both **customer & staff management**.

## ✨ Features
- **Film CRUD** – list, create, update, delete movies.
- **Customer registration & login** with hashed passwords.
- **Staff onboarding & invites** with role support (admin, manager).
- **Rental management** – track movie rentals with staff/customer associations.
- **Bootstrap 5 styling** for forms and layouts.
- **Form validation** on both client (JS) and server (Express).
- **Error handling** with friendly UI feedback.

## 🔧 Technologies
- **Backend**: Node.js, Express.js
- **Frontend**: EJS, Bootstrap 5, custom JS
- **Database**: MySQL (Sakila schema), Repository/DAO pattern
- **Auth**: Session-based login for staff/customers
- **Deployment**: Docker, Docker Compose, GitHub Actions (CI/CD), Nginx reverse proxy
- **Testing**:
  - Unit & integration tests (Node + Jest/Mocha)
  - End-to-end UI tests (Cypress)

## 🚀 Prerequisites
- Docker & Docker Compose (or Portainer Stack)
- MySQL initialized with the **Sakila sample DB**
  - Download from MySQL official site and place in `src/db/`:
    - `sakila-testing.sql`

## ⚙️ Setup

### 1. Configure Environment
create and update .env:
```env
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=sakila
