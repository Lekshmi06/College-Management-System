import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

const AddDepartment = () => {
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/authentication/department/')
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  const handleAddDepartment = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8000/authentication/department/", { name: department })
      .then((response) => {
        console.log(response.data);
        setDepartments([...departments, response.data]); // Add the new department to the list
        setDepartment(""); // Clear the input field
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangedepartment = (e) => {
    setDepartment(e.target.value);
  };

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
      <Sidebar />
      <div className="w-1/2 my-6 mx-auto p-6 bg-white bg-opacity-15 rounded-xl">
        <div className="p-7">
          <h1 className="mb-6 text-3xl">Add Department</h1>
        </div>
        <form method="post" onSubmit={handleAddDepartment}>
          <div className="mb-4">
            <label
              htmlFor="category_name"
              className="block text-gray-100 text-sm font-bold mb-2"
            >
              Department Name:
            </label>
            <input
              type="text"
              id="category_name"
              name="name"
              value={department}
              onChange={handleChangedepartment}
              className="w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:shadow-outline-blue active:bg-teal-800"
            >
              Add Department
            </button>
          </div>
        </form>
        <div className='text-center text-white'>
          <h2 className="text-5xl  font-bold mb-4">Departments</h2>
          <ul>
            {departments.map(department => (
              <li  className="text-3xl font-semibold" key={department.id}>{department.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
