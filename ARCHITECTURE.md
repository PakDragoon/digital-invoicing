# Architecture Overview

## Project Structure

The **Digital Invoicing Clean Architecture** project follows a modular and scalable clean architecture approach using **NestJS**. The structure is designed to separate concerns, enhance maintainability, and ensure testability.

### **Folder Structure**

```plaintext
src/
├── adapters/                # Controllers, Guards, and Strategies
│   ├── controllers/        # API Endpoints (e.g., AuthController, DealershipController)
│   ├── guards/             # Auth and Role-based Guards
│   ├── strategies/         # Authentication Strategies
├── application/            # DTOs, Use Cases, and Services
│   ├── dtos/               # Data Transfer Objects (DTOs)
│   ├── use-cases/          # Business Logic & Application Rules
│   ├── services/           # Shared Services (e.g., AuthService, JWT Service)
├── domain/                 # Entities, Interfaces, and Factories
│   ├── entities/           # Database Entities (e.g., Admin, Employee, Dealership)
│   ├── factory/            # Entity Factories
│   ├── interfaces/         # Repository Interfaces
├── infrastructure/         # Prisma ORM and Repositories
│   ├── orm/                # Prisma Repositories
│   ├── repositories.module.ts # Repository Module for DI
├── common/                 # Shared utilities, filters, and decorators
│   ├── filters/            # Exception Filters
│   ├── security/           # Security Middleware
│   ├── constants/          # Global Constants
├── prisma/                 # Database Migrations & Seeders
│   ├── seed.ts             # Database Seed Script
│   ├── schema.prisma       # Prisma ORM Schema
├── test/                   # Unit and E2E Tests
│   ├── jest-e2e.json       # Jest E2E Configuration
```

---

## **Core Concepts**

### **1. Dependency Injection & Modularity**

- The project heavily utilizes NestJS **Dependency Injection** (DI) to manage services and repositories.
- Each module (e.g., `AuthModule`, `DealershipModule`) is self-contained and can be plugged in independently.
- Repository pattern is implemented to abstract database access.

### **2. Prisma ORM for Database Management**

- The project uses **Prisma ORM** for database interactions.
- Migrations are managed through Prisma CLI.
- The **Repositories Module** is responsible for handling database access.

### **3. Authentication & Security**

- JWT-based authentication using **@nestjs/jwt**.
- **RBAC (Role-Based Access Control)** is implemented using guards and decorators.
- API security enhancements such as **guards, encryption, and validation**.

### **4. Code Quality & Development Tools**

- **Husky** ensures code quality by running pre-commit hooks.
- **Lint-staged** runs ESLint and Prettier on staged files.
- **Jest** is used for unit and end-to-end testing.

### **5. Database Seeding & Reset**

- **Seeding Command:** `npm run seed`
    - This command runs the `prisma/seed.ts` script to populate the database with initial data.
- **Reset Database:** `npm run reset-db`
    - This will **drop all tables**, apply migrations, and seed the database again.

### **6. API Documentation**

- Swagger UI is set up for API documentation using `@nestjs/swagger`.
- Available at `/api` endpoint.

---

## **Deployment & CI/CD**

- The backend is designed to be **cloud-agnostic** (can be deployed on AWS, DigitalOcean, or Heroku).
- CI/CD pipeline can be configured using **GitHub Actions** or **Jenkins**.
- Prisma migrations should be run in the deployment pipeline to ensure database schema consistency.
