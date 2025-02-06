# 🔗 Jotter

The backend of the Jotter Storage Management System is designed for efficient and secure file storage management. Using TypeScript, Express.js, and MongoDB, it ensures scalable storage solutions with seamless file handling. The system follows the MVC pattern, offering clean, maintainable code architecture while providing smooth integration for file uploads, access control, and user management.

---

## **Technologies Used**

- **TypeScript:** Ensures type safety and improved code maintainability.
- **Express.js:** Minimal and flexible Node.js web framework.
- **MongoDB:** Reliable, scalable NoSQL database management.

---

## **Features**

### **User Management**

- **Authentication:** Secure JWT-based login and signup.

---

## **Project Structure - MVC Pattern**

```
City Computer Backend
├── src
│   ├── app
│   │   ├── modules
│   │   │   ├── controllers
│   │   │   ├── models
│   │   │   ├── services
│   │   │   ├── routes
│   │   └── app.ts
├── .env.example
├── package.json
└── tsconfig.json
```

### **Controllers:** Handle requests and responses.

### **Models:** Define data schemas using Prisma.

### **Services:** Implement business logic.

### **Routes:** Connect endpoints with controllers.

---

## **Getting Started**

### **Prerequisites**

- Node.js
- Yarn
- Mongoose

### **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/naimuddin94/jotter.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd jotter/backend
   ```

3. **Install dependencies:**

   ```bash
   yarn install
   ```

4. **Set environment variables:**
   Create a `.env` file in the root directory based on `.env.example`.

5. **Start the development server:**

   ```bash
   yarn dev
   ```

6. **Build the project:**
   ```bash
   yarn build
   ```

---

## **API Documentation**

Detailed API documentation is available through Postman. It includes endpoints, request formats, and response structures.

[![Postman Docs](https://img.shields.io/badge/Postman-API_Docs-orange?style=for-the-badge&logo=postman)](https://documenter.getpostman.com/view/34122341/2sAYX8H12F)

---