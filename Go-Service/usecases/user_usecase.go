package usecases

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/zanut/TodoList/Go-Service/entities"
	"github.com/zanut/TodoList/Go-Service/repositories"
	"golang.org/x/crypto/bcrypt"
)

type UserUsecase struct {
	Repo      *repositories.UserRepository
	JWTSecret string
}

func (u *UserUsecase) SignUp(user *entities.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return u.Repo.Create(user)
}

func (u *UserUsecase) Login(username, password string) (string, error) {
	user, err := u.Repo.FindByUsername(username)
	if err != nil || user == nil {
		return "", errors.New("invalid credentials")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})
	return token.SignedString([]byte(u.JWTSecret))
}
