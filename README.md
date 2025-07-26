# Digital Invoicing Clean Architecture Backend

## **Overview**

This is the backend of the **Digital Invoicing Clean Architecture** project, built using **NestJS** with **Prisma ORM**. The project follows a **modular and scalable clean architecture**, ensuring maintainability and extensibility.

## **Getting Started**

### **1. Clone the Repository**

```sh
git clone https://github.com/your-repo/digital-invoicing-clean-architecture.git
cd digital-invoicing-clean-architecture
```

### **2. Install Dependencies**

```sh
npm install
```

### **3. Set Up Environment Variables**

Create a `.env` file in the root directory and configure the following:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/digital_invoicing
JWT_SECRET=your_jwt_secret
PORT=3000
```

### **4. Run Database Migrations**

```sh
npx prisma migrate dev --name init
```

### **5. Seed the Database**

To populate the database with initial data:

```sh
npm run seed
```

### **6. Start the Server**

#### Development Mode:

```sh
npm run start:dev
```

#### Production Mode:

```sh
npm run build && npm run start:prod
```

---

## **Adding a New Module**

If you need to add a new module to the project, follow these steps:

1. **Create a new module using NestJS CLI:**

    ```sh
    npx nest generate module <ModuleName>
    ```

2. **Generate required components:**

    - Generate a controller:
        ```sh
        npx nest generate controller adapters/controllers/<ModuleName>
        ```
    - Generate a service:
        ```sh
        npx nest generate service application/services/<ModuleName>
        ```
    - Generate use cases:
        ```sh
        mkdir -p src/application/use-cases/<ModuleName>
        ```

3. **Define the database schema (if applicable)** in `prisma/schema.prisma` and run migrations:

    ```sh
    npx prisma migrate dev --name <ModuleName>
    ```

4. **Implement business logic**

    - Define entities inside `src/domain/entities/`.
    - Create DTOs inside `src/application/dtos/`.
    - Implement repository interfaces inside `src/domain/interfaces/`.
    - Implement use-cases inside `src/application/use-cases/<ModuleName>/`.

5. **Update Dependency Injection (DI)**

    - Register your service inside the newly created module.
    - If repositories are involved, add them to `repositories.module.ts`.

6. **Secure API Endpoints (if needed)**

    - Use guards from `src/adapters/guards/` for authentication and role-based access.
    - Apply `JwtAuthGuard` and `RolesGuard` where necessary.

7. **Integrate Logger**

    - Use the global logger (`Winston`) for structured logging.
    - Found in `common/logger/`.
    - Example:
        ```ts
        import { Logger } from 'common/logger/logger.service';
        private readonly logger = new Logger(SomeService.name);
        ```

8. **Use Global Response DTO**

    - Standardize API responses using `GlobalResponseDTO`.
    - Example:
        ```ts
        return new GlobalResponse(true, "Operation successful", data);
        ```

9. **Test Your Module**

    - Write unit tests in `test/`.
    - Run tests:
        ```sh
        npm run test
        ```

10. **Document Your API**

- Use Swagger decorators to document endpoints.
- Verify documentation at `http://localhost:3000/api`.

11. **Commit and Push Your Changes**

- Ensure your code passes lint checks:
    ```sh
    npm run lint
    ```
- Run pre-commit checks:
    ```sh
    git add .
    git commit -m "feat: added <ModuleName> module"
    ```
- Push your branch and create a pull request.

---

## **Contributing**

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes following conventional commits.
4. Push to the branch and create a pull request.

---
