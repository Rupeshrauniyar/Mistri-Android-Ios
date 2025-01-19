import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {userContext} from "@/context/Auth.context";
const Create = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [Data, setData] = useState([]);

  const {user, userLoading} = useContext(userContext);
  const createOrder = async (data) => {
    if (!userLoading) {
      setData((prev) => ({
        ...prev,
        user: user._id,
      }));
      await axios
        .post(`${backendURL}/user/booking/create`, data, {
          headers: {Authorization: `Bearer ${user.token}`},
        })
        .then((res) => {
          console.log(res);
          if ((res.status === "BAD", !res.data.order)) {
            toast.error("Something went wrong...");
          } else if ((res.status === "OK", res.data.order)) {
            toast.success("Order Created Successfully");
          } else {
            toast.error("Failed to Create Order");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to Create Order");
        });
    }
  };
  const [orderFeilds, setOrderFeilds] = useState([
    {
      label: "Charges",
      type: "number",
      value: "",
    },
    {
      label: "Date",
      type: "date",
      value: "",
    },
    {
      label: "Time",
      type: "time",
      value: "",
    },
    // {
    //   label: "Profession",
    //   type: "select",
    //   value: "",
    // },
  ]);
  const MistriOptions = [
    {
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
    },
  ];
  return (
    <div className="w-full oveflow-y-auto ">
      <ToastContainer />
      <div className="w-full flex flex-col p-2">
        <h2 className="text-4xl font-bold">Create a order.</h2>
        {/* <br></br> */}
        <p className="ml-1 text-xl"> Find best mistris at your's best price.</p>
        <div className="InputsCont flex flex-wrap items-center justify-center mt-2">
          {orderFeilds.map((fields, i) => (
            <span
              className="w-full m-1 "
              key={i}>
              <h2 className="">{fields.label}</h2>
              <input
                type={fields.type}
                placeholder={fields.label}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    [fields.label]: e.target.value,
                  }))
                }
                className="p-2 rounded-md shadow-md w-full hover:border-blue-500 outline-none"
              />
            </span>
          ))}
          <span className="w-full m-1 ">
            <h2 className="">Select the mistri you want!</h2>
            <select
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  ["Profession"]: e.target.value,
                }))
              }
              className="p-2 rounded-md shadow-md w-full">
              <option value="">Select</option>
              {MistriOptions.map((mistri, i) =>
                mistri.option.map((mistriOption, i) => (
                  <option
                    key={i}
                    value={mistriOption}>
                    {mistriOption}
                  </option>
                ))
              )}
            </select>
          </span>
        </div>
        <div className="flex items-center justify-center w-full">
          <button
            onClick={() => createOrder(Data)}
            className="bg-black text-white rounded-xl px-3 py-2 ">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
