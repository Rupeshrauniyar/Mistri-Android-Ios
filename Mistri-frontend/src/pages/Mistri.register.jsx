import React, {useState, useContext} from "react";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Link, useNavigate} from "react-router-dom";
import {mistriContext} from "../context/Auth.context";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";

const MistriRegister = () => {
  const {mistri, setMistri} = useContext(mistriContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [inpValue, setInpValue] = useState({
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
  const [Loading, setLoading] = useState(false);
  const [displayIdProofImage, setDisplayIdProofImage] = useState(null);
  const [displayProfileImage, setDisplayProfileImage] = useState(null);

  const formData = new FormData();
  const idProofFnc = (idProofFile) => {
    setIdProof(idProofFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setDisplayIdProofImage(reader.result);
    };

    reader.readAsDataURL(idProofFile);
  };
  const profileImageFnc = (profileImageFile) => {
    setProfileImage(profileImageFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setDisplayProfileImage(reader.result);
    };
    reader.readAsDataURL(profileImageFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const key in inpValue) {
      formData.append(key, inpValue[key]);
    }
    formData.append("profileImage", profileImage);
    formData.append("idProof", idProof);
    setLoading(true);
    try {
      axios
        .post(
          `${backendUrl}/auth/mistri/register`,

          formData
        )
        .then(function (response) {
          if (response.data.status === "OK") {
            localStorage.setItem("token", response.data.token);
            setMistri(response.data.mistri);
            setTimeout(() => {
              toast.success("Registration Successful");
            }, 1000);
            navigate("/");
          } else {
            toast.error(response.data.message);
          }
        });
    } catch (error) {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  const handleInput = (e) => {
    const {name, value} = e.currentTarget;
    setInpValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const requiredFields = [
    {
      name: "mistriname",
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
      placeholder: "Mistriname",
    },
    {
      name: "email",
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
      placeholder: "Email",
    },
    {
      name: "password",
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
      placeholder: "Password",
    },
    {
      name: "contactNumber",
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
      placeholder: "Contact Number",
    },
    {
      name: "address",
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
      placeholder: "Address",
    },
    {
      name: "profession",
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
      placeholder: "Profession",
    },
    {
      name: "charges",
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
      placeholder: "Charges",
    },
  ];

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center w-full">
        {/* <div>
          <h1 className="text-3xl font-bold text-blue-500">mistri.com</h1>
        </div> */}
        <div className="xl:w-[50%]  xl:h-4/5 sm:h-[80%] sm:w-[85%] bg-white  rounded-md flex items-center justify-center flex-col overflow-y-auto">
          <div className="w-full h-full">
            <ScrollArea className="h-full w-full rounded-md border p-4">
              <form
                onSubmit={(e) => handleSubmit(e)}
                encType="multipart/form-data"
                className="">
                {requiredFields.map((requiredField, index) => (
                  <label
                    className="px-2 rounded-lg flex items-center gap-2 w-full h-[40px] mt-2 border border-2 border-zinc-200"
                    key={index}>
                    {requiredField.svg}
                    {requiredField.type === "select" ? (
                      <select
                        className="w-full h-full border-none outline-none bg-transparent px-2"
                        name={requiredField.name}
                        value={inpValue[requiredField.name]}
                        onChange={(e) => handleInput(e)}>
                        <option
                          value=""
                          disabled>
                          {requiredField.placeholder} {/* Placeholder for select */}
                        </option>
                        {requiredField.option.map((option, optindex) => (
                          <option
                            className="border-none outline-none"
                            value={option}
                            key={optindex}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        onChange={(e) => handleInput(e)}
                        name={requiredField.name}
                        type={requiredField.type}
                        className="bg-none bg-transparent grow border-none outline-none px-2"
                        placeholder={requiredField.placeholder}
                      />
                    )}
                  </label>
                ))}
                <h3 className="text-2xl tracking-tighter  ml-1 font-bold">ID proof</h3>
                <label
                  htmlFor="idProof"
                  className="custum-file-upload flex flex-col items-center justify-center h-48 overflow-hidden  w-full cursor-pointer border-2 border-dashed border-gray-300  rounded-lg shadow-lg ">
                  <div className=" w-full icon flex items-center justify-center  h-full">
                    {displayIdProofImage ? (
                      <>
                        <img
                          className="w-full object-cover h-full"
                          src={displayIdProofImage}
                        />
                      </>
                    ) : (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          width={24}
                          fill=""
                          xmlns="http://www.w3.org/2000/svg">
                          <g
                            id="SVGRepo_bgCarrier"
                            strokeWidth={0}
                          />
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                              fill=""
                            />{" "}
                          </g>
                        </svg>
                        <div className="text flex items-center justify-center">
                          <span className="text-gray-300 font-normal">Click to upload id proof</span>
                        </div>
                      </>
                    )}
                  </div>

                  <input
                    onChange={(e) => idProofFnc(e.target.files[0])}
                    name="idProof"
                    id="idProof"
                    type="file"
                    className="hidden"
                  />
                </label>

                <h3 className="text-2xl tracking-tighter  ml-1 font-bold">Profile image</h3>
                <label
                  htmlFor="imageFile"
                  className="custum-file-upload flex flex-col items-center justify-center h-48 overflow-hidden  w-full cursor-pointer border-2 border-dashed border-gray-300  rounded-lg shadow-lg ">
                  <div className=" w-full icon flex items-center justify-center   h-full">
                    {displayProfileImage ? (
                      <>
                        <img
                          className="w-full object-cover h-full"
                          src={displayProfileImage}
                        />
                      </>
                    ) : (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          width={24}
                          fill=""
                          xmlns="http://www.w3.org/2000/svg">
                          <g
                            id="SVGRepo_bgCarrier"
                            strokeWidth={0}
                          />
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                              fill=""
                            />{" "}
                          </g>
                        </svg>
                        <div className="text flex items-center justify-center">
                          <span className="text-gray-300 font-normal">Click to upload image</span>
                        </div>
                      </>
                    )}
                  </div>

                  <input
                    onChange={(e) => profileImageFnc(e.target.files[0])}
                    name="profileImage"
                    id="imageFile"
                    type="file"
                    className="hidden"
                  />
                </label>
                <div className=" w-full flex items-center sm:justify-center xl:justify-between">
                  <span className="px-1">
                    <span>Already have an account? </span>
                    <Link
                      className=" text-blue-500"
                      to="/login">
                      login
                    </Link>
                  </span>

                  <Link to="/forgot-password">
                    <span className="xl:block sm:hidden text-blue-500">Forgot Password?</span>
                  </Link>
                </div>
                <div className=" xl:hidden sm:flex items-center justify-center">
                  <Link to="/forgot-password">
                    <span className=" text-[#075CE5] ">Forgot Password?</span>
                  </Link>
                </div>
                <div className="w-full flex items-center justify-center">
                  {Loading ? (
                    <>
                      <Button className="rounded-full">Loading</Button>
                    </>
                  ) : (
                    <>
                      <Button className="rounded-full">Register</Button>
                    </>
                  )}
                </div>
              </form>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
};

export default MistriRegister;
