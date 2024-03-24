import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Sidebar from '../Components/Sidebar';

const ProfilePage = () => {
    const [students, setStudent] = useState("");
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate('');
    const token = Cookies.get('token');
    const decodedToken = jwtDecode(token);
    const admin = decodedToken?.is_superuser
    const teacher = decodedToken?.teacher;
    const accountant = decodedToken?.accountant;
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/authentication/getstudent/?id=${id}`);
                setStudent(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

    const handleBus = () => {
        navigate(`/busfee/${id}`);
    };

    const handleFine = () => {
        navigate("/fine");
    };

    const handleEdit = () => {
        navigate(`/edit_student/${id}`);
    };

    const handleDelete = () => {
        axios.delete(`http://127.0.0.1:8000/authentication/editstudent/${id}/`)
            .then((response) => {
                console.log(response.data);
                navigate('/student_list');
            }).catch((error) => {
                console.log("Error response:", error.response);
                console.log(error);
            });
    };

    const renderActions = () => {
        if (admin) {
            return (
                <div className="mt-4">
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Delete
                    </button>
                    <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                    </button>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
            <Sidebar />
            <div className="bg-black min-h-screen w-full flex flex-col justify-center items-center text-white">
                {students && students.map((student) => (
                    <div key={student.id} className="w-full max-w-md mx-auto">
                      {!accountant && (  
                        <div className='flex flex-col'>
                            <div className="relative inline-block text-left">
                                <button onClick={toggleDropdown} className="inline-flex justify-center  rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-700 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ">
                                    View Fee
                                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1zM9 9a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1zM5 13a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2H5z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {isOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <button onClick={handleBus} className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700" role="menuitem"> Bus Fee</button>
                                        <button onClick={handleFine} className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700" role="menuitem"> Fine</button>
                                    </div>
                                </div>
                              )}   
                            </div>
                        </div>
                      )}
                        <div className="text-center mb-8">
                            <img src={`http://127.0.0.1:8000${student.profile_pic}`} alt="Profile" className="w-32 h-32 mx-auto rounded-full" />
                            <h2 className="text-lg font-bold">{student.first_name} {student.last_name}</h2>
                            
                            <p className="text-xl">Adm.No: {student.admission_number}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                
                                <p>Address: {student.address}</p>
                                <p>Parent: {student.parent}</p>
                                <p>Date of Birth: {student.dob}</p>
                                <p>Mobile Number: {student.mobile_number}</p>
                                <p>Email:{student.email}</p>
                                
                            </div>
                            <div>
                                <p>Department: {student.department_name}</p>
                                <p>Assigned teacher: {student.teacher_name[0]}</p>
                                <p>Academic Percentage: {student.academic_percentage}</p>
                                <p>Joining Year: {student.joining_year}</p>
                               
                                <p>Semester Fees: {student.semester_fees}</p>
                                
                            </div>
                        </div>
                        {renderActions()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;
