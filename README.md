# 📝 Todo App Backend

A simple Todo App backend built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.  
It includes user authentication, session handling, and CRUD operations for todos.

---

## 📦 Tech Stack

- Node.js + Express
- TypeScript
- MongoDB
- Docker + Docker Compose
- Joi (Validation)
- bcrypt (Password hashing)
- JWT (Authentication)

---

## 🔧 Project Structure

```

src/
│
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── routes/
├── error/
├── dto/
└── models/

````

---

## 🚀 Getting Started

### 🔹 Prerequisites

- Node.js (v18+)
- npm
- MongoDB (local or cloud)

---

## 🔄 Running Locally (Without Docker)

### 1. Clone the Repo

```bash
git clone https://github.com/TalhaAhsanSh/Sample-Todo-App.git
cd Sample-Todo-App
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup `.env`

Create a `.env` file in the root directory:

### 4. Run the Project

* **Development Mode** (with hot reload):

```bash
npm run dev
```

* **Build** the project:

```bash
npm run build
```

* **Run Built App**:

```bash
npm start
```

* **Run Built App with Watcher**:

```bash
npm run start:watch
```

---

## 🐳 Running with Docker

### 1. Build and Start Containers

```bash
docker-compose up --build
```

This will:

* Build and run the backend app
* Start a MongoDB container
* Connect them on the same network

### 2. Environment Configuration

Ensure your `.env` file has:

```env
PORT=PORT
MONGODB_URI=MONGODB_URI
```

> The `mongo` in the URI matches the Mongo service name in `docker-compose.yml`.

### 3. Access the API

Once running, the API will be available at:

```
http://localhost:8000
```

---

## 📫 API Endpoints (Basic)

| Method | Route     | Description              |
| ------ | --------- | ------------------------ |
| POST   | `/signup` | Register a new user      |
| POST   | `/login`  | Login and create session |
| POST   | `/logout` | Logout user              |
| GET    | `/me`     | Get current user info    |
| POST   | `/task`   | Create a todo            |
| ...    | ...       | More to be added         |

---

## 🧪 Testing API

Use **Postman**, **Thunder Client**, or **cURL** to test the API endpoints.
Remember to pass the **Authorization Bearer Token** for protected routes.

---

## 🧼 Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "start:watch": "nodemon dist/server.js"
}
```

---

