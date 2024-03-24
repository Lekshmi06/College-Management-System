import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";

const Edit_fine = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    student: id,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate("")

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/authentication/fine_id/${id}/`)
      .then((response) => {
        setFormData(response.data[0]);
        console.log(response.data[0])
      })
      .catch((error) => {
        console.error('Error fetching fine:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`http://127.0.0.1:8000/authentication/fine_id/${id}/`, formData)
      .then((response) => {
        console.log("Fine updated successfully:", response.data);
        setLoading(false);
        navigate("/fine")
      })
      .catch((error) => {
        console.error('Error updating fine:', error);
        setErrors(error.response.data);
        setLoading(false);
      });
  };

  return (
    <div className="flex  md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
      <Sidebar />
      <div className="container mx-auto px-4 py-8 md:py-16 text-center">
        <h1 className="text-2xl font-bold mb-4  text-white">Edit Fine</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto text-left p-7 rounded-lg bg-white bg-opacity-15">
          <div className="mb-6">
            <label htmlFor="name" className="block text-white text-sm font-bold mb-2">Fine Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block  text-white  text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm  text-white  font-bold mb-2">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline"
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <Link
              to={`/profile/${id}`}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit_fine;
