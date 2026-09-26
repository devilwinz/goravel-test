package migrations

import (
	"github.com/goravel/framework/contracts/database/schema"

	"goravel/app/facades"
)

type M20260925125610CreateTasksTable struct{}

// Signature The unique signature for the migration.
func (r *M20260925125610CreateTasksTable) Signature() string {
	return "20260925125610_create_tasks_table"
}

// Up Run the migrations.
func (r *M20260925125610CreateTasksTable) Up() error {
	if !facades.Schema().HasTable("tasks") {
		return facades.Schema().Create("tasks", func(table schema.Blueprint) {
			table.ID()
			table.UnsignedBigInteger("employee_id")
			table.String("title")
			table.Text("description")
			table.String("status")
			table.TimestampsTz()
			table.SoftDeletes()

			table.Foreign("employee_id").References("id").On("employees")
		})
	}

	return nil
}

// Down Reverse the migrations.
func (r *M20260925125610CreateTasksTable) Down() error {
	return facades.Schema().DropIfExists("tasks")
}
