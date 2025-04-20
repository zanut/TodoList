package repositories

import (
	"gorm.io/gorm"

	"github.com/zanut/TodoList/Go-Service/entities"
)

type TodoRepository struct {
	DB *gorm.DB
}

func (r *TodoRepository) GetTodosByUserID(id uint) ([]entities.Todo, error) {
	var todos []entities.Todo
	err := r.DB.Where("user_id = ?", id).Find(&todos).Error
	if err != nil {
		return nil, err
	}
	return todos, nil
}

func (r *TodoRepository) CreateTodo(todo *entities.Todo) error {
	err := r.DB.Create(todo).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *TodoRepository) UpdateTodo(todo *entities.Todo) error {
	err := r.DB.Save(todo).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *TodoRepository) DeleteTodo(id uint) error {
	err := r.DB.Delete(&entities.Todo{}, id).Error
	if err != nil {
		return err
	}
	return nil
}