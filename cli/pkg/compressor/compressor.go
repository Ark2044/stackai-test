package compressor

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/klauspost/compress/zstd"
)

func CompressFile(src, dst string) error {
	inFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer inFile.Close()

	parent := filepath.Dir(dst)
	if _, err := os.Stat(parent); os.IsNotExist(err) {
		if err := os.MkdirAll(parent, 0755); err != nil {
			return fmt.Errorf("failed to create directory: %w", err)
		}
	}

	outFile, err := os.Create(dst)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to create output file: %w", err)
	}
	defer outFile.Close()

	encoder, _ := zstd.NewWriter(outFile)

	_, err = io.Copy(encoder, inFile)
	if err != nil {
		encoder.Close()
		return err
	}

	if err := encoder.Close(); err != nil { // explicitly flush
		return fmt.Errorf("failed to flush encoder: %w", err)
	}

	return nil

}

func CompressData(data []byte, dst string) error {
	// Ensure parent directories exist
	parent := filepath.Dir(dst)
	if _, err := os.Stat(parent); os.IsNotExist(err) {
		if err := os.MkdirAll(parent, 0755); err != nil {
			return fmt.Errorf("failed to create directory: %w", err)
		}
	}

	// Create output file
	outFile, err := os.Create(dst)
	if err != nil {
		return fmt.Errorf("failed to create output file: %w", err)
	}
	defer outFile.Close()

	// Create ZSTD encoder
	encoder, err := zstd.NewWriter(outFile)
	if err != nil {
		return fmt.Errorf("failed to create zstd encoder: %w", err)
	}
	defer encoder.Close() // flush on close

	// Write data
	if _, err := encoder.Write(data); err != nil {
		return fmt.Errorf("failed to write compressed data: %w", err)
	}

	return nil
}

func DecompressFile(src, dst string) ([]byte, error) {
	inFile, err := os.Open(src)
	if err != nil {
		return nil, err
	}
	defer inFile.Close()

	decoder, err := zstd.NewReader(inFile)
	if err != nil {
		return nil, err
	}
	defer decoder.Close()

	if dst == "" {
		// Write to memory
		var buf bytes.Buffer
		_, err := io.Copy(&buf, decoder)
		if err != nil {
			return nil, err
		}
		return buf.Bytes(), nil
	}

	// Write to file
	outFile, err := os.Create(dst)
	if err != nil {
		return nil, err
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, decoder)
	return nil, err
}

func GetDecompressFile(src string) ([]byte, error) {
	inFile, err := os.Open(src)
	if err != nil {
		return nil, err
	}
	defer inFile.Close()

	decoder, err := zstd.NewReader(inFile)
	if err != nil {
		return nil, err
	}
	defer decoder.Close()

	var buf bytes.Buffer
	_, err = io.Copy(&buf, decoder)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil

}
