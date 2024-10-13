package models

type ResponseDetails struct {
	Data      interface{}
	Message   string
	TotalData int64
}

type Response struct {
	Version   string      `json:"version"`
	Message   string      `json:"message"`
	TotalData int64       `json:"totalData"`
	Data      interface{} `json:"data"`
}
