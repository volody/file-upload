// src/components/FileUpload.js
import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";

const GET_SIGNED_UPLOAD_URL = gql`
  query GetSignedUploadURL($filename: String!, $filetype: String!) {
    getSignedUploadUrl(filename: $filename, filetype: $filetype) {
      url
    }
  }
`;

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);

  // Use useLazyQuery to get a function that can be called to execute the query
  const [getSignedUrl, { loading, error, data }] = useLazyQuery(
    GET_SIGNED_UPLOAD_URL
  );

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    const filename = selectedFile.name;
    const filetype = selectedFile.type;

    try {
      // Fetch the signed URL by calling the lazy query function
      await getSignedUrl({ variables: { filename, filetype } });

      if (loading) return <p>Loading ...</p>;
      if (error) return `Error! ${error}`;

      const signedUrl = data.getSignedUploadUrl.url;

      // Use the signed URL to upload the file directly to S3
      const result = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": filetype,
        },
        body: selectedFile,
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
      <input type="file" name="file" onChange={changeHandler} />
      {isFilePicked ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
  );
};

export default FileUpload;
