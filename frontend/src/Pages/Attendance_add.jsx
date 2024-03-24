import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';



const AddAttendanceForm = () => {
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  const id = decodedToken?.user_id
  const [date, setDate] = useState('');
  const [studentId, setStudentId] = useState('');
  const [present, setPresent] = useState(false);
  const [absent, setAbsent] = useState(false);
  const [students, setStudents] = useState([]);
  const [msg, setMsg] = useState([])


  useEffect(() => {
    // Fetch list of students
    axios.get(`http://127.0.0.1:8000/authentication/teacher_student/${id}/`)
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const attendanceData = {
      date,
      student: studentId,
      present,
    };

    axios.post('http://127.0.0.1:8000/authentication/attendance/', attendanceData)
      .then(response => {
        console.log('Attendance added successfully:', response.data);
        setMsg('Attendance added successfully ')
        // Optionally, clear the form fields or show a success message
      })
      .catch(error => {
        console.error('Error adding attendance:', error);
        // Optionally, display an error message to the user
      });
  };

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
    <Sidebar/>
    <div className="container mx-auto flex flex-col  items-center  ">
      <h1 className='text-white text-4xl font-semibold mt-16'>Add Attendance</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-gray-100 bg-opacity-15 p-8 w-full rounded-md">
        <div className='text-green-600'>{msg}</div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-100 text-sm font-bold mb-2">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="student" className="block text-gray-100 text-sm font-bold mb-2">Student:</label>
          <select
            id="student"
            name="student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex flex-row gap-3">
          <label htmlFor="present" className="block text-gray-100 text-sm font-bold mb-2">
            Present:
            <input
              type="checkbox"
              id="present"
              name="present"
              checked={present}
              onChange={(e) => {
                setPresent(e.target.checked);
                setAbsent(false); // Uncheck absent checkbox
              }}
              className="ml-2"
            />
          </label>
          <label htmlFor="present" className="block text-gray-100 text-sm font-bold mb-2">
            Absent:
            <input
              type="checkbox"
              id="present"
              name="present"
              checked={absent}
              onChange={(e) => {
                setAbsent(e.target.checked);
                setPresent(false); // Uncheck present checkbox
              }}
              
              className="ml-2"
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Attendance
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddAttendanceForm;
