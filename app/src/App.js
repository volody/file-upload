// src/App.js

import React from "react";
import FileUpload from "./FileUpload";
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
      <header className="App-header">
        <h1>File Upload in React</h1>
        <FileUpload />
      </header>
    </div>
  );
}

export default App;
