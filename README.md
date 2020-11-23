### AWS senior-test

Requirements
```shell
sudo apt install awscli
aws configure

nvm use 10
npm i -g serverless@v1.60
```

Install dependencies
```shell
npm i
```

Unit tests
```shell
npm test
```

Deployment
```shell
npm run deploy
```

Example requests:

-   Get urls to download trimmed songs

    GET `https://re3soehgm8.execute-api.us-east-1.amazonaws.com/dev/songs/get_song_urls`
    - response
      ```JSON
      [
        "https://...",
        "https://..."
      ]
      ```

-   Get signed url to upload audio file

    POST `https://re3soehgm8.execute-api.us-east-1.amazonaws.com/dev/songs/get_upload_url`
    
    - request body
      ```JSON
      {
        "fileName": "file_example_MP3_1MG.mp3",
        "fileType": "audio/mpeg"
      }
      ```
    - response
      ```JSON
      {
        "url": "$SIGNED_URL",
        "key": "file_example_MP3_1MG.mp3"
      }
      ```

-   Upload file to s3 bucket
    
    PUT `$SIGNED_URL`
    - request body is a `Form Data` File
    - response - empty with status code 200