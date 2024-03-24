import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  const isSuperUser = decodedToken?.is_superuser;
  const [deleteStatus, setDeleteStatus] = useState(false);
  

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/authentication/notifications/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      console.log(response.data)
      setNotifications(response.data);
    })
    .catch((error) => {
      console.log(error)
    })
  }, [deleteStatus]);

  const handleAcceptApplication = async (userId,notificationId) => {
    try {
      // Call your API to accept the user application
      // For example:
       console.log(userId)
       
      console.log(notificationId)
      console.log("inside try")
      await axios.post("http://127.0.0.1:8000/authentication/approval/",{
        id: userId,
        is_active: true,
        notification_id:notificationId
      });
      setDeleteStatus(!deleteStatus);
      window.location.href = "/notification"
      // Mark notification as read
      setNotifications(notifications.map(notification =>
        notification.id === userId ? { ...notification, is_read: true } : notification
      ));
     
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  // const handleDeleteNotification = async (notificationId) => {
  //   try {
  //     // Call your API to delete the notification
  //     // For example:
  //     await axios.post('http://127.0.0.1:8000/authentication/approval/',{
  //       id: notificationId,
  //       is_active: false
  //     });
  //     // Remove notification from the list
  //     setNotifications(notifications.filter(notification => notification.id !== notificationId));
  //   } catch (error) {
  //     console.error('Error deleting notification:', error);
  //   }
  // };

  const handleRejectApplication = async (userId,notificationId) => {
    try {
      // Call your API to accept the user application
      // For example:
       console.log(notificationId)
       console.log(userId)
      // console.log(notificationId)
      console.log("inside try")
      
      await axios.post("http://127.0.0.1:8000/authentication/approval/",{
        id: userId,
        is_active: false,
        notification_id:notificationId
      });
      
      setDeleteStatus(!deleteStatus);
      window.location.href = "/notification"
      // Mark notification as read
      setNotifications(notifications.map(notification =>
        notification.id === userId ? { ...notification, is_read: true } : notification
      ));
      
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
      <Sidebar/>
      <div>
        
        {notifications.length === 0 ? (
         <div className='text-center '> 
        <p className='text-3xl font-bold text-red-500'>No new notifications</p>
        </div>
      ) : (

        <div>
        <h2 className='text-4xl text-white'>Notifications</h2>
        <ul>
          {notifications.slice().reverse().map(notification => (
            <div key={notification.id} className="bg-white p-4 my-2 border rounded">
              <p className="mb-2">{notification.message}</p>
              {notification.message.includes('(ID:') && (
                <>
                  {isSuperUser && (
                    <>
                      <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => {
                    const match = notification.message.match(/\(ID: (\d+)\)/);
                    if (match) {
                      const userId = match[1];
                      handleAcceptApplication(userId,notification.id);
                    }}}>Accept</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() =>  {const match = notification.message.match(/\(ID: (\d+)\)/);
                    if (match) {
                      const userId = match[1]; 
                      handleRejectApplication(userId,notification.id);
                  }}}>Reject</button>
                    </>
                  )}

                </>
              )}
            </div>
          ))}
        </ul>
        </div>
      )}
      </div>
    </div>
  );
};

export default Notifications;
