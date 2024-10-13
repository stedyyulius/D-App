package controllers

import (
	"context"
	"d-app/etherium"
	"d-app/models"
	"d-app/rest/response"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"

	"github.com/ethereum/go-ethereum/core/types"
	"github.com/gofiber/fiber/v3"
)

func Deposit(c fiber.Ctx) error {

	var req models.SignedTxRequest

	log.Println("Request body:", string(c.Body()))

	if err := json.Unmarshal(c.Body(), &req); err != nil {
		log.Println(err)
		return response.ErrorResponse(c, err.Error())
	}

	log.Println("Received signedTx:", req.SignedTx)

	if req.SignedTx == "" {
        log.Println("Error: signedTx is empty")
        return response.ErrorResponse(c, "signedTx is empty")
    }

	txHash, err := broadcastSignedTransaction(req.SignedTx)
	if err != nil {
		log.Println(err)
		return err
	}

	responseDetail := models.ResponseDetails{
		Data:      txHash,
		Message:   "Success",
		TotalData: 0,
	}

	response.SuccessResponse(c, responseDetail)

	return nil;
}

func broadcastSignedTransaction(signedTxHex string) (string, error) {
	
    log.Println("Raw Signed Transaction:", signedTxHex)

    // Validate length and prefix
    if len(signedTxHex) < 2 || signedTxHex[:2] != "0x" {
        return "", fmt.Errorf("invalid signed transaction hex: input string is too short or missing '0x'")
    }

    // Check for valid hex characters
    for _, c := range signedTxHex[2:] { // Ignore the '0x' prefix
        if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')) {
            return "", fmt.Errorf("invalid character in hex string: %c", c)
        }
    }

    // Convert hex to bytes
    rawTx, err := hex.DecodeString(signedTxHex[2:]) // Use the hex package directly
    if err != nil {
        return "", fmt.Errorf("failed to convert hex to bytes: %v", err)
    }

    log.Println("Length of rawTx after conversion:", len(rawTx))

    if len(rawTx) == 0 {
        return "", fmt.Errorf("failed to convert hex to bytes: input string is empty")
    }

    tx := new(types.Transaction)
    err = tx.UnmarshalBinary(rawTx)
    if err != nil {
        return "", fmt.Errorf("failed to decode signed transaction: %v", err)
    }

    err = etherium.Client.SendTransaction(context.Background(), tx)
    if err != nil {
        return "", fmt.Errorf("failed to send transaction: %v", err)
    }

    return tx.Hash().Hex(), nil
}