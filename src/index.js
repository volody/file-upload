import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import App from "./App";

// Create Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
