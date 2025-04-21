# 📝 TodoList App

A full-stack Todo List application built with **React + Vite** (frontend) and **Go** (backend).  
This app allows users to sign up, log in, and manage their todos securely.

---

## 📁 Technology Stack

### Frontend
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [React](https://reactjs.org/)
- **Build tool**: [Vite](https://vitejs.dev/)
- **HTTP client**: [Axios](https://axios-http.com/)

### Backend
- **Language**: [Go](https://go.dev/dl/)
- **Web Framework**: [Gin Gonic](github.com/gin-gonic/gin) 
- **Database**: [SQLite](https://www.sqlite.org/index.html)
- **ORM**: [GORM](https://gorm.io/)
- **JWT**: [Golang-JWT](github.com/golang-jwt/jwt/v5)
- **Hashing**: [Bcrypt](https://pkg.go.dev/golang.org/x/crypto/bcrypt)
- **Environment Variables**: [godotenv](github.com/joho/godotenv)

## Database Schema
```sql

CREATE TABLE "todos" (
	"id"	integer,
	"title"	text,
	"description"	text,
	"status"	text,
	"user_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "users" (
	"id"	integer,
	"username"	text,
	"password"	text,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "uni_users_username" UNIQUE("username")
);

```

## 🏛️ Architecture

### Frontend (React + Vite)
-  The frontend is built with React and Vite, following a modular structure:
```
frontend/
├── src/
│   ├── api/           # Axios base instance or fetch config
│   ├── pages/         # All page components (e.g. Home, Login, Signup, Todos)
│   ├── actions.ts     # Functions that call API endpoints
│   ├── components/    # Reusable UI components (e.g. Navbar)
│   └── App.tsx        # Route definitions and main layout
```

### Backend (Go + Clean Architecture)
- The backend is built with Clean Architecture principles, ensuring strong separation of concerns:
```
Go-Service/
├── cmd/           # Application entry point (main.go)
├── config/        # Configuration files (if any)
├── entities/      # Data entities
├── handlers/      # HTTP route handlers
├── middleware/    # Authentication
├── repository/    # Database access layer (SQLite in this case)
└── usecases/      # Business logic

```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/todolist-app.git
```  
### 2. Setup .env file
```
# frontend env
VITE_API_URL={ backend url }

# backend env
# DB connection settings
DB_PATH={ Sqlite DB path }

# JWT settings
# https://jwtsecret.com/generate
JWT_SECRET={ Key Generated }

# Allow path 
ALLOW_URL={ * for allow all  }
```

### 3. Runing frontend service  
```
cd TodoList/frontend
npm install        # Install dependencies
npm run build      # Build the production-ready files
npm run preview    # Preview the built app (runs at http://localhost:4173)
```

### 4. Running Backend service

```
cd TodoList/Go-Service
go run cmd/main.go
```


## Code Explanation 

### Frontend (No Formal Architecture)

#### Centralized API Logic 
- All API calls are made in `actions.ts`, which is imported into the respective page components.


#### Using folder separation to stay organized.
- `api/` contains the Axios base instance or fetch config.
- `pages/` contains all page components (e.g. Home, Login, Signup, Todos).
- `components/` contains reusable UI components (e.g. Navbar).

Example of App.ts importing the pages and components:

```ts
// App.tsx
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Todos from "./pages/Todos/Todos";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Navbar from "./components/Navbar/navbar";

function App() {
  return (
   <div>
      <Navbar />
      <main>
        <div>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/signup" element={ <Signup /> } />
            <Route path="/todos" element={ <RequireAuth><Todos /></RequireAuth> } />
            <Route path="/about" element={ <About /> } />
          </Routes>
        </div>
      </main>
    </div>
  );
}
export default App;
```



---

### Backend (Clean Architecture)

```
Handler (Delivery Layer)
│
▼
Usecase (Business Logic Layer)
│
▼
Repository (Data Access Layer)
│
▼
Entity (Model)
```
  
### **🔄 Flow: Get Todos for a User**

#### 1. Handler (handlers/todo_handler.go)  
- Retrieves user_id from JWT claims  

- Calls the usecase: usecase.GetTodos(userID)  

- Returns JSON response with todos  

#### 2. Usecase (usecases/todo_usecase.go)
- Handles the business logic.

- Calls the repository: Repo.GetTodosByUserID(userID)

#### 3. Repository (repository/todo_repo.go)
- Executes DB query with GORM:
```go
DB.Where("user_id = ?", id).Find(&todos)
```
#### 4. Entity (entitys/todo.go)
- Defines the Todo struct model used throughout the app.

### Design Decisions
- Separation of concerns: Each layer has a single responsibility.

- Scalable: Easy to maintain, test, or swap out components (e.g., DB, framework).

- Clean: Business logic is decoupled from the delivery and database layers.