package handlers

import (
	"net/http"
	"strconv"
	
	"github.com/gin-gonic/gin"
	"github.com/zanut/TodoList/Go-Service/usecases"
	"github.com/zanut/TodoList/Go-Service/entities"
)

func GetTodos(usecase *usecases.TodoUsecase) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Retrieve the user ID from the JWT claims
		userID := c.MustGet("user_id").(float64)

		// Call the usecase to get todos for the user
		todos, err := usecase.GetTodos(uint(userID))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Respond with the list of todos
		c.JSON(http.StatusOK, todos)
	}
}

func CreateTodo(usecase *usecases.TodoUsecase) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Bind the incoming JSON to the Todo struct
		var todo entities.Todo
		if err := c.ShouldBindJSON(&todo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Retrieve the user ID from the JWT claims
		userID := c.MustGet("user_id").(float64)
		todo.UserID = uint(userID)
		if err := usecase.CreateTodo(&todo); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Respond with the created todo
		c.JSON(http.StatusCreated, todo)
	}
}

func UpdateTodo(usecase *usecases.TodoUsecase) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Bind the incoming JSON to the Todo struct
		var todo entities.Todo
		if err := c.ShouldBindJSON(&todo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		// Retrieve the ID from the URL parameter
		id := c.Param("id")

		// Convert the string ID to uint
		parsedID, err := strconv.ParseUint(id, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}
		
        // Assign the converted ID to the todo.ID field
		todo.ID = uint(parsedID)

		// Call the usecase to update the todo
		if err := usecase.UpdateTodo(&todo); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Respond with the updated todo
		c.JSON(http.StatusOK, todo)
	}
}

func DeleteTodo(usecase *usecases.TodoUsecase) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Retrieve the ID from the URL parameter
		id := c.Param("id")

		// Convert the string ID to uint
		parsedID, err := strconv.ParseUint(id, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}

		// Call the usecase to delete the todo
		if err := usecase.DeleteTodo(uint(parsedID)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusNoContent, nil)
	}
}
