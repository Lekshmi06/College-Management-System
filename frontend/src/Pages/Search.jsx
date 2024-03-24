import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const Search = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate('')
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
    const admin = decodedToken?.is_superuser
   
    const accountant = decodedToken?.accountant;
  const [student, setStudent] = useState("")
  const [isValidAdmissionNumber, setIsValidAdmissionNumber] = useState(false);
  const fetchPaymentStatus = () => {
    setLoading(true);
    axios.get(`http://127.0.0.1:8000/authentication/paymentfilter/?admission_number=${admissionNumber}`)
      .then(response => {
        setPaymentData(response.data);
        console.log(response.data)
        console.log(response.data)
        
        
      })
      .catch(error => {
        console.error('Error fetching payment status:', error);
        setError(error.response?.data?.error || "An error occurred")
        
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNavigate = () => {
    navigate(`/payment/${id}`);
  };

  const handleSearch = () => {
    console.log(admissionNumber)
    fetchPaymentStatus();
    axios.get(`http://127.0.0.1:8000/authentication/filter/?admission_number=${admissionNumber}`)
    .then(response => {
      setStudent(response.data);
      console.log(response.data)
      setIsValidAdmissionNumber(true);

      console.log(response.data[0].id)
      setId(response.data[0].id)
      
    })
    .catch(error => {
      console.error('Error fetching payment status:', error);
       setIsValidAdmissionNumber(false); // Set admission number as invali
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
    <Sidebar/>
    <div className="container mx-auto p-10">
      {/* <h1 className="text-2xl font-bold mb-4">Payment Status</h1> */}
      <div className="mb-4">
        <label htmlFor="admissionNumber" className="block text-gray-100 font-bold mb-2">Enter Admission Number:</label>
        <input id="admissionNumber" type="text" value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} className="border border-gray-300 rounded px-4 py-2 w-full" />
      </div>
      <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
      {error && <p className='text-red-500 mt-5 text-2xl'>{error}</p>}
      {accountant && (
      <div>
        
        {isValidAdmissionNumber &&<button onClick={handleNavigate} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Go to Payment Marking</button>}
      </div>
      )}
      {loading && <p>Loading...</p>}
      {paymentData && 
      paymentData.map((Data) => ( (
        <div className='text-white mt-5 p-5 rounded-md bg-white bg-opacity-15'>
          <h2 className="text-4xl  font-bold mt-4 mb-2">Payment Details</h2>
          <div className=' mt-5'>
          <p className='text-2xl'><strong>Semester Fee Status:</strong> {Data.semester_paid ? 'Paid' : 'no payment'}</p>
          <p className='text-2xl'><strong>Bus Fee Status:</strong> {Data.bus_fee ? 'Paid' : 'no payment'}</p>
          <p className='text-2xl'><strong>Fine Status:</strong> {Data.fine ? 'Paid' : 'no payment'}</p>
          <p className='text-2xl'><strong>Payment Date:</strong> {Data.payment_date}</p>
         </div>
        </div>
      ))
      )}
    </div>
    </div>
  );
};

export default Search;
