import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Sidebar from "../Components/Sidebar";

const Fine = () => {
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  const admin = decodedToken?.is_superuser;
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [amountError, setAmountError] = useState("");
  const { id } = useParams();
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [existingFines, setExistingFines] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
   
  });
  const navigate = useNavigate("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/authentication/fine/")
      .then(response => {
        setExistingFines(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching existing fines:', error);
      });
  }, [ deleteStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    if (!formData.amount) {
      setAmountError("Amount field is empty!");
      hasErrors = true;
    } else {
      setAmountError("");
    }
    if (!formData.name) {
      setNameError("Name field is empty!");
      hasErrors = true;
    } else {
      setNameError("");
    }
    if (!formData.description) {
      setDescriptionError("Description field is empty!");
      hasErrors = true;
    } else {
      setDescriptionError("");
    }
    if (!hasErrors) {
      axios.post("http://127.0.0.1:8000/authentication/fine/", formData)
        .then((response) => {
          console.log(response.data);
          // navigate(`/profile/${id}`);
        }).catch((error) => {
          console.log("Error response:", error.response);
          console.log(error);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDelete = (id) => {
  
    
    axios
      .delete(`http://127.0.0.1:8000/authentication/fine_id/${id}/`)
      .then((response) => {
        console.log("Fine deleted successfully:", response.data);
        setDeleteStatus(!deleteStatus);
       
      })
      .catch((error) => {
        console.error('Error updating fine:', error);
        console.log(error.response.data);
        
      });
  };


  const handleNavigate = (id) => {
    navigate(`/edit_fine/${id}`);
  };

  return (
    <div className="flex flex-row md:flex-row min-h-screen gap-5 bg-gradient-to-r from-black to-cyan-500">
      <Sidebar />
      <div className="flex flex-col items-center justify-center   gap-10 w-full">
       
        {admin && (
          <div>
             <div className="text-4xl text-white">Add Fine</div>
          <form onSubmit={handleSubmit} method='POST' className="max-w-md mx-auto p-7 rounded-lg bg-white bg-opacity-15 mt-8">
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-100 text-sm font-bold mb-2">
                Fine Name:
              </label>
              <div>{nameError}</div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-100 text-sm font-bold mb-2">
                Description:
              </label>
              <div>{descriptionError}</div>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="amount" className="block text-gray-100 text-sm font-bold mb-2">
                Amount:
              </label>
              <div>{amountError}</div>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </div>
          </form>
          </div>
        )}
        <div className="container text-center mx-auto bg-white bg-opacity-15 p-4 rounded shadow-lg ">
          <h1 className="text-4xl font-bold mb-4 text-white">Fine Details</h1>
          {existingFines ? (
            existingFines.map((existingfine) => (
              <div className="text-left text-white " key={existingfine.id}>
                <p className="text-2xl "><strong>Name:</strong> {existingfine.name}</p>
                <p  className="text-2xl"><strong>Description:</strong> {existingfine.description}</p>
                <p  className="text-2xl"><strong>Amount:</strong> {existingfine.amount}</p>
              
                {admin && (  
                <div className="flex mt-5 flex-row gap-10 mb-5">
                  <button onClick={() => handleNavigate(existingfine.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
                  <button onClick={() => handleDelete(existingfine.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">Delete</button>
                </div>
                 )}
              </div>
            ))
          ) : (
              <p>Loading...</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Fine;
