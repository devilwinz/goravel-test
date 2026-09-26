package controllers

import (
	"goravel/app/http/requests"
	"goravel/app/models"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)

type EmployeeController struct {
	// Dependent services
}

func NewEmployeeController() *EmployeeController {
	return &EmployeeController{
		// Inject services
	}
}

func (r *EmployeeController) Index(ctx http.Context) http.Response {
	return nil
}

func (r *EmployeeController) Show(ctx http.Context) http.Response {
	var employees []models.Employee
	var total int64

	page := ctx.Request().QueryInt("page", 1)
	perPage := ctx.Request().QueryInt("per_page", 10)

	// Pagination
	err := facades.Orm().Query().
		Paginate(page, perPage, &employees, &total)

	if err != nil {
		return ctx.Response().Json(http.StatusInternalServerError, http.Json{
			"message": "Failed to retrieve employees",
		})
	}

	lastPage := int((total + int64(perPage) - 1) / int64(perPage))

	return ctx.Response().Json(http.StatusOK, http.Json{
		"data": employees,
		"meta": http.Json{
			"current_page": page,
			"per_page":     perPage,
			"total":        total,
			"last_page":    lastPage,
		},
	})
}

func (r *EmployeeController) Store(ctx http.Context) http.Response {
	var request requests.EmployeeRequest
	var employee models.Employee

	errors, err := ctx.Request().ValidateRequest(&request)

	if err != nil {
		return ctx.Response().Json(http.StatusUnprocessableEntity, http.Json{
			"message": "Validation failed",
			"errors":  errors,
		})
	}
	employee.Name = request.Name

	err = facades.Orm().Query().Create(&employee)
	if err != nil {
		return ctx.Response().Json(http.StatusInternalServerError, http.Json{
			"message": "Failed to create employee",
		})
	}

	return ctx.Response().Json(http.StatusCreated, http.Json{
		"message": "Employee created successfully",
		"data":    employee,
	})
}

func (r *EmployeeController) Update(ctx http.Context) http.Response {
	return nil
}

func (r *EmployeeController) Destroy(ctx http.Context) http.Response {
	id := ctx.Request().Route("id")

	var employee models.Employee

	err := facades.Orm().Query().FindOrFail(&employee, id)
	if err != nil {
		return ctx.Response().Json(http.StatusNotFound, http.Json{
			"message": "Employee not found",
		})
	}

	deleted, err := facades.Orm().Query().Delete(&employee)
	if err != nil {
		return ctx.Response().Json(http.StatusInternalServerError, http.Json{
			"message": "Failed to delete employee",
		})
	}

	return ctx.Response().Json(http.StatusOK, http.Json{
		"message": "Employee deleted successfully",
		"deleted": deleted,
	})
}
