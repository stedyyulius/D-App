package config

var (
	COMMIT string
)

func GetVersion() string {
	return "1.00"
}

func GetCommit() string {
	return COMMIT
}
