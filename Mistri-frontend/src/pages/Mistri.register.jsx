"use client";

import {useState, useContext, useRef, useEffect} from "react";
import axios from "axios";

import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/Auth.context";
import {Loader2, Upload} from "lucide-react";

const MistriRegister = () => {
  const {setMistri} = useContext(AuthContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isMounted = useRef(true);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    mistriname: "",
    address: "",
    contactNumber: "",
    profession: "",
    charges: "",
    profileImage: "",
    idProof: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    mistriname: "",
    address: "",
    contactNumber: "",
    profession: "",
    charges: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [displayIdProofImage, setDisplayIdProofImage] = useState(null);
  const [displayProfileImage, setDisplayProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newFieldErrors = {
      email: "",
      password: "",
      mistriname: "",
      address: "",
      contactNumber: "",
      profession: "",
      charges: "",
      profileImage: "",
      idProof: "",
    };

    // Email validation
    if (!formData.email) {
      newFieldErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newFieldErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newFieldErrors.password = "Password is required";
      isValid = false;
    }

    // Name validation
    if (!formData.mistriname) {
      newFieldErrors.mistriname = "Name is required";
      isValid = false;
    }

    // Address validation
    if (!formData.address) {
      newFieldErrors.address = "Address is required";
      isValid = false;
    }

    // Contact number validation
    if (!formData.contactNumber) {
      newFieldErrors.contactNumber = "Contact number is required";
      isValid = false;
    }

    // Profession validation
    if (!formData.profession) {
      newFieldErrors.profession = "Profession is required";
      isValid = false;
    }

    // Charges validation
    if (!formData.charges) {
      newFieldErrors.charges = "Charges are required";
      isValid = false;
    }

    // File validation
    if (!profileImage) {
      newFieldErrors.profileImage = "Profile image is required";
      isValid = false;
    }

    if (!idProof) {
      newFieldErrors.idProof = "ID proof is required";
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const idProofFnc = (idProofFile) => {
    setIdProof(idProofFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setDisplayIdProofImage(reader.result);
    };

    reader.readAsDataURL(idProofFile);

    // Clear error when file is selected
    if (fieldErrors.idProof) {
      setFieldErrors((prev) => ({
        ...prev,
        idProof: "",
      }));
    }
  };

  const profileImageFnc = (profileImageFile) => {
    setProfileImage(profileImageFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setDisplayProfileImage(reader.result);
    };
    reader.readAsDataURL(profileImageFile);

    // Clear error when file is selected
    if (fieldErrors.profileImage) {
      setFieldErrors((prev) => ({
        ...prev,
        profileImage: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitFormData = new FormData();
    for (const key in formData) {
      submitFormData.append(key, formData[key]);
    }
    submitFormData.append("profileImage", profileImage);
    submitFormData.append("idProof", idProof);

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/mistri/register`, submitFormData);

      if (response.data.status === "OK") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("mistri", JSON.stringify(response.data.mistri));

        setMistri(response.data.mistri);

        // Set redirecting state to prevent multiple clicks
        setIsRedirecting(true);

        // toast.success("Registration Successful")

        navigate("/");
      } else {
        // toast.error(response.data.message)
        setErrorMessage(response?.data?.message || "An error occurred. Please try again.");
        setLoading(false);
        setIsRedirecting(false);
      }
    } catch (error) {
      // toast.error(error.response?.data?.message || "An error occurred. Please try again.")
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
      setLoading(false);
      setIsRedirecting(false);
    } finally {
      setIsRedirecting(false);
      if (isMounted.current && !isRedirecting) {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const requiredFields = [
    {
      name: "mistriname",
      label: "Full Name",
      type: "text",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
      ),
      placeholder: "Enter your full name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
      ),
      placeholder: "Enter your email address",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
      ),
      placeholder: "Create a password",
    },
    {
      name: "contactNumber",
      label: "Contact Number",
      type: "text",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path>
        </svg>
      ),
      placeholder: "Enter your contact number",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path>
        </svg>
      ),
      placeholder: "Enter your address",
    },
    {
      name: "profession",
      label: "Profession",
      type: "select",
      option: [
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
      ],
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M17 8V2H20C20.5523 2 21 2.44772 21 3V7C21 7.55228 20.5523 8 20 8H17ZM15 22C15 22.5523 14.5523 23 14 23H10C9.44772 23 9 22.5523 9 22V8H2.5V6.07437C2.5 5.7187 2.68891 5.3898 2.99613 5.21059L8.5 2H15V22Z"></path>
        </svg>
      ),
      placeholder: "Select your profession",
    },
    {
      name: "charges",
      label: "Charges",
      type: "number",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M22.0049 5.99979H15.0049C11.6912 5.99979 9.00488 8.68608 9.00488 11.9998C9.00488 15.3135 11.6912 17.9998 15.0049 17.9998H22.0049V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V5.99979ZM15.0049 7.99979H23.0049V15.9998H15.0049C12.7957 15.9998 11.0049 14.2089 11.0049 11.9998C11.0049 9.79065 12.7957 7.99979 15.0049 7.99979ZM15.0049 10.9998V12.9998H18.0049V10.9998H15.0049Z"></path>
        </svg>
      ),
      placeholder: "Enter your charges",
    },
  ];

  return (
    <div className="w-full min-h-screen overflow-y-auto flex items-center justify-center dark:bg-black dark:text-white text-black bg-gray-50 ">
      <div className="w-full h-full max-w-2xl ">
        <div className="text-center mt-8">
          <h2 className="text-3xl font-extrabold dark:text-gray-200 text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm dark:text-gray-300 text-gray-600">Register as a service provider</p>
        </div>

        <div className=" dark:bg-gray-900 shadow-md rounded-xl p-6 pb-[250px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate>
            {errorMessage && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                role="alert">
                <p>{errorMessage}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requiredFields.map((field, index) => (
                <div
                  key={index}
                  className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium dark:text-white text-gray-700">
                    {field.label}
                  </label>
                  <div className="relative dark:text-white">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none dark:text-white">{field.svg}</div>

                    {field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        disabled={loading || isRedirecting}
                        className="appearance-none dark:text-white dark:bg-black block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 dark:focus:ring-zinc-300 focus:ring-black focus:border-black sm:text-sm transition-all duration-200">
                        <option
                          value=""
                          disabled>
                          {field.placeholder}
                        </option>
                        {field.option.map((option, optIndex) => (
                          <option
                            key={optIndex}
                            value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        disabled={loading || isRedirecting}
                        className={`appearance-none dark:text-white dark:bg-black block w-full pl-10 pr-3 py-3 border ${
                          fieldErrors[field.name] ? "border-red-500" : "border-gray-300"
                        } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 dark:focus:ring-zinc-300 focus:ring-black focus:border-black sm:text-sm transition-all duration-200`}
                      />
                    )}
                  </div>
                  {fieldErrors[field.name] && <p className="mt-1 text-sm text-red-600">{fieldErrors[field.name]}</p>}
                </div>
              ))}
            </div>

            <div className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium dark:text-white text-gray-700 mb-2">ID Proof</label>
                <div
                  onClick={() => document.getElementById("idProof").click()}
                  className={`cursor-pointer border-2 border-dashed ${
                    fieldErrors.idProof ? "border-red-500" : displayIdProofImage ? "border-gray-300" : "border-gray-300 hover:border-gray-400"
                  } dark:border-gray-700 rounded-xl p-4 transition-all duration-200 flex flex-col items-center justify-center h-48`}>
                  {displayIdProofImage ? (
                    <img
                      src={displayIdProofImage || "/placeholder.svg"}
                      alt="ID Proof"
                      className="h-full max-h-40 object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Click to upload your ID proof</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Supported formats: JPG, PNG, PDF</p>
                    </div>
                  )}
                  <input
                    id="idProof"
                    type="file"
                    className="hidden"
                    onChange={(e) => idProofFnc(e.target.files[0])}
                    accept="image/*,.pdf"
                    disabled={loading || isRedirecting}
                  />
                </div>
                {fieldErrors.idProof && <p className="mt-1 text-sm text-red-600">{fieldErrors.idProof}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white text-gray-700 mb-2">Profile Image</label>
                <div
                  onClick={() => document.getElementById("profileImage").click()}
                  className={`cursor-pointer border-2 border-dashed ${
                    fieldErrors.profileImage ? "border-red-500" : displayProfileImage ? "border-gray-300" : "border-gray-300 hover:border-gray-400"
                  } dark:border-gray-700 rounded-xl p-4 transition-all duration-200 flex flex-col items-center justify-center h-48`}>
                  {displayProfileImage ? (
                    <img
                      src={displayProfileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full max-h-40 object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Click to upload your profile image</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Supported formats: JPG, PNG</p>
                    </div>
                  )}
                  <input
                    id="profileImage"
                    type="file"
                    className="hidden"
                    onChange={(e) => profileImageFnc(e.target.files[0])}
                    accept="image/*"
                    disabled={loading || isRedirecting}
                  />
                </div>
                {fieldErrors.profileImage && <p className="mt-1 text-sm text-red-600">{fieldErrors.profileImage}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm">
                <span className="dark:text-white text-gray-600">Already have an account? </span>
                <Link
                  to="/login"
                  className="font-medium dark:text-white text-black hover:text-gray-800 transition-colors">
                  Sign in
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isRedirecting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white dark:bg-zinc-900 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ">
              {loading || isRedirecting ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {isRedirecting ? "Redirecting..." : "Registering..."}
                </div>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MistriRegister;
