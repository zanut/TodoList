package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

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

	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Welcome to Todo API!"})
	})

	r.POST("/signup", handlers.SignUp(db))
	r.POST("/login", handlers.Login(db))
	
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