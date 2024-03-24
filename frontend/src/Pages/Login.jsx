import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/authentication/login/', formData)
      .then(response => {
        Cookies.set('token', response.data.access, { expires: 7 });
        const token = response.data.access;
        const decodedToken = jwtDecode(token);
        const is_superuser = decodedToken.is_superuser;
        const teacher =  decodedToken.teacher;

        
        if (teacher) {
          navigate('/teacher'); 
        } else {
          navigate('/student_list'); 
        }
      })
      .catch(error => {
        console.error('Login failed:', error);
      
        const errorMessage = error.response.data.message;
      
        setErrorMessage(errorMessage);
      
        // Clear the error message after 5 seconds
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
       <h1 className="text-4xl font-semibold mb-10">Login</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
      <div style={{ color: "red" }}>{errorMessage}</div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
      <div className="text-sm text-gray-600">
        <a href='/reset' className="mr-2">Reset password</a>
        <span className="mr-2">|</span>
        <a href='/register'>Sign up</a>
      </div>
    </div>
  );
};

export default Login;
