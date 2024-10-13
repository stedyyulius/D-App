package etherium

import (
	"fmt"
	"log"
	"os"

	"github.com/ethereum/go-ethereum/ethclient"
)

var Client *ethclient.Client

func ConnectEtherium() error {
	etherium_node := os.Getenv("ETHERIUM_NODE")
	if etherium_node == "" {
		log.Println("ETHERIUM_NODE environment variable is not set")
		return fmt.Errorf("ETHERIUM_NODE environment variable is not set")
	}

	client, err := ethclient.Dial(etherium_node)
	if err != nil {
		return fmt.Errorf("failed to connect to the ethereum client: %v", err)
	}

	Client = client

	fmt.Printf("Connected to Ethereum node: %s", etherium_node)

	return nil
}