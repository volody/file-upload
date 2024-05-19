// src/App.js

import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_HELLO = gql`
  query GetHello {
    hello
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_HELLO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>{data.hello}</h1>
    </div>
  );
}

export default App;
