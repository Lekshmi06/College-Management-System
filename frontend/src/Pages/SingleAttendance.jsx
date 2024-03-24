import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const { id } = useParams();
  const [attendance, setAttendance] = useState([]);
  const navigate = useNavigate()
  const [adm_no, setAdm_no] = useState("")

  const handleNavigate = () => {
    navigate("/student_list")
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/authentication/attendance_id/${id}/`)
      .then(response => {
        setAttendance(response.data);
        console.log(response.data);
        setAdm_no(response.data[0].adm_no)
        console.log(response.data[0].adm_no)
      })
      .catch(error => {
        console.error('Error fetching attendance data:', error);
      });
  }, [id]);

 

  return (
    <div className="container mx-auto  ">
      <h1 className="text-2xl font-bold my-4">Attendance for Student Admission number: {adm_no}</h1>
      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              
              <th className="py-3 px-6 text-left">Student Name</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Present</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {attendance.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-100">
            
                <td className="py-3 px-6 text-left">{entry.student_name}</td>
                <td className="py-3 px-6 text-left">{entry.date}</td>
                <td className="py-3 px-6 text-left">{entry.present ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className='bg-gray-900 text-white p-3 rounded-md hover:bg-gray-700' onClick={handleNavigate} >Go Back</button>
    </div>
  );
};

export default Attendance;
