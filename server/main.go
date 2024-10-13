package main

import (
	"d-app/config"
	"d-app/etherium"
	"d-app/rest"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	log.Printf("VERSION: %s\n", config.GetVersion())

	err := godotenv.Load()
	if err != nil {
		log.Println("Failed to log .env")
	}

	err = etherium.ConnectEtherium()
	if err != nil {
		log.Panicln(err.Error())
	}

	rest.Routes()
}