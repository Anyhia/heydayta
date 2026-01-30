import './App.css';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import CreateLog from './components/Log';
import About from './components/About';
import NavBar from './components/NavBar';
import api, { setApiToken } from './api';
import {useEffect} from 'react';
import { useAuth } from './components/Auth/AuthProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  const { token, setToken } = useAuth();

  // whenever the token changes, call the setApiToken (declared in api.js)
  useEffect(() => {
    setApiToken(token);
  }, [token]);

  // only response interceptor here now (the request is moved n api.js, check the explanation there)

  useEffect(() => {
    // Response interceptor
    //  api.interceptors.response.use() takes two arguments (two functions), separatedby comma, success function and error function.
    const responseInterceptor = api.interceptors.response.use(
      // If successful, return response
      (response) => response, 
      
      //  If error
      async (error) => {
        if (error.config?.url?.includes('/accounts/google/')) {
          return Promise.reject(error);
        }
        if (error.config?.url?.includes('/accounts/logout/')) {
          return Promise.reject(error);
        }
        if (error.config?.url?.includes('/token/refresh/')) {
          // If refresh endpoint fails, don't try to refresh again
          setToken(null);
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const originalRequest = error.config;

        // Check if it is a 401 error(means the token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {

          originalRequest._retry = true;  // Prevent infinite loop
          
          try {
            // Get a new token, and set the new value of the access token
            const newToken = await api.post('/token/refresh/');
            setToken(newToken.data.access);
            // Add the token to the authorization header
            originalRequest.headers.Authorization = `Bearer ${newToken.data.access}`;
            // Retry to send the request with the new value
            return api(originalRequest); 
          }catch (refreshError) {
            // Refresh failed - redirect to login
            setToken(null);
            window.location.href = '/login'; // Force redirect
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean 
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [setToken]);

  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path='/' element={<About/>} />
        <Route path='/logout' element={<Logout/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        {/* next Route will be wrapped in ProtectedRoute */}
        <Route  path="/createlog" element={ <ProtectedRoute> <CreateLog /> </ProtectedRoute> } />
        {/* <Route path="/question" element={ <ProtectedRoute> <Question /> </ProtectedRoute> } /> */}
      </Routes>
    </Router>
  );
}
export default App;

