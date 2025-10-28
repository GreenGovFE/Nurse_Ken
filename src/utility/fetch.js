import toast from "react-hot-toast";
import { logout } from "./auth";

const paths = {
  login: "login-path",
};

async function fetchBackend(endpoint, method, auth, body, params) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const fetchObject = { method, headers };
  const path = paths[endpoint] || endpoint;
  // let url = `${process.env.REACT_APP_BACKEND_URL}${path}`;
  let url = `https://api.greenzonetechnologies.com.ng/medicals/api${path}`;
  // let url = `https://edogoverp.com/medicals/api${path}`;
  

  

  if (body) {
    fetchObject.body = JSON.stringify(body);
  }

  if (params) {
    const paramsArray = Object.keys(params).map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    );

    url += `?${paramsArray.join("&")}`;
  }

  if (auth) {
    const token = sessionStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  try {
    const response = await fetch(url, fetchObject);

    if (!response.ok) {
      // If the response is not OK (e.g., 4xx, 5xx),
      // we need to read the body to get the detailed error JSON
      const errorResponseData = await response.json(); // Attempt to parse error JSON
      const errorText =
        errorResponseData.message || response.statusText || "Unknown Error";

      // Create a custom error object to hold the server's error data
      const customError = new Error(errorText);
      customError.response = response; // Attach the raw response
      customError.serverErrorData = errorResponseData; // Attach the parsed error JSON

      // You can also add more specific checks here
      // if (errorResponseData.errorData && Array.isArray(errorResponseData.errorData)) {
      //   customError.specificErrors = errorResponseData.errorData;
      // }

      // throw the custom error to be caught by the calling function's .catch()
      throw customError;
    }

    // For successful responses, parse the JSON
    return response.json();
  } catch (error) {
    // This catch block handles:
    // 1. Errors thrown above (our customError for non-2xx responses)
    // 2. Network errors (e.g., server unreachable, CORS issues before response)
    // 3. JSON parsing errors if response.json() fails

    console.error("Fetch API error:", error.serverErrorData);

    // Provide more specific error messages to the calling code or user
    if (
      error.serverErrorData &&
      error.serverErrorData.errorData &&
      Array.isArray(error.serverErrorData.errorData)
    ) {
      if (
        error.serverErrorData.statusCode == 400 ||
        error.serverErrorData.statusCode == 500 
        // ||
        // error.serverErrorData.statusCode == 404
      ) {
        toast.error(error.serverErrorData.errorData[0]);
      }
      return {
        success: false,
        status: error.serverErrorData.statusCode, // Indicate no HTTP status code was received
        statusText: "Network Error" || error.serverErrorData.exceptionType,
        message: error.serverErrorData.errorData[0],
        // errorDetails: errorDetails
      };
      console.error(
        "Specific API Validation Error:",
        error.serverErrorData.errorData[0]
      );
      // console.error('Specific API Validation Error:', error.serverErrorData.errorData[0]);
      // You could re-throw a more specific error or return a structured error result
      // throw new Error(error.serverErrorData.errorData.join(", ")); // Join all specific errors
    } else if (error.serverErrorData && error.serverErrorData.message) {
      console.error("General Server Message:", error.serverErrorData.message);
      // throw new Error(error.serverErrorData.message);
    } else if (error.response) {
      // If it was a non-JSON error response (e.g., HTML error page)
      console.error(
        "Non-JSON error response from server:",
        error.response.status,
        error.response.statusText
      );
      // throw new Error(`Server Error: ${error.response.status} ${error.response.statusText}`);
    } else if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      // Common network error for fetch
      console.error("Network or CORS error: Unable to connect to backend.");
      // throw new Error('Network error: Could not connect to the server. Please check your internet connection or try again later.');
    } else {
      console.error("An unexpected error occurred:", error.message);
      // throw new Error('An unexpected error occurred. Please try again.');
    }
  }

  // return fetch(url, fetchObject)
  //   .then(checkHttpStatus)
  //   .then(parseJSON);
}

export const get = (endpoint, params, auth = true) =>
  fetchBackend(endpoint, "GET", auth, null, params);

export const post = (endpoint, body, auth = true) =>
  fetchBackend(endpoint, "POST", auth, body);

export const put = (endpoint, body, auth = true) =>
  fetchBackend(endpoint, "PUT", auth, body);

export const del = (endpoint, body, auth = true) =>
  fetchBackend(endpoint, "DELETE", auth, body);

function checkHttpStatus(response) {
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

  const errorText =
    response && response.statusText ? response.statusText : "Unknown Error";
  const error = new Error(errorText);
  error.response = response;
  toast.error(errorText);
  throw error;
}

function parseJSON(response) {
  // Check if the response status is OK
  if (response.ok) {
    // Attempt to parse JSON
    return response.json().catch((error) => {
      // If parsing fails, throw an error with the response status
      // throw new Error(`Failed to parse JSON. Status: ${response.status}`);
    });
  } else {
    // If the response status is not OK, throw an error with the response status
    // throw new Error(`Response status: ${response}`);

    console.log(response);
  }
}
