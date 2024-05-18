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
  }
`;
const resolvers = {
  Query: {
    hello: () => "Hello world!",
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
