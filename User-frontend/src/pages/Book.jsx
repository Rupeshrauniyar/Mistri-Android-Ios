import React, {useContext, useEffect, useState} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {userContext} from "../context/Auth.context";
import {Button} from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
import PageHeader from "@/components/ui/PageHeader";
import {Calendar, Clock, MapPin, Phone, Mail, Home, IndianRupee, ArrowLeft, CheckCircle, Loader2, Star} from "lucide-react";

const Book = () => {
  const navigate = useNavigate();
  const {user, userLoading, setUser} = useContext(userContext);

  const [mistri, setMistri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [charges, setCharges] = useState(null);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const {id: mistriId} = useParams();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchMistriDetails();
  }, []);

  const fetchMistriDetails = () => {
    setLoading(true);
    axios
      .post(`${backendURL}/user/book/fetch/mistri`, {mistriId})
      .then(function (response) {
        if (response && response.data.status === "OK" && response.data.mistri) {
          setMistri(response.data.mistri);
          setCharges(response.data.mistri.charges);
        } else {
                    navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error fetching mistri details:", error);
              })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();

    if (!time || !date) {
      return     }

    setSubmitting(true);
    const bookingData = {
      userId: user._id,
      mistriId,
      charges: charges || mistri.charges,
      time,
      date,
    };

    axios
      .post(`${backendURL}/user/booking/confirm`, bookingData)
      .then(function (response) {
        if (response && response.data.status === "OK" && response.data.mistri && response.data.order && response.data.user) {
          setUser((prev) => ({
            ...prev,
            orders: [...prev.orders, response.data.order],
          }));
                    setTimeout(() => navigate("/bookings"), 2000);
        } else if (response && response.data.status === "BAD") {
                  }
      })
      .catch((error) => {
        console.error("Error confirming booking:", error);
              })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Loading state
  if (userLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
        <p className="text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to book a service with this mistri.</p>
          <Link to="/login">
            <Button className="bg-black hover:bg-gray-800 text-white w-full py-6">Login to Continue</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if mistri data is available
  if (!mistri) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Mistri Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the mistri you're looking for.</p>
          <Link to="/">
            <Button className="bg-black hover:bg-gray-800 text-white w-full py-6">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userFields = [
    {
      name: "email",
      value: user.email,
      disabled: true,
      label: "Email",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      name: "contactNumber",
      value: user.contactNumber,
      disabled: true,
      label: "Contact Number",
      icon: <Phone className="w-5 h-5" />,
    },
    {
      name: "address",
      value: user.address,
      disabled: true,
      label: "Address",
      icon: <Home className="w-5 h-5" />,
    },
  ];

  const isAlreadyBooked = user && user.orders && user.orders.some((order) => order.mistri === mistri._id);

  return (
    <>
      {/* <ToastContainer position="top-center" /> */}
      <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100  w-full overflow-hidden pb-[70px] my-4">
        {/* Header */}
    
        {/* Back Button */}
        <div className=" pt-3">
          <button
            onClick={() => navigate(-1)}
            
            className="ml-4 flex items-center text-gray-600 hover:text-black transition-colors duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        <div className="w-full  px-4 overflow-y-auto h-full pb-[200px]">
          {/* Mistri Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transform transition-all duration-300 hover:shadow-lg ">
            <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6">
              <div className="flex items-center">
                <div className="mr-4 relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      className="w-full h-full object-cover"
                      src={mistri.profileImage}
                      alt={mistri.mistriname}
                    />
                  </div>
                  {mistri.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{mistri.mistriname}</h1>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-300 mr-4">{mistri.profession}</span>
                    <div className="flex items-center">
                      <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        4.8
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-gray-300 text-sm">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate max-w-xs">{mistri.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Service Charge</h3>
         
                </div>
                <div className="flex items-center text-green-600 font-bold text-xl">
                  <IndianRupee className="w-5 h-5 mr-1" />
                  <span>{mistri.charges}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Available 7 days a week</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">Quick response</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-md mb-6 transform transition-all duration-300 hover:shadow-lg">
            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold mb-1">Booking Details</h2>
              <p className="text-gray-500 text-sm">Select your preferred date and time</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500 group-hover:text-black transition-colors duration-200" />
                      Appointment Date
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="orderDate"
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  {!date && <p className="mt-1 text-xs text-amber-600">Please select a date</p>}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500 group-hover:text-black transition-colors duration-200" />
                      Appointment Time
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="orderTime"
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  {!time && <p className="mt-1 text-xs text-amber-600">Please select a time</p>}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-2 text-gray-500 group-hover:text-black transition-colors duration-200" />
                    Service Charge 
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="charges"
                    defaultValue={mistri.charges}
                    onChange={(e) => setCharges(e.target.value)}
                    className="w-full p-3  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    min={mistri.charges}
                    required
                  />
                
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <span className="inline-block w-4 h-4 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs">i</span>
                  Minimum charge is ₹{mistri.charges}. You can increase the amount if needed.
                </p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transform transition-all duration-300 hover:shadow-lg">
            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold mb-1">Your Information</h2>
              <p className="text-gray-500 text-sm">This information will be shared with the service provider</p>
            </div>

            <div className="p-6 space-y-4">
              {userFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center border-b pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="bg-gray-100 p-3 rounded-full mr-4 text-gray-600">{field.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500">{field.label}</p>
                    <p className="font-medium">{field.value || "Not provided"}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Link to="/profile">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Profile Information
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Booking Button */}
          <div className="fixed xl:bottom-0 right-0 sm:px-4 xl:w-[80%] sm:w-full sm:bottom-[55px] shadow-lg  z-50  md:px-0">
            <div className=" ">
              <div className="bg-white border-t p-4 shadow-lg rounded-t-xl backdrop-blur-md bg-opacity-95">
                {isAlreadyBooked ? (
                  <div className="flex flex-col items-center">
                    <Button
                      disabled
                      className="w-full bg-gray-800 text-white py-6 flex items-center justify-center opacity-90 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Already Booked
                    </Button>
                    <Link
                      to="/bookings"
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200">
                      View your bookings
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={handleConfirmBooking}
                      disabled={submitting || !date || !time}
                      className={`
                        w-full py-6 flex items-center justify-center rounded-lg
                        ${
                          !date || !time
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-black hover:bg-gray-800 text-white transform hover:-translate-y-1 transition-all duration-200"
                        }
                      `}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Confirm Booking</>
                      )}
                    </Button>
                    {(!date || !time) && <p className="text-center text-xs text-amber-600 mt-2">Please select both date and time to proceed</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Book;
