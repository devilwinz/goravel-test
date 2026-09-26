package models

import (
	"github.com/goravel/framework/database/orm"
)

type Task struct {
	orm.Model
	EmployeeID 		uint   `gorm:"column:employee_id;type:int;not null"`
	Title	 		string `gorm:"column:title;type:varchar(255);not null"`
	Description 	string `gorm:"column:description;type:text;not null"`
	Status	 		string `gorm:"column:status;type:varchar(255);not null"`
	orm.SoftDeletes
}
