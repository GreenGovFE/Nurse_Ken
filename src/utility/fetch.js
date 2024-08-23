import toast from "react-hot-toast";
import { logout } from "./auth";

const paths = {
  login: 'login-path'
};

async function fetchBackend(endpoint, method, auth, body, params) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  const fetchObject = { method, headers };
  const path = paths[endpoint] || endpoint;
  let url = `${process.env.REACT_APP_BACKEND_URL}${path}`;

  if (body) {
    fetchObject.body = JSON.stringify(body);
  }

  if (params) {
    const paramsArray = Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

    url += `?${paramsArray.join('&')}`;
  }

  if (auth) {
    const token = sessionStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }


  return fetch(url, fetchObject)
    .then(checkHttpStatus)
    .then(parseJSON);
}

export const get = (endpoint, params, auth = true) => fetchBackend(endpoint, 'GET', auth, null, params);

export const post = (endpoint, body, auth = true) => fetchBackend(endpoint, 'POST', auth, body);

export const put = (endpoint, body, auth = true) => fetchBackend(endpoint, 'PUT', auth, body);

export const del = (endpoint, body, auth = true) => fetchBackend(endpoint, 'DELETE', auth, body);

function checkHttpStatus(response) {

  console.log(response)
  if (response && response.ok) {
    return response;
  }

  if (response && response.status === 401) {
    return response;
  }

  if (response && response.status === 204) {
    return response;
  }

  if (response && response.status === 404) {
    return response;
  }

  if (response && response.status === 400) {
    return response;
  }

  if (response && response.status === 422) {
    return response;
  }

  if (response && response.status === 409) {
    return response;
  }

  if (response && response.status === 500) {
    return response;
  }



  const errorText = response && response.statusText ? response.statusText : 'Unknown Error';
  const error = new Error(errorText);
  error.response = response;
  toast.error(errorText)
  throw error;

}

function parseJSON(response) {
  // Check if the response status is OK
  if (response.ok) {
    // Attempt to parse JSON
    return response.json()
      .catch(error => {
        // If parsing fails, throw an error with the response status
        throw new Error(`Failed to parse JSON. Status: ${response.status}`);
      });
  } else {
    // If the response status is not OK, throw an error with the response status
    throw new Error(`Response status: ${response.status}`);
  }
}

