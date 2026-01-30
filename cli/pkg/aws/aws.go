package aws

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/joho/godotenv"
)

var client *s3.Client
var bucket string

func init() {
	_ = godotenv.Load("/home/joyvin/Bro Code/StackAI/cli/.env")
	region := os.Getenv("AWS_REGION")
	bucket = os.Getenv("S3_BUCKET")

	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		log.Fatal("failed to load AWS config:", err)
	}
	client = s3.NewFromConfig(cfg)
}

func RepoExists(repo string) bool {
	resp, err := client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
		Bucket: aws.String(bucket),
		Prefix: aws.String(repo),
	})
	if err != nil {
		log.Fatal("list objects failed:", err)
	}

	for _, obj := range resp.Contents {
		fmt.Println(*obj.Key)
	}
	return len(resp.Contents) > 1
}

func PushFolder(folder string) {
	err := filepath.Walk(folder, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}

		rel, _ := filepath.Rel(folder, path)
		key := filepath.ToSlash(filepath.Join("testRepo2", rel))

		f, err := os.Open(path)
		if err != nil {
			return err
		}
		defer f.Close()

		_, err = client.PutObject(context.TODO(), &s3.PutObjectInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
			Body:   f,
			ACL:    "public-read",
		})
		if err != nil {
			return err
		}
		fmt.Println("Uploaded:", key)
		return nil
	})
	if err != nil {
		log.Fatal("walk error:", err)
	}
}

func GetRemoteCommit(branch string) string {
	file := filepath.Join("testRepo", branch)

	resp, err := client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(file),
	})
	if err != nil {
		log.Fatal("failed to get object:", err)
	}
	defer resp.Body.Close()

	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal("failed to read object body:", err)
	}

	return string(bytes)
}
