import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    is_teacher: false,
    is_accountant:false,
    last_name: "",
    first_name: "",
    mobile_number: "",
    subject: "",
    department: "",
    username: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [departments, setDepartments] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [showDepartmentSubject, setShowDepartmentSubject] = useState(false); 
  const handleChange = (e) => {
    const { name, value,  type, checked } = e.target;
    if (name === 'is_teacher') {
        setShowDepartmentSubject(checked);
        // If "Teacher" is being checked, uncheck "Accountant" and vice versa
        if (checked) {
          setFormData(prevState => ({
            ...prevState,
            [name]: checked,
            is_accountant: false // Uncheck "Accountant"
          }));
        } else {
          setFormData(prevState => ({
            ...prevState,
            [name]: checked
          }));
        }
      }
      // If the clicked checkbox is "Accountant"
      else if (name === 'is_accountant') {
        setShowDepartmentSubject(false);
        // If "Accountant" is being checked, uncheck "Teacher" and vice versa
        if (checked) {
          setFormData(prevState => ({
            ...prevState,
            [name]: checked,
            is_teacher: false // Uncheck "Teacher"
          }));
        } else {
          setFormData(prevState => ({
            ...prevState,
            [name]: checked
          }));
        }
      }
      // For other input types, update the state normally
      else {
        setFormData(prevState => ({
          ...prevState,
          [name]: type === 'checkbox' ? checked : value
        }));
      }
    };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/authentication/department/", formData)
      .then((response) => {
        setDepartments(response.data);
        console.log("Department get:", response.data);
      })
      .catch((error) => {
        console.error("Department error:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make a POST request to the registration API endpoint
    axios
      .post("http://127.0.0.1:8000/authentication/register/ ", formData)
      .then((response) => {
        navigate("/")
        console.log("Registration successful:", response.data.user_id);
        setSuccessMessage("Registration successful");
        const user_id = response.data.user_id;
        
      })
      .catch((error) => {
        console.error("Registration failed:", error);

        if (error.response && error.response.data) {
          // Log the entire error object for more details
          console.error("Error response:", error.response);
      
          // Extract and display specific error messages for username, email, and mobile number if available
          const { username, email, mobile_number } = error.response.data;
      
          if (username) {
            setErrorMessage(username[0]);
          } else if (email) {
            setErrorMessage(email[0]);
          } else if (mobile_number) {
            setErrorMessage(mobile_number[0]);
          } else {
            // If no specific error message is available, use a generic message
            setErrorMessage("Registration failed");
          }
        } else {
          // If no specific error response is available, use a generic message
          setErrorMessage("Registration failed");
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-semibold">Register</h1>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
      
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>} 
      <div className="mb-6">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
        <div className="flex gap-4 my-4 ">
         <div className="mb-6">
        <label htmlFor="is_teacher" className="block text-gray-700 text-sm font-bold mb-2">
          Teacher:
          <input
            type="checkbox"
            id="is_teacher"
            name="is_teacher"
            checked={formData.is_teacher}
            onChange={handleChange}
            className="ml-2"
          />
        </label>
      </div>
      <div className="mb-6">
        <label htmlFor="is_accountant" className="block text-gray-700 text-sm font-bold mb-2">
          Accountant:
          <input
            type="checkbox"
            id="is_accountant"
            name="is_accountant"
            checked={formData.is_accountant}
            onChange={handleChange}
            className="ml-2"
          />
        </label>
      </div>
      </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="first_name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          first_name:
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="last_name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          last_name:
        </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="mobile"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          mobile:
        </label>
        <input
          type="text"
          id="mobile_number"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
        </div>

        {showDepartmentSubject && (
        <div>   
        <div className="mb-6">
          <label
            htmlFor="department"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Department:
          </label>
          <select
            id="department"
            name="department"
            // value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            multiple
          >
            <option value="">select the department</option>
            {departments &&
              departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
          </select>
        </div>
     
      <div className="mb-6">
        <label
          htmlFor="subject"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Subject:
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      </div> 
        )}
      <div className="flex justify-between">
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
        <div>Already have an account ? <a href="/" className="text-blue-500 hover:text-blue-700">Login</a></div>
      </div>
    </form>
    </div>
  );
};

export default Register;
