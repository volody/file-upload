## Client-Side File Upload to S3 Bucket Using Signed URLs with Apollo Server

### Set Up the Node.js Server

Create a new directory for the server:

```bash
mkdir server
cd server
```

Initialize a new Node.js project and install the necessary packages

```bash
npm init -y
npm install apollo-server-express graphql express
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Setup S3 bucket

```bash
aws s3api create-bucket --bucket my-unique-bucket-name --region us-east-1 --create-bucket-configuration LocationConstraint=us-east-1
```

Set S3 bucket CORS Configuration

```bash
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

Add user with policy

```bash
aws iam create-user --user-name new-user
```

```bash
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::my-unique-bucket-name/*"
      ]
    }
  ]
}
```

Create a `.env` File:

```bash
MY_BUCKET_NAME=my-unique-bucket-name
AWS_ACCESS_KEY_ID=new-user-access-key-id
AWS_SECRET_ACCESS_KEY=new-user-secret-access-key
AWS_REGION=my-unique-bucket-name-region
```

### Set Up React App

from root folder initialize react application

```bash
npx create-react-app app
cd app
```

Integrate Apollo Client in React

```bash
npm install @apollo/client graphql
```

### Run Server and App

from root folder:

start the Node.js server:

```bash
cd server
node index.js
```

start the app:

```bash
cd app
npm start
```
