package rest

import (
	"context"
	"d-app/config"
	"d-app/controllers"
	"d-app/rest/response"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/limiter"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

const gracefulShutdownTimeLimit = time.Second * 10

func Routes() {

	app := fiber.New(fiber.Config{
		ReduceMemoryUsage: true,
		ProxyHeader:       fiber.HeaderXForwardedFor,
	})

	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 10 * time.Second,
		KeyGenerator: func(c fiber.Ctx) string {
			return c.Get("x-forwarded-for")
		},
		LimitReached: func(c fiber.Ctx) error {
			return response.ErrorResponse(c, "cant take any more request. server is busy!")
		},
	}))

	corsConfig := cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization", "dataCheckString", "hash"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	}

	app.Use(cors.New(corsConfig))
	app.Use(recover.New())

	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("HELLO WORLD")
	})
	app.Get("/version", func(c fiber.Ctx) error {
		return c.SendString(config.GetVersion())
	})

	app.Post("/deposit", func(c fiber.Ctx) error {
		return controllers.Deposit(c)
	})

	go func() {
		err := app.Listen(":7500")
		if err != nil {
			log.Fatal("can't start the application, ", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("shutting down")
	ctx, cancel := context.WithTimeout(context.Background(), gracefulShutdownTimeLimit)

	defer cancel()
	if err := app.ShutdownWithContext(ctx); err != nil {
		log.Println("error when shutting down the server")
		os.Exit(1)
	}
}