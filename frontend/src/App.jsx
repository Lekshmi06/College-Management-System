
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './Pages/Login';
import Register from './Pages/Register';
import Add_student from './Pages/Add';
import Add_department from './Pages/Add_department';
import Bus_fee from './Pages/Buss_fee';
import Fine from './Pages/Fine';
import ProfilePage from './Pages/Student_profile';
import StudentList from './Pages/Student_list';
import EditStudent from './Pages/Edit_student';
import Search from './Pages/Search';
import AddAttendanceForm from './Pages/Attendance_add';
import AttendanceList from './Pages/Attendancelist';
import PaymentMarking from './Pages/Markpayment';
import Notifications from './Pages/Notifications';

import Edit_fine from './Pages/Edit_fine';
import ResetPassword from './Pages/Reset';
import Edit_bus from './Pages/Edit_bus';
import Attendance from "./Pages/SingleAttendance";
import Teacher_Stdt from "./Pages/Teacher_Stdt"
function App() {
  

  return (
    <>
    <div>
    <BrowserRouter>
    
    <Routes>
     
    
    <Route path="/" element={<Login />} />
    <Route path="register" element={<Register/>} />  
    <Route path="add_student" element={<Add_student/>} />        
    <Route path='add_department' element={<Add_department/>} />
    <Route path="busfee/:id" element = {<Bus_fee/>}/>
    <Route path="fine/" element = {<Fine/>} />
    <Route path= "profile/:id" element ={<ProfilePage/>} />
    <Route path='student_list' element={<StudentList/>}/>
    <Route path='edit_student/:id' element={<EditStudent/>}/>
    <Route path="search" element={<Search/>} />  
    <Route path="attendance" element={<AddAttendanceForm/>}/>
    <Route path="attendancelist" element={<AttendanceList/>} />
    <Route path="payment/:id" element={<PaymentMarking/>}/>
    <Route path='notification'element={<Notifications/>}/>
    <Route path='reset'element={<ResetPassword/>}/>
    <Route path='edit_fine/:id' element={<Edit_fine/>}/>
    <Route path='edit_bus/:id' element={<Edit_bus/>}/>
    <Route path='attendance/:id' element={<Attendance/>}/>
    <Route path='teacher/' element={<Teacher_Stdt/>}/>
  
   
    </Routes>
  </BrowserRouter>
   </div>
    </>
  )
}

export default App
