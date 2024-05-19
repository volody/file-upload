// server/index.js
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const bodyParser = require("body-parser");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define your GraphQL schema and resolvers
const typeDefs = gql`
  type Query {
    hello: String
    getSignedUploadURL(filename: String!, filetype: String!): String!
  }
`;
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    getSignedUploadURL: async (_, { filename, filetype }) => {
      console.log(`filename: ${filename}, filetype: ${filetype}`);

      const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const s3Params = {
        Bucket: process.env.MY_BUCKET_NAME,
        Key: filename,
        ContentType: filetype,
        ACL: "public-read", // or another ACL according to your needs
      };

      const command = new PutObjectCommand(s3Params);

      try {
        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 60,
        });
        return signedUrl;
      } catch (err) {
        console.error(err);
        throw new Error("Unable to generate signed URL");
      }
    },
  },
};

// Create an instance of ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });

// Middleware
app.use(bodyParser.json());

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(
      `GraphQL endpoint available at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
