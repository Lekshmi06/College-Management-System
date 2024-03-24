import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';

const AttendanceList = () => {
  const [studentsAttendance, setStudentsAttendance] = useState([]);

  useEffect(() => {
    // Fetch attendance records for all students
    axios.get('http://127.0.0.1:8000/authentication/attendance/')
      .then(response => {
        console.log(response.data)
        setStudentsAttendance(response.data);
      })
      .catch(error => {
        console.error('Error fetching students attendance:', error);
      });
  }, []);

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
    <Sidebar/>
    <div className="container mx-auto p-7 text-center mt-5">
      <h1 className="text-2xl font-bold text-white pl-25 items-center mb-6 ">Attendance Records for All Students</h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">Student Name</th>
              <th className="border border-gray-400 px-4 py-2">Date</th>
              <th className="border border-gray-400 px-4 py-2">Present</th>
            </tr>
          </thead>
          <tbody>
            {studentsAttendance.map(studentAttendance => (
              <tr key={studentAttendance.id}>
                <td className="border border-gray-100 px-4 py-4 text-white">{studentAttendance.student_name}</td>
                <td className="border border-gray-100 px-4 py-4 text-white">{studentAttendance.date}</td>
                <td className="border border-gray-100 px-4 py-4 text-white">{studentAttendance.present ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default AttendanceList;
