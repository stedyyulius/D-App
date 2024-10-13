package response

import (
	"d-app/config"
	"d-app/models"

	"github.com/gofiber/fiber/v3"
)

func SuccessResponse(c fiber.Ctx, responseDetails models.ResponseDetails) error {

	response := models.Response{
		Version:   config.GetVersion(),
		Message:   responseDetails.Message,
		TotalData: responseDetails.TotalData,
		Data:      responseDetails.Data,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func ErrorResponse(c fiber.Ctx, message string) error {

	response := models.Response{
		Version:   config.GetVersion(),
		Message:   message,
		TotalData: 0,
		Data:      nil,
	}

	return c.Status(fiber.StatusBadRequest).JSON(response)
}