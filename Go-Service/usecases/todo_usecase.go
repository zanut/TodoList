package usecases

import (
	"github.com/zanut/TodoList/Go-Service/entities"
	"github.com/zanut/TodoList/Go-Service/repositories"
)

type TodoUsecase struct {
	Repo *repositories.TodoRepository
}

func (u *TodoUsecase) GetTodos(userID uint) ([]entities.Todo, error) {
	return u.Repo.GetTodosByUserID(userID)
}

func (u *TodoUsecase) CreateTodo(todo *entities.Todo) error {
	return u.Repo.CreateTodo(todo)
}

func (u *TodoUsecase) UpdateTodo(todo *entities.Todo) error {
	return u.Repo.UpdateTodo(todo)
}

func (u *TodoUsecase) DeleteTodo(id uint) error {
	return u.Repo.DeleteTodo(id)
}
