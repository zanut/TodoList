package entities

type Todo struct {
	ID     uint   		`gorm:"primaryKey" json:"id"`
	Title  string 		`json:"title"`
	Description string  `json:"description"`
	Status string 		`json:"status"` 	// "In Progress", "Done"
	UserID uint   		`json:"user_id"`
}
