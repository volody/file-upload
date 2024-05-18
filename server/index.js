// server/index.js
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const bodyParser = require("body-parser");

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
      const s3Params = {
        Bucket: "YOUR_BUCKET_NAME",
        Key: filename,
        Expires: 60, // the URL will expire in 60 seconds
        ContentType: filetype,
        ACL: "public-read", // or another ACL according to your needs
      };

      try {
        const signedUrl = await s3.getSignedUrlPromise("putObject", s3Params);
        return signedUrl;
      } catch (err) {
        console.error(err);
        throw new Error("Unable to generate signed URL");
      }
    },
  },
};

const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  region: "YOUR_REGION",
});

const s3 = new AWS.S3();

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
