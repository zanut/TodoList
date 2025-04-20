package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"

	"github.com/zanut/TodoList/Go-Service/usecases"
	"github.com/zanut/TodoList/Go-Service/entities"
)

func SignUp(usecases *usecases.UserUsecase) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user entities.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := usecases.SignUp(&user); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
	}
}

func Login(usecases *usecases.UserUsecase) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input entities.User
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		token, err := usecases.Login(input.Username, input.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}
