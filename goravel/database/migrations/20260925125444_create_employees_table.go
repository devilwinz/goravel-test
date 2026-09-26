package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"

	"goravel/app/facades"
)

type M20260925125444CreateEmployeesTable struct{}

// Signature The unique signature for the migration.
func (r *M20260925125444CreateEmployeesTable) Signature() string {
	return "20260925125444_create_employees_table"
}

// Up Run the migrations.
func (r *M20260925125444CreateEmployeesTable) Up() error {
	if !facades.Schema().HasTable("employees") {
		return facades.Schema().Create("employees", func(table schema.Blueprint) {
			table.ID()
			table.String("name")
			table.TimestampsTz()
		})
	}

	return nil
}

// Down Reverse the migrations.
func (r *M20260925125444CreateEmployeesTable) Down() error {
	return facades.Schema().DropIfExists("employees")
}
