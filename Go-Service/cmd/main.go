package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"github.com/gin-contrib/cors"

	"github.com/zanut/TodoList/Go-Service/config"
	"github.com/zanut/TodoList/Go-Service/entities"
	"github.com/zanut/TodoList/Go-Service/handlers"
	"github.com/zanut/TodoList/Go-Service/middleware"
	"github.com/zanut/TodoList/Go-Service/repositories"
	"github.com/zanut/TodoList/Go-Service/usecases"
)


func main() {
	config.LoadEnv()
	dbPath := config.GetEnv("DB_PATH", "todo.db")
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	db.AutoMigrate(&entities.Todo{}, &entities.User{})

	todoRepo := &repositories.TodoRepository{DB: db}
	todoUsecase := &usecases.TodoUsecase{Repo: todoRepo}
	repo := &repositories.UserRepository{DB: db}
	userUsecase := &usecases.UserUsecase{Repo: repo, JWTSecret: config.GetEnv("JWT_SECRET", "your_secret_key")}


	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{config.GetEnv("ALLOW_URL", "*")},
		AllowMethods:     []string{"POST", "GET", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
	  }))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Welcome to Todo API!"})
	})

	r.POST("/signup", handlers.SignUp(userUsecase))
	r.POST("/login", handlers.Login(userUsecase))
	
	todoRoutes := r.Group("/todos")
	todoRoutes.Use(middleware.JWTAuthMiddleware())
	{
		todoRoutes.GET("", handlers.GetTodos(todoUsecase))
		todoRoutes.POST("", handlers.CreateTodo(todoUsecase))
		todoRoutes.PUT(":id", handlers.UpdateTodo(todoUsecase))
		todoRoutes.DELETE(":id", handlers.DeleteTodo(todoUsecase))
	}

	r.Run(":8080")
}