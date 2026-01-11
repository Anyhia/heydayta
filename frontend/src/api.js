import axios from 'axios';

// The current access token (updated from React)
let currentToken = null;

// function React will call whenever token changes (this function is called in app.js, whenever the token changes)
export const setApiToken = (token) => {
  currentToken = token;
};

// axios instance 
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// The interceptor automatically catches 401 errors, refreshes the token using 
// httpOnly cookie (sent automatically via withCredentials: true), and retries the failed request.
// Request interceptor

// request interceptor(moved from app.js, so it adds the authorization header as soon as api is imported
// and not with the component’s useEffect (fetchLogs); When the request interceptor was in app.js, 
// GET /logs/ was called before the interceptor was ready, so no Authorization header. 
api.interceptors.request.use((config) => {
  if (currentToken) {
    // Authorization header using currentToken
    config.headers.Authorization = `Bearer ${currentToken}`;
  } else {
    // Remove header if no token
    delete config.headers.Authorization;
  }
  return config;
});

export default api;




