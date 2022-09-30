import React, { FC } from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { AzureMP } from 'react-azure-mp'
import { useState } from 'react';
import '../App.css';
import ReactJWPlayer from 'react-jw-player';

const MediaWithCC = () => {
  const [fileSelected, setFileSelected] = useState<File>();
  const [publicUrl, setPublicUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState<boolean>(false);

  const handleFileChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setFileSelected(fileList[0]);
  };

  const uploadFile = function (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (fileSelected) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", fileSelected);
      axios
        .post<string>("https://app-managemedia.azurewebsites.net/media", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
        .then(response => {
          setPublicUrl(response.data);
          setLoading(false);
          setUploadStatus(true);
        })
        .catch(ex => {
          const error =
            ex.response.status === 404
              ? "Resource Not found"
              : "An unexpected error has occurred";
          setError(error);
          setLoading(false);
          setUploadStatus(false);

          console.log("Error " + error);
        });
    }
  }

  return (
    <>

      <div className="App">
        <h1>Video Publishing - Accessibility day</h1>
        <br />

        <label htmlFor="photo">
          <input
            accept="audio/*,video/*"
            id="photo"
            name="photo"
            type="file"
            multiple={false}
            onChange={handleFileChange}
          />
        </label>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CloudUploadIcon />}
          onClick={uploadFile}
        >
          Upload
        </Button>

      </div>

      {loading ? <h1 className="loadingclass"> Loading ...</h1> : <br />}

      {!loading && uploadStatus ?
        <div>
          <div className="videoBox">


            <ReactJWPlayer
              playerId='my-unique-id'
              playerScript='https://cdn.jwplayer.com/libraries/iA1Ait6L.js'
              file={publicUrl}
            />
          </div>

        </div>
        : <br />}
    </>
  )

}

export default MediaWithCC;