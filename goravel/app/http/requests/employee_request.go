package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type EmployeeRequest struct {
	Name string `form:"name" json:"name"`
}

func (r *EmployeeRequest) Authorize(ctx http.Context) error {
	return nil
}

func (r *EmployeeRequest) Filters(ctx http.Context) map[string]any {
	return map[string]any{}
}

func (r *EmployeeRequest) Rules(ctx http.Context) map[string]any {
	return map[string]any{
		"name": "required|string|max:255",
	}
}

func (r *EmployeeRequest) Messages(ctx http.Context) map[string]string {
	return map[string]string{
		"name.required": "Name is required.",
	}
}

func (r *EmployeeRequest) Attributes(ctx http.Context) map[string]string {
	return map[string]string{
		"name": "name",
	}
}

func (r *EmployeeRequest) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}
