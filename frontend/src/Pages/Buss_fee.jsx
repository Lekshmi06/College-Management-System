
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const Bus_fee = () => {
  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const admin = decodedToken?.is_superuser;
  const teacher = decodedToken?.teacher;
  const [existingFees, setExistingFees] = useState([]);
  const [amounterror, setAmounterror] = useState("");
  const [locationerror, setLocationerror] = useState("");
  const { id } = useParams();
  const [formData, setFormData] = useState({
    location: "",
    fee_amount: "",
    student: id,
  });
  const navigate = useNavigate("");

  const handleNavigate = (id) => {
    navigate(`/edit_bus/${id}`);
  };

  useEffect(() => {
    // Fetch existing fines for the student
    axios
      .get(`http://127.0.0.1:8000/authentication/stdt_bus/${id}/`)
      .then((response) => {
        setExistingFees(response.data);
        console.log(response.data);
        if (response.data.length > 0) {
          setIsFormDisabled(true); // Disable the form if bus fee details exist
        }
      })
      .catch((error) => {
        console.error("Error fetching existing fines:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasErrors = false;
    if (!formData.fee_amount) {
      console.log("amount is empty");
      setAmounterror("Amount field is empty !");
      hasErrors = true;
    } else {
      setAmounterror("");
    }
    if (!formData.location) {
      console.log("location is empty");
      setLocationerror("Location field is empty");
      hasErrors = true;
    } else {
      setLocationerror("");
    }
    if (!hasErrors) {
      console.log(formData.location);
      console.log(formData.fee_amount);
      axios
        .post("http://127.0.0.1:8000/authentication/busfee/", formData)
        .then((response) => {
          console.log(response.data);
          navigate(`/profile/${id}`);
        })
        .catch((error) => {
          console.log("Error response:", error.response);
          console.log(error);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/authentication/bus_id/${id}/`)
      .then((response) => {
        console.log("Bus fee deleted successfully:", response.data);
        console.log(id);
        setDeleteStatus(!deleteStatus);
      })
      .catch((error) => {
        console.error("Error updating fine:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gradient-to-r from-black to-cyan-500">
      <Sidebar />
      <div className="flex flex-col items-center justify-center gap-10 w-full">
        {admin && isFormDisabled ? (
          <div className="container text-center mx-auto bg-white bg-opacity-15 p-4 rounded shadow-lg">
            <h1 className="text-4xl  text-white font-bold mb-4">
              Bus fee Details
            </h1>
            {existingFees ? (
              existingFees.map((existingfee) => (
                <div className="text-left text-white" key={existingfee.id}>
                  <p className="text-2xl ">
                    <strong>Location:</strong> {existingfee.location}
                  </p>
                  <p className="text-2xl ">
                    <strong>Amount:</strong> {existingfee.fee_amount}
                  </p>
                  {admin && (
                    <div className="flex flex-row mt-5 gap-10">
                      <button
                        onClick={() => handleNavigate(existingfee.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(existingfee.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        ) : (
          <div>
            { !teacher &&
            <div>
            <div className="text-white text-4xl font-semibold pl-3 mb-10">Add 
            Bus Fee</div>
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="max-w-md mx-auto  bg-white bg-opacity-15 p-7 rounded-lg mt-8"
          >
            <div className="mb-6">
              <label
                htmlFor="location"
                className="block text-gray-100 text-sm font-bold mb-2"
              >
                Location:
              </label>
              <div>{locationerror}</div>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="fee_amount"
                className="block text-gray-100 text-sm font-bold mb-2"
              >
                Amount:
              </label>
              <div>{amounterror}</div>
              <input
                type="number" 
                id="fee_amount"
                name="fee_amount"
                value={formData.fee_amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
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
         }
         </div>
        
        
        )}
      </div>
    </div>
  );
  
};

export default Bus_fee;