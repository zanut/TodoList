package handlers

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"

	"github.com/zanut/TodoList/Go-Service/entities"
	"github.com/zanut/TodoList/Go-Service/config"
)

func SignUp(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var user entities.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		user.Password = string(hashedPassword)
		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
	}
}

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input entities.User
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var user entities.User
		db.Where("username = ?", input.Username).First(&user)
		if user.ID == 0 || bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)) != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		jwtSecret := config.GetEnv("JWT_SECRET", "your_secret_key")
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": user.ID,
			"exp":     time.Now().Add(time.Hour * 72).Unix(),
		})
		tokenString, err := token.SignedString([]byte(jwtSecret))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": tokenString})
	}
}