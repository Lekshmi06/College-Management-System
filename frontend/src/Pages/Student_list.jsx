import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';

const StudentList = () => {

  const navigate = useNavigate() 
  const [students, setStudents] = useState([]);
   
  const handleNavigate = (id) => {
    navigate(`/attendance/${id}`);
  };


  useEffect(() => {
    // Fetch student data from backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/authentication/student/');
        setStudents(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
      <Sidebar/>
    <div className="container mx-auto text-center">
    
      <h1 className="text-3xl text-white  font-semibold my-8">Student List</h1>
      
      <div className="overflow-x-auto text-left">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profile Picture
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admission Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
           
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                <NavLink to={`/profile/${student.id}`}>
                    <img
                      src={`http://127.0.0.1:8000${student.profile_pic}`}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="h-12 w-12 rounded-full"
                    />
                  </NavLink>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                <NavLink to={`/profile/${student.id}`} className="text-sm font-medium text-gray-900">
                    {student.first_name} {student.last_name}
                  </NavLink>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.admission_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.department_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button  onClick={() => handleNavigate(student.id)} >View</button>
                </td>
              </tr>
            
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default StudentList;
