# Kishi 🔐

A modern, secure, full-stack password manager built with **Spring Boot** and **React + TypeScript**, featuring **client-side zero-knowledge encryption**.

---

## 🌟 Features

- **Zero-Knowledge Client-Side Encryption**: Sensitive credentials are encrypted in the browser using AES-GCM and Web Crypto APIs before transmission. The server never sees plaintext passwords.
- **Secure Authentication**: Stateless authentication powered by Spring Security and JSON Web Tokens (JWT).
- **Vault Management**: Full CRUD operations for vault entries with categories, usernames, URLs, and passwords.
- **Password Generator**: Customizable password generator for creating strong, cryptographically secure passwords.
- **Security Dashboard**: Real-time password strength analysis, reused password detection, and security scores.
- **Privacy Controls**: Automatic vault locking on inactivity and clipboard auto-clearing.

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────┐
│     React + TypeScript + Vite   │  Client-Side Encryption (Web Crypto / AES-GCM)
└────────────────┬────────────────┘
                 │ HTTP / REST (JWT)
                 ▼
┌─────────────────────────────────┐
│   Spring Boot 3 (Java 21)       │  Spring Security, JWT Filter, Controllers & Services
└────────────────┬────────────────┘
                 │ JPA / Hibernate
                 ▼
┌─────────────────────────────────┐
│          PostgreSQL             │  Relational persistence for users & encrypted vault data
└─────────────────────────────────┘
```

- **Backend**:
  - Java 21
  - Spring Boot 3
  - Spring Security & JWT
  - PostgreSQL & Spring Data JPA / Hibernate
  - Maven
- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS

---

## 📁 Repository Structure

```
Kishi/
├── Backend/               # Spring Boot REST API
│   ├── src/               # Java source code and tests
│   ├── pom.xml            # Maven build configuration
│   └── src/main/resources/
│       ├── application.properties          # Main application configuration (reads env vars)
│       └── application-example.properties  # Example configuration template
│
└── Frontend/              # React + TypeScript single-page application
    ├── src/               # React components, contexts, hooks, and crypto utils
    ├── package.json       # Frontend dependencies
    └── .env.example       # Example frontend environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** or later
- **Maven 3.9+**
- **Node.js 18+** & **npm**
- **PostgreSQL 14+**

---

### 1. Database Setup

Ensure PostgreSQL is running and create a database named `kishi`:

```sql
CREATE DATABASE kishi;
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Configure environment variables (or export them in your shell):
   ```bash
   export DB_URL="jdbc:postgresql://localhost:5432/kishi"
   export DB_USERNAME="your_postgres_username"
   export DB_PASSWORD="your_postgres_password"
   export JWT_SECRET="your_secure_random_jwt_secret_key_at_least_256_bits"
   export JWT_EXPIRATION=3600000
   ```
   *(See `src/main/resources/application-example.properties` for a template).*

3. Run tests:
   ```bash
   mvn test
   ```

4. Start the backend server:
   ```bash
   mvn spring-boot:run
   ```
   The backend API runs at `http://localhost:8080`.

---

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend runs at `http://localhost:5173`.

---

## 🔒 Security Best Practices

- **Never commit `.env` files** or real credentials to Git.
- Keep `JWT_SECRET` long and random in production environments.
- Use HTTPS in production to protect all API communication.

---
