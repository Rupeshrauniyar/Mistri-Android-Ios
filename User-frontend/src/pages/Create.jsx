import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {userContext} from "@/context/Auth.context";
import {useNavigate} from "react-router-dom";
import {Calendar, Clock, IndianRupee, Briefcase, ArrowLeft, Loader2} from "lucide-react";

const Create = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const {user, userLoading} = useContext(userContext);

  useEffect(() => {
    if (user && user._id) {
      setFormData((prev) => ({
        ...prev,
        user: user._id,
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Charges || formData.Charges <= 0) {
      newErrors.Charges = "Please enter a valid amount";
    }

    if (!formData.Date) {
      newErrors.Date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.Date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.Date = "Date cannot be in the past";
      }
    }

    if (!formData.Time) {
      newErrors.Time = "Please select a time";
    }

    if (!formData.Profession) {
      newErrors.Profession = "Please select a profession";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (!user || !user._id) {
      toast.error("You must be logged in to create an order");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${backendURL}/user/booking/create`, formData, {
        headers: {Authorization: `Bearer ${user.token}`},
      });

      if (response.data && response.data.order) {
        toast.success("Order created successfully!");
        navigate("/bookings");
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      user: user?._id,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const MistriOptions = [
    "Carpenter",
    "Painter",
    "Electrician",
    "Plumber",
    "HVAC Technician",
    "Roofer",
    "Drywall Installer",
    "Handyman",
    "Tiler",
    "Floor Installer",
    "Mason",
    "Bricklayer",
    "Landscaper",
    "Gardener",
    "Pest Control Technician",
    "Locksmith",
    "Window Installer",
    "Insulation Installer",
    "General Contractor",
    "Appliance Repair Technician",
    "Home Security Installer",
    "Cabinet Maker",
    "Welder",
    "Glass Installer",
    "Gutter Cleaner",
    "Chimney Sweep",
    "Concrete Finisher",
    "Fencing Installer",
    "Deck Builder",
    "Pool Technician",
    "Garage Door Installer",
    "Grout Specialist",
    "Waterproofing Specialist",
    "Solar Panel Installer",
    "Driveway Sealer",
    "Fence Painter",
    "Pressure Washer",
    "Tree Trimmer",
    "Woodworker",
    "Framer",
    "Siding Installer",
    "Stucco Specialist",
    "Door Installer",
    "Patio Builder",
    "Carpet Installer",
    "Shutter Installer",
    "Stone Mason",
    "Exterior Painter",
    "Interior Decorator",
    "Fence Builder",
    "Furniture Assembler",
    "Septic Tank Technician",
    "Roof Cleaner",
    "Hardwood Floor Specialist",
    "Ironworker",
    "Scaffolder",
    "Curtain Installer",
    "Gate Installer",
    "Driveway Installer",
    "Tile Cleaner",
    "Cabinet Installer",
    "Fence Repair Specialist",
    "Gazebo Builder",
    "Water Heater Installer",
    "Lighting Installer",
    "Soundproofing Installer",
    "Burglar Alarm Installer",
    "Electrical Engineer",
    "Glazier",
    "Plasterer",
    "Stone Paver Installer",
    "Solar Water Heater Installer",
    "Vinyl Siding Installer",
    "Fireplace Installer",
    "Duct Cleaner",
    "Drainage Installer",
    "Fireproofing Specialist",
    "Wall Panel Installer",
    "Security System Technician",
    "Foundation Repair Specialist",
    "Handrail Installer",
    "Insulation Blower",
    "Basement Waterproofing",
    "Heating Installer",
    "Home Organizer",
    "Lawn Care Worker",
    "Outdoor Lighting Installer",
    "Garage Remodeler",
    "Ventilation Specialist",
    "Storm Door Installer",
    "Deck Stainer",
    "Swimming Pool Cleaner",
    "Window Treatment Installer",
    "Railing Installer",
    "Sliding Door Installer",
    "Gate Welder",
    "Jacuzzi Installer",
    "Metal Fabricator",
    "Wood Floor Refinisher",
    "Roof Repair Specialist",
    "Bathroom Remodeler",
    "Kitchen Remodeler",
  ];

  // Popular categories for quick selection
  const popularProfessions = ["Electrician", "Plumber", "Carpenter", "Painter", "Handyman", "HVAC Technician"];

  if (userLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 ">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to create an order.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50  overflow-y-auto pb-[150px]">
      <ToastContainer position="top-center" />

      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black transition-colors duration-200">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create an Order</h1>
          <p className="text-gray-600 mt-2">Find the best professionals at your preferred price</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            {/* Charges Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <IndianRupee className="w-4 h-4 mr-2 text-gray-500" />
                  Service Charge (per hour)
                </div>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={formData.Charges || ""}
                  onChange={(e) => handleInputChange("Charges", e.target.value)}
                  className={`w-full pl-8 pr-3 py-3 border ${
                    errors.Charges ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.Charges && <p className="mt-1 text-sm text-red-500">{errors.Charges}</p>}
            </div>

            {/* Date and Time Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    Appointment Date
                  </div>
                </label>
                <input
                  type="date"
                  value={formData.Date || ""}
                  onChange={(e) => handleInputChange("Date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full p-3 border ${
                    errors.Date ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200`}
                />
                {errors.Date && <p className="mt-1 text-sm text-red-500">{errors.Date}</p>}
              </div>

              {/* Time Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    Appointment Time
                  </div>
                </label>
                <input
                  type="time"
                  value={formData.Time || ""}
                  onChange={(e) => handleInputChange("Time", e.target.value)}
                  className={`w-full p-3 border ${
                    errors.Time ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200`}
                />
                {errors.Time && <p className="mt-1 text-sm text-red-500">{errors.Time}</p>}
              </div>
            </div>

            {/* Profession Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  Select Professional Type
                </div>
              </label>
              <select
                value={formData.Profession || ""}
                onChange={(e) => handleInputChange("Profession", e.target.value)}
                className={`w-full p-3 border ${
                  errors.Profession ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 appearance-none bg-white`}>
                <option value="">Select a profession</option>
                {MistriOptions.map((profession, i) => (
                  <option
                    key={i}
                    value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
              {errors.Profession && <p className="mt-1 text-sm text-red-500">{errors.Profession}</p>}
            </div>

            {/* Popular Professions */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Popular Choices:</p>
              <div className="flex flex-wrap gap-2">
                {popularProfessions.map((profession, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleInputChange("Profession", profession)}
                    className={`px-3 py-2 text-sm rounded-full ${
                      formData.Profession === profession ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } transition-colors duration-200`}>
                    {profession}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <button
              onClick={createOrder}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 transform hover:-translate-y-1"
              } text-white font-medium`}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Order...
                </>
              ) : (
                "Create Order"
              )}
            </button>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">How it works</h2>
          </div>
          <div className="p-6">
            <ol className="space-y-4">
              <li className="flex">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                <p className="text-gray-600">Create an order with your requirements and budget</p>
              </li>
              <li className="flex">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                <p className="text-gray-600">Available professionals will be notified of your request</p>
              </li>
              <li className="flex">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                <p className="text-gray-600">Once a professional accepts, you'll be notified</p>
              </li>
              <li className="flex">
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">4</span>
                <p className="text-gray-600">The professional will arrive at your location on the scheduled date and time</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
