package routes

import (
	"goravel/app/facades"
	"goravel/app/http/controllers"

	"github.com/goravel/framework/contracts/route"
)

func Api() {
	facades.Route().Prefix("/api").Group(func(router route.Router) {
		employeeController := controllers.NewEmployeeController()
		router.Get("/employee", employeeController.Show)
		router.Post("/employee", employeeController.Store)
		router.Delete("/employee/{id}", employeeController.Destroy)
	})
}
