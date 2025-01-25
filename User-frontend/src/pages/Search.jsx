import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import SearchComp from "@/components/SearchComp";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;
import MistriComponent from "@/components/Mistri.component";
const Search = () => {
  const [mistris, setMistris] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [error, setError] = useState(false);
  const [searchedVal, setSearchedVal] = useState();
  const [allowSuggestions, setAllowSuggestions] = useState(true);

  const location = useLocation(); // Get the current location (URL)

  // Extract the 'q' parameter from the URL
  const getQueryParam = () => {
    const params = new URLSearchParams(location.search); // Use location.search
    const query = params.get("q");
    return query;
  };

  const searchQuery = getQueryParam(); // Get query from URL

  useEffect(() => {
    if (searchQuery) {
      setAllowSuggestions(false); // Allow suggestions to be shown after query load
      const SearchWithProfession = async () => {
        try {
          const response = await axios.post(`${backendURL}/api/user/search`, {query: searchQuery});
          console.log(response);

          if (response.status === 200 && response.data.message === "success") {
            setMistris(response.data.mistri);
          } else {
            setMistris([]);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          setMistris([]); // Optionally handle the error more gracefully
        }
      };
      SearchWithProfession();
    }
  }, [searchQuery]); // Ensure effect runs on searchQuery change

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

  const searchFnc = (e) => {
    if (allowSuggestions === false) {
      setAllowSuggestions(true);
    }
    if (e.length > 0) {
      setSearchedVal(e);
      const searchTerm = e.trim().toLowerCase();
      const filteredOptions = MistriOptions.filter((option) => option.toLowerCase().includes(searchTerm));
      setSearchFilter(filteredOptions);
      setError(filteredOptions.length === 0);
    } else {
      setSearchFilter([]);
    }
  };

  return (
    <div className="w-full p-2">
      {console.log(mistris)}
      {allowSuggestions ? (
        <>
          <SearchComp fnc={searchFnc} />
          <div className="Suggestion w-full flex flex-col overflow-y-auto h-[71vh] noScroll">
            {error ? (
              <h3 className="text-center">No search term found: "{searchedVal}"</h3>
            ) : (
              searchFilter.map((search, i) => (
                <Link
                  to={`/search?q=${search}`}
                  key={i}>
                  <div className="flex items-center">
                    <span className="bg-zinc-200 rounded-full p-2 flex w-[35px] items-center justify-center ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-5 h-5">
                        <path
                          fillRule="evenodd"
                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <p className=" mt-1 p-2 rounded-md cursor-pointer">{search}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <Link
            to="/search"
            className="flex mt-3">
            <SearchComp fnc={searchFnc} />
          </Link>

          {mistris.length > 0 ? (
            <>
              <MistriComponent
                mistris={mistris}
                showBookingBtns={true}
              />
            </>
          ) : (
            <h3 className="text-center mt-4">No result found...</h3>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
