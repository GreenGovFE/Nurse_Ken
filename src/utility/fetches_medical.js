/* eslint-disable no-console */
/* eslint-disable no-dupe-keys */
/* eslint-disable quotes */
// import Cookies from "js-cookie";
import axios from 'axios';
// import notification from "./notification";
import { useState } from "react";


export const FileUpload = async (data, callbackfunction, patientref) => {
  let fileProgress;
  let Access_token = localStorage.getItem('token');
  const response = axios.post(
    // `${process.env.REACT_APP_BASE_URL}/services/api/documents/UploadMedicalRecords/${patientref}`,
    `https://edogoverp.com/services/api/documents/UploadMedicalRecords/${patientref}`,
    data,
    {
      headers: {
         Authorization: `Bearer ${Access_token}`,
         "content-type": "multipart/form-data",
        'content-type': undefined,
      },
     
    },
  );
  await response
    .then((response) => {
      let result = response.data;
      callbackfunction(result);
      
      console.log(response);
    })
    .catch((error) => {
      callbackfunction(error);
      
    });
};
