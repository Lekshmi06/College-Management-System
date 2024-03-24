import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const EditStudent = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const { id } = useParams();
  const [studentData, setStudentData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    parent: "",
    dob: "",
    email: "",
    mobile_number: "",
    academic_percentage: "",
    joining_year: "",
    profile_pic: null,
    semester_fees: "",
    department: "",
    teacher: "",
  });

  // useEffect(() => {
  //   axios
  //     .get(`http://127.0.0.1:8000/authentication/getstudent/?id=${id}`)
  //     .then((response) => {
  //       const student = response.data[0]; // Assuming the first element contains the student data
  //       setStudentData(student);
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching student data:", error);
  //     });
  // }, [id]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/authentication/getstudent/?id=${id}`)
      .then((response) => {
        const student = response.data[0];
  
        // Assuming department and teacher are correctly structured in the response
        setStudentData({
          ...student,
          department: student.department,
          teacher: student.teacher_name[1], // Assuming the teacher id is at index 1 in the array
        });
  
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }, [id]);

  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setStudentData((prevStudentData) => ({
        ...prevStudentData,
        [name]: files[0],
      }));
    } else {
      setStudentData((prevStudentData) => ({
        ...prevStudentData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/authentication/department/")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  useEffect(() => {
    if (studentData.department) {
      axios
        .get(
          `http://127.0.0.1:8000/authentication/teacher_dept/${studentData.department}/`
        )
        .then((response) => {
          setTeachers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching teachers:", error);
        });
    }
  }, [studentData.department]);

  const handleDepartmentSelect = (department) => {
    setStudentData({
      ...studentData,
      department: department.id,
    });
    setIsDepartmentDropdownOpen(false);
  };

  const handleTeacherSelect = (teacher) => {
    setStudentData((prevStudentData) => ({
      ...prevStudentData,
      teacher: teacher.id,
    }));
    console.log(studentData);
    setIsTeacherDropdownOpen(false);
  };

  // const handleTeacherSelect = (teacher) => {
  //   setStudentData({
  //     ...studentData,
  //     teacher: teacher.id,
  //   });
  //   setIsTeacherDropdownOpen(false);
  // };

  
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
  
    for (const key in studentData) {
      if (key === 'profile_pic' && studentData[key] !== null) {
        // Check if it's a Blob or File
        if (studentData[key] instanceof Blob) {
          formData.append(key, studentData[key], studentData[key].name);
        } else {
          console.error('Invalid file data for profile_pic');
        }
      } else if (key === 'profile_pic' && studentData[key] === null && studentData['profile_pic_url']) {
        // If no new profile picture is selected, use the previous one
        formData.append(key, studentData['profile_pic_url']);
      } else {
        formData.append(key, studentData[key]);
      }
    }


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();

  //   for (const key in studentData) {
  //     if (
  //       key === "profile_pic" &&
  //       studentData[key] === null &&
  //       studentData["profile_pic"]
  //     ) {
  //       formData.append(key, studentData["profile_pic"]);
  //     } else if (key === "profile_pic" && studentData[key] !== null) {
  //       formData.append(key, studentData[key], studentData[key].name);
  //     } else {
  //       formData.append(key, studentData[key]);
  //     }
  //   }

    axios
      .put(
        `http://127.0.0.1:8000/authentication/editstudent/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("Student data updated successfully:", response.data);
        navigate(`/profile/${id}`);
        const assignmentData = {
          student: id,
          teacher: studentData.teacher,
        };
        console.log(assignmentData);
        console.log(studentData);
        axios
          .put(
            `http://127.0.0.1:8000/authentication/assignments/${id}/`,
            assignmentData
          )
          .then((response) => {
            console.log("Assignment edited successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error editing assignment:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating student data:", error);
      });
  };

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
      <Sidebar />
      <div className="bg-gray-100 bg-opacity-15 p-8 mx-auto mt-8 max-w-md rounded-md w-full">
         <h1 className="text-white text-3xl pl-3">Edit details</h1>
      <form
        onSubmit={handleSubmit}
        method="POST"
        encType="multipart/form-data"
        className="max-w-md text-black mx-auto mt-8"
      >
        
        {/* Input fields */}
        <div className="mb-6">
          <label
            htmlFor="first_name"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            First Name:
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={studentData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="last_name"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Last Name:
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={studentData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="dob"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            DOB:
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={studentData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={studentData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="mobile_number"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Mobile Number:
          </label>
          <input
            type="text"
            id="mobile_number"
            name="mobile_number"
            value={studentData.mobile_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="parent"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Parent Name:
          </label>
          <input
            type="text"
            id="parent"
            name="parent"
            value={studentData.parent}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="academic_percentage"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Academic Percentage:
          </label>
          <input
            type="number"
            id="academic_percentage"
            name="academic_percentage"
            value={studentData.academic_percentage}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="joining_year"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Joining Year:
          </label>
          <input
            type="number"
            id="joining_year"
            name="joining_year"
            value={studentData.joining_year}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Existing profile picture */}
        {studentData.profile_pic && (
          <div className="mb-6">
            <label className="block text-gray-100 text-sm font-bold mb-2">
              Existing Profile Picture:
            </label>
            <img
              src={`http://127.0.0.1:8000${studentData.profile_pic}`}
              alt="Profile Picture"
              className="w-32 h-32 border rounded shadow"
            />
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="profile_pic"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Profile Picture:
          </label>
          <input
            type="file"
            id="profile_pic"
            name="profile_pic"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="semester_fees"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Semester Fees:
          </label>
          <input
            type="number"
            id="semester_fees"
            name="semester_fees"
            value={studentData.semester_fees}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        <label
          htmlFor="address"
          className="block text-gray-100 text-sm font-bold mb-2"
        >
          Address:
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={studentData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        />

        {/* Department dropdown */}
        <div className="mb-6">
          <label
            htmlFor="department"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Department:
          </label>
          <div className="relative">
            <div
              id="department"
              className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline cursor-pointer"
              onClick={() =>
                setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)
              }
            >
              {studentData.department
                ? departments.find((dep) => dep.id === studentData.department)
                    ?.name
                : "Select the department"}
            </div>
            {isDepartmentDropdownOpen && (
              <div
                className="absolute bottom-full left-0 w-full bg border rounded shadow mt-1"
                style={{ backgroundColor: "white" }}
              >
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
        <div className="mb-6">
          <label
            htmlFor="teacher"
            className="block text-gray-100 text-sm font-bold mb-2"
          >
            Teacher:
          </label>
          <div className="relative">
            <div
              id="teacher"
              className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline cursor-pointer"
              onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
            >
              {studentData.teacher
                ? teachers.find((tch) => tch.id === studentData.teacher)
                    ?.first_name +
                  " " +
                  teachers.find((tch) => tch.id === studentData.teacher)
                    ?.last_name
                : "Select the teacher"}
            </div>
            {isTeacherDropdownOpen && (
              <div
                className="absolute bottom-full left-0 w-full bg border rounded shadow mt-1"
                style={{ backgroundColor: "white" }}
              >
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
};

export default EditStudent;
