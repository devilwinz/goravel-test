package routes

import (
	"goravel/app/facades"

	"github.com/goravel/framework/contracts/http"
)

func Web() {
	facades.Route().Get("/", func(ctx http.Context) http.Response {
		return ctx.Response().View().Make("index.tmpl")
	})
}
