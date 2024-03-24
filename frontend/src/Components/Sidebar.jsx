import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaClinicMedical, FaNotesMedical, FaHandHoldingMedical, FaBookMedical,}  from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { PiStudentFill } from "react-icons/pi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { jwtDecode } from "jwt-decode";
import { IoDocumentText } from "react-icons/io5";
import Cookies from "js-cookie";

const Sidebar = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  const admin = decodedToken?.is_superuser;
  const teacher = decodedToken?.teacher;
  const accountant = decodedToken?.accountant;

  const menus = [
    { name: "Dashboard", path:'/student_list', icon: MdSpaceDashboard , roles: ["admin",  "accountant"]},
    { name: "Dashboard", path:'/teacher', icon: MdSpaceDashboard , roles: ["teacher"]},
    { name: "Notifications", path: '/notification', icon: IoIosNotifications, roles: ["admin", "teacher"] },
    { name: "Department", path: '/add_department', icon: HiOutlineOfficeBuilding, roles: ["admin"] },
    { name: "Add Student", path: '/add_student', icon:  PiStudentFill, roles: ["admin"] },
    { name: "Payment Status", path: '/search', icon: MdPayment, roles: ["accountant", "admin"] },
    { name: "Attendance", path: '/attendancelist', icon: IoDocumentText, roles: ["admin", "teacher"] },
    { name: "Add Attendance", path: '/attendance', icon: SlCalender , roles: ["teacher"] },
    { name: "Fine", path: '/fine', icon:  MdPayment, roles: ["admin", "teacher",]},
    { name: "Students", path: '/student_list', icon:  FaPeopleGroup, roles: ["admin",  "accountant"]},
    { name: "Students", path: '/teacher', icon:  FaPeopleGroup, roles: ["teacher"]},
    { name: "Logout", icon: HiMenuAlt3, roles: ["admin", "teacher", "accountant"] },
  ];

  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
      <div
        className={`bg-slate-950 text-white min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="list-none mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            menu.roles &&
            ((menu.roles.includes("admin") && admin) ||
              (menu.roles.includes("teacher") && teacher) ||
              (menu.roles.includes("accountant") && accountant)) ? (
              <div
                to={""}
                key={i}
                className={`${
                  menu?.margin && "mt-5"
                }flex items-center text-xl gap-3.5 font-medium p-2 cursor-pointer hover:bg-gray-800 rounded-md`}
                onClick={menu.name === "Logout" ? handleLogout : () => navigate(menu.path)}
              >
                <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                <h2
                  style={{ transitionDelay: `${i + 3}00ms` }}
                  className={`whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  {menu?.name}
                </h2>
              </div>
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
