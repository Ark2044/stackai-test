package hasher

import (
	"encoding/hex"
	"io"
	"os"

	"github.com/zeebo/blake3"
)

func HashFile(f string) string {
	file, err := os.Open(f)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	hasher := blake3.New()

	if _, err := io.Copy(hasher, file); err != nil {
		panic(err)
	}

	digest := hasher.Sum(nil)
	hexStr := hex.EncodeToString(digest)

	return hexStr
}

func HashData(data []byte) string {
	hasher := blake3.New()
	hasher.Write(data)
	digest := hasher.Sum(nil)
	return hex.EncodeToString(digest)
}
