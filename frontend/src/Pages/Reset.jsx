import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    username: '',
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

// if(formData.new_password !== formData.confirm_new_password){
//       setErrors("New password and confirm password do not match");
//       return;
//     }
//     setErrors(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/authentication/reset/', formData);
      // Reset form and navigate to login page on success
      setFormData({
        username: '',
        current_password: '',
        new_password: '',
        confirm_new_password: '',
      });
      navigate('/');
    } catch (error) {
      // Handle error response and set errors state
      if (error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
           
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="username">Username</label>
            {errors.error && <p className="text-red-500 text-xs mt-1">{errors.error}</p>}
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
           
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="current_password">Current Password</label>
            <input
              type="password"
              id="current_password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password[0]}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="new_password">New Password</label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password[0]}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="confirm_new_password">Confirm New Password</label>
            <input
              type="password"
              id="confirm_new_password"
              name="confirm_new_password"
              value={formData.confirm_new_password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {formData.new_password !== formData.confirm_new_password && (
              <p className="text-red-500 text-xs mt-1">New password and confirm password do not match</p>
            )}
            {errors.confirm_new_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_new_password[0]}</p>}
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
