// src/FileUpload.js
import React, { useState } from "react";

function FileUpload({ yourGraphQLClient, GET_SIGNED_UPLOAD_URL }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected.");
      return;
    }

    const filename = file.name;
    const filetype = file.type;

    try {
      // Get signed URL from your GraphQL server
      const response = await yourGraphQLClient.query({
        query: GET_SIGNED_UPLOAD_URL,
        variables: { filename, filetype },
      });

      const signedUrl = response.data.getSignedUploadURL;

      // Use the signed URL to upload the file directly to S3
      const result = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": filetype,
        },
        body: file,
      });

      if (result.ok) {
        console.log("File uploaded successfully.");
      } else {
        console.error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUpload;
