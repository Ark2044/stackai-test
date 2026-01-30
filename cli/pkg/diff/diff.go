package diff

import (
	"fmt"
	"sdk/pkg/compressor"
)

const chunkSize = 1024 * 1024

func GetBinaryDiff(base, updated []byte) []byte {
	baseLen := len(base)
	updatedLen := len(updated)
	maxLen := baseLen
	if updatedLen > maxLen {
		maxLen = updatedLen
	}

	diff := make([]byte, maxLen)

	for offset := 0; offset < maxLen; offset += chunkSize {
		end := offset + chunkSize
		if end > maxLen {
			end = maxLen
		}

		for i := offset; i < end; i++ {
			var b, u byte
			if i < baseLen {
				b = base[i]
			}
			if i < updatedLen {
				u = updated[i]
			}
			diff[i] = b ^ u
		}
	}

	return diff
}

func ReConstructFileBytes(basePath, diffPath string) ([]byte, error) {
	fmt.Println("Starting reconstruction")
	fmt.Println("Base path:", basePath)
	fmt.Println("Diff path:", diffPath)

	// Decompress base file
	base, err := compressor.GetDecompressFile(basePath)
	if err != nil {
		return nil, fmt.Errorf("failed to decompress base: %w", err)
	}
	fmt.Printf("Base size: %d bytes\n", len(base))

	// Decompress diff file
	diffData, err := compressor.GetDecompressFile(diffPath)
	if err != nil {
		return nil, fmt.Errorf("failed to decompress diff: %w", err)
	}
	fmt.Printf("Diff size: %d bytes\n", len(diffData))

	baseLen := len(base)
	diffLen := len(diffData)
	maxLen := baseLen
	if diffLen > maxLen {
		maxLen = diffLen
	}
	fmt.Printf("Max length for reconstruction: %d\n", maxLen)

	result := make([]byte, maxLen)

	for offset := 0; offset < maxLen; offset += chunkSize {
		end := offset + chunkSize
		if end > maxLen {
			end = maxLen
		}

		fmt.Printf("Processing chunk: offset=%d, end=%d\n", offset, end)

		for i := offset; i < end; i++ {
			var b, d byte
			if i < baseLen {
				b = base[i]
			}
			if i < diffLen {
				d = diffData[i]
			}
			result[i] = b ^ d
		}
	}

	// Optional: check first few bytes to see if reconstruction is plausible
	fmt.Printf("First 16 bytes of result: %v\n", result[:min(16, len(result))])

	return result, nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
