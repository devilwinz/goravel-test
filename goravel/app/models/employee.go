package models

import (
	"github.com/goravel/framework/database/orm"
)

type Employee struct {
	orm.Model
	Name string `form:"name" json:"name" validate:"required|max:255"`
}
