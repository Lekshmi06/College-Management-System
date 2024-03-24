import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

const Add_student = () => {
  // State to store form data
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    parent: '',
    dob: '',
    email: '',
    mobile_number: '',
    academic_percentage: '',
    joining_year: '',
    profile_pic: null, // Change to null
    semester_fees: '',
    admission_number: '',
    department: '',
    teacher: '',
  });

  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const handleDepartmentSelect = (department) => {
    setFormData({
      ...formData,
      department: department.id,
    });
    setIsDepartmentDropdownOpen(false);
  };

  const handleTeacherSelect = (teacher) => {
    setFormData({
      ...formData,
      teacher: teacher.id,
    });
    setIsTeacherDropdownOpen(false);
  };

  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // Handle file input separately
      setFormData({
        ...formData,
        [name]: files[0], // Store file directly, not in FormData
      });
    } else if (name === 'department' || name === 'teacher') {
      // Handle dropdown selections
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      // For other input types, handle them as before
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formDataToSend = new FormData();

    // Append form fields to FormData
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    // Make a POST request to the backend API endpoint with the FormData
    axios
      .post('http://127.0.0.1:8000/authentication/student/', formDataToSend)
      .then((response) => {
        console.log('Student added successfully:', response.data);
        const studentId = response.data.id;
        navigate(`/profile/${studentId}`)
        const assignmentData = {
          student: studentId,
          teacher: formData.teacher,
        };
        axios
          .post('http://127.0.0.1:8000/authentication/assign/', assignmentData)
          .then((response) => {
            console.log('Assignment created successfully:', response.data);
           
          })
          .catch((error) => {
            console.error('Error creating assignment:', error);
          });
      })
      .catch((error) => {
        console.error('Error adding student:', error);
        if (error.response) {
          const responseData = error.response.data;
          if (responseData.email) {
            setEmailError(responseData.email[0]);
          } else {
            setEmailError('');
          }
          if (responseData.mobile_number) {
            setMobileError(responseData.mobile_number[0]);
          } else {
            setMobileError('');
          }
        } else {
          setEmailError('An error occurred while adding the student.');
          setMobileError('An error occurred while adding the student.');
        }
      });
  };

  // Fetch departments and teachers data
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/authentication/department/')
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
      });
    }, []);

  useEffect(() => {     
    axios
      .get(`http://127.0.0.1:8000/authentication/teacher_dept/${formData.department}/`)
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching teachers:', error);
      });
  }, [formData.department]);

  return (
    <div className="flex flex-row md:flex-row min-h-screen gap-5 bg-gradient-to-r from-black to-cyan-500">
    <Sidebar/>
    {/* <div className="bg-gray-100 bg-opacity-15 p-8 mx-auto mt-8 max-w-md rounded-md w-full"> */}
    <div className="max-w-xl mx-auto bg-gray-100 bg-opacity-10 p-10 rounded-lg">
    <h1 className="text-white text-3xl pl-3">Student details</h1>
    <form onSubmit={handleSubmit} method='POST' encType="multipart/form-data" className="max-w-md text-black mx-auto mt-8">
      
    
      {/* Input fields */}
      <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="first_name" className="block text-gray-100 text-sm font-bold mb-2">
                First Name:
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
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="last_name" className="block text-gray-100 text-sm font-bold mb-2">
                Last Name:
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
          </div>
  
     
  
          <div className="mb-6">
            <label htmlFor="dob" className="block text-gray-100 text-sm font-bold mb-2">
              DOB:
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline text-sm"
            />
          </div>
  
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="email" className="block text-gray-100 text-sm font-bold mb-2">
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
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="mobile_number" className="block text-gray-100 text-sm font-bold mb-2">
                Mobile Number:
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
          </div>
      <div className="mb-6">
        <label htmlFor="parent" className="block text-gray-100 text-sm font-bold mb-2">
          Parent Name:
        </label>
        <input
          type="text"
          id="parent"
          name="parent"
          value={formData.parent}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
      <label htmlFor="address" className="block text-gray-100 text-sm font-bold mb-2">
          Address:
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      <div className="mb-6 flex">
  <div className="w-1/3 pr-2">
    <label htmlFor="academic_percentage" className="block text-gray-100 text-sm font-bold mb-2">
      Percentage:
    </label>
    <input
      type="number"
      id="academic_percentage"
      name="academic_percentage"
      value={formData.academic_percentage}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    />
  </div>
  <div className="w-1/3 px-2">
    <label htmlFor="joining_year" className="block text-gray-100 text-sm font-bold mb-2">
      Joining Year:
    </label>
    <input
      type="number"
      id="joining_year"
      name="joining_year"
      value={formData.joining_year}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    />
  </div>
  <div className="w-1/3 pl-2">
    <label htmlFor="semester_fees" className="block text-gray-100 text-sm font-bold mb-2">
      Sem Fees:
    </label>
    <input
      type="number"
      id="semester_fees"
      name="semester_fees"
      value={formData.semester_fees}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    />
  </div>
</div>
  
      <div className="mb-6">
        <label htmlFor="profile_pic" className="block text-gray-100 text-sm font-bold mb-2">
          Profile Picture:
        </label>
        <input
          type="file"
          id="profile_pic"
          name="profile_pic"
          // value={formData.profile_pic}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div>
  
      {/* <div className="mb-6">
        <label htmlFor="semester_fees" className="block text-gray-100 text-sm font-bold mb-2">
          Semester Fees:
        </label>
        <input
          type="number"
          id="semester_fees"
          name="semester_fees"
          value={formData.semester_fees}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />
      </div> */}
  
     
      
  
      {/* Department dropdown */}
      {/* <div className="mb-6">
        <label htmlFor="department" className="block text-gray-100 text-sm font-bold mb-2">
          Department:
        </label>
        <div className="relative">
          <div
            id="department"
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline cursor-pointer"
            onClick={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
          >
            {formData.department ? departments.find(dep => dep.id === formData.department)?.name : 'Select the department'}
          </div>
          {isDepartmentDropdownOpen && (
            <div className="absolute bottom-full left-0 w-full bg border rounded shadow mt-1" style={{ backgroundColor: 'white' }}>
              {departments.map((department) => (
                <div
                  key={department.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleDepartmentSelect(department)}
                >
                  {department.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
  
      {/* Teacher dropdown */}
      {/* <div className="mb-6">
        <label htmlFor="teacher" className="block text-gray-100 text-sm font-bold mb-2">
          Teacher:
        </label>
        <div className="relative">
          <div
            id="teacher"
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline cursor-pointer"
            onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
          >
            {formData.teacher ? teachers.find(tch => tch.id === formData.teacher)?.first_name + ' ' + teachers.find(tch => tch.id === formData.teacher)?.last_name : 'Select the teacher'}
          </div>
          {isTeacherDropdownOpen && (
            <div className="absolute bottom-full left-0 w-full bg border rounded shadow mt-1" style={{ backgroundColor: 'white' }}>
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleTeacherSelect(teacher)}
                >
                  {teacher.first_name} {teacher.last_name}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>  */}

<div className="mb-6 flex">
  <div className="w-1/2 pr-2">
    <label htmlFor="department" className="block text-gray-100 text-sm font-bold mb-2">
      Department:
    </label>
    <div className="relative">
      <div
        id="department"
        className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline cursor-pointer"
        onClick={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
      >
        {formData.department ? departments.find(dep => dep.id === formData.department)?.name : 'Select the department'}
      </div>
      {isDepartmentDropdownOpen && (
        <div className="absolute bottom-full left-0 w-full bg border rounded shadow mt-1" style={{ backgroundColor: 'white' }}>
          {departments.map((department) => (
            <div
              key={department.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleDepartmentSelect(department)}
            >
              {department.name}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  <div className="w-1/2 pl-2">
    <label htmlFor="teacher" className="block text-gray-100 text-sm font-bold mb-2">
      Teacher:
    </label>
    <div className="relative">
      <div
        id="teacher"
        className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline cursor-pointer"
        onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
      >
        {formData.teacher ? teachers.find(tch => tch.id === formData.teacher)?.first_name + ' ' + teachers.find(tch => tch.id === formData.teacher)?.last_name : 'Select the teacher'}
      </div>
      {isTeacherDropdownOpen && (
        <div className="absolute bottom-full left-0 w-full bg border rounded shadow mt-1" style={{ backgroundColor: 'white' }}>
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleTeacherSelect(teacher)}
            >
              {teacher.first_name} {teacher.last_name}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
        
        <div className='bg-red-600 bg-opacity-30 text-white p-1 mb-5 rounded-lg '>
  {emailError && (
    <div className="text-red-100">{emailError}</div>
  )}
  {mobileError && (
    <div className="text-red-100">{mobileError}</div>
  )}
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
      </div>
 );
    
 }



export default Add_student;
