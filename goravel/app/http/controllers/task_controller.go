package controllers

import (
	"github.com/goravel/framework/contracts/http"
)

type TaskController struct {
	// Dependent services
}

func NewTaskController() *TaskController {
	return &TaskController{
		// Inject services
	}
}

func (r *TaskController) Index(ctx http.Context) http.Response {
	return nil
}	
