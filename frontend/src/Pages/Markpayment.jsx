import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import { useParams } from 'react-router-dom';

const PaymentMarkingPage = () => {
  const [semesterFeePaid, setSemesterFeePaid] = useState(false);
  const [selectedBusFee, setSelectedBusFee] = useState(null);
  const [selectedFines, setSelectedFines] = useState([]);
  const [ student, setStudent] = useState("")
  const [loading, setLoading] = useState(false);
  const [busFees, setBusFees] = useState([]);
  const [fines, setFines] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Fetch bus fees and fines data
    axios.get(`http://127.0.0.1:8000/authentication/stdt_bus/${id}/`)
      .then(response => {
        setBusFees(response.data);
      })
      .catch(error => {
        console.error('Error fetching bus fees:', error);
      });

    axios.get("http://127.0.0.1:8000/authentication/fine/")
      .then(response => {
        setFines(response.data);
      })
      .catch(error => {
        console.error('Error fetching fines:', error);
      });
      axios.get(`http://127.0.0.1:8000/authentication/stdt_id/${id}/`)
      .then(response => {
        setStudent(response.data.semester_fees);
        console.log(response.data.semester_fees)
      })
      .catch(error => {
        console.error('Error fetching fines:', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    console.log("selectedBusFee:", selectedBusFee);
    const busFeeAmount = selectedBusFee ? selectedBusFee.fee_amount : 0;
    console.log("busFeeAmount:", busFeeAmount);

    const paymentData = {
      student: id, // Assuming id is the student ID
      semester_paid: semesterFeePaid, // Assuming semesterFeePaid is a boolean indicating if semester fee is paid
      //bus_fee_paid: busFeeAmount > 0, // Assuming busFeeAmount is the amount of the bus fee
      bus_fee: selectedBusFee ? selectedBusFee.id : null, // Include bus_fee ID
      //fine_paid: selectedFines.length > 0, // Assuming selectedFines is an array of selected fine IDs
      fine: selectedFines.length > 0 ? selectedFines[0].id : null,
      // fines: selectedFines.map(fine => fine.id),
      // fines: selectedFines ? selectedFines.id : null,
      // fines: selectedFines.map(fineId => fines.find(fine => fine.id === fineId)),
    };

    console.log(paymentData);

    axios.post('http://127.0.0.1:8000/authentication/paymentrecord/', paymentData)
      .then(response => {
        console.log('Payments marked successfully:', response.data);
        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.write('<html><head><title>Payment Receipt</title></head><body>');
        printWindow.document.write(response.data);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      })
      .catch(error => {
        console.error('Error marking payments:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
      <Sidebar />
      <div className="container mx-auto flex justify-center mt-20 mb-20">
        <div className="bg-white bg-opacity-15 p-8 rounded-lg shadow-lg max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-4">Mark Payments</h1>
          <form onSubmit={handleSubmit}>
            {/* Semester fee */}
            <div className="mb-4">
              <label htmlFor="semesterFee" className="block text-gray-100 font-bold mb-2">Semester Fee : {student}</label>
              <input id="semesterFee" type="checkbox" checked={semesterFeePaid} onChange={(e) => setSemesterFeePaid(e.target.checked)} className="mr-2" />
              <label htmlFor="semesterFee" className="text-gray-100">Paid</label>
            </div>
            {/* Bus fee */}
            <div className="mb-4">
              <label htmlFor="busFee" className="block text-gray-100 font-bold mb-2">Bus Fee:</label>
              <select
                id="busFee"
                value={selectedBusFee ? selectedBusFee.id : ''}
                onChange={(e) => setSelectedBusFee(busFees.find(busFee => busFee.id === parseInt(e.target.value)))}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              >
                <option value="">Select Bus Fee</option>
                {busFees.length === 0 && <option value="" disabled>No fee to select</option>}
                {busFees.map(busFee => (
                  <option key={busFee.id} value={busFee.id}>{busFee.location} - ${busFee.fee_amount}</option>
                ))}
              </select>
            </div>
            {/* Fines */}
            <div className="mb-4">
              <label htmlFor="fines" className="block text-gray-100 font-bold mb-2">Fines:</label>
              <select id="fines" 
              value={selectedFines ? selectedFines.id : ''} 
              // onChange={(e) => setSelectedFines(fines.find(fine => fine.id === parseInt(e.target.value)))} 
              onChange={(e) => setSelectedFines([fines.find(fine => fine.id === parseInt(e.target.value))])} 
              className="border border-gray-300 rounded px-4 py-2 w-full">
                <option value="">Select a fine</option>
                {fines.length === 0 && <option value="" disabled>No fine to select</option>}
                {fines.map(fine => (
                  <option key={fine.id} value={fine.id}>{fine.name} - ${fine.amount}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentMarkingPage;
