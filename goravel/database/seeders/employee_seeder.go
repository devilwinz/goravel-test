package seeders

import (
	"goravel/app/models"

	"github.com/goravel/framework/facades"
)

type EmployeeSeeder struct {
}

// Signature The name and signature of the seeder.
func (s *EmployeeSeeder) Signature() string {
	return "EmployeeSeeder"
}

// Run executes the seeder logic.
func (s *EmployeeSeeder) Run() error {
	var employee models.Employee
	employee.Name = "Tester"

	// Insert into the database
	return facades.Orm().Query().Create(&employee)
}
