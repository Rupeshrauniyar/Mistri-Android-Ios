import React, {useEffect, useState, useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import SearchComp from "@/components/SearchComp";
import axios from "axios";
import MistriList from "@/components/MistriList";
import {Search as SearchIcon, ArrowLeft, Filter, X, Loader2} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
// import ScrollComponent from "@/components/ScrollComponent";
import SimplePullToRefresh from "@/components/SimplePullToRefresh";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Search = () => {
  const [mistris, setMistris] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [error, setError] = useState(false);
  const [searchedVal, setSearchedVal] = useState("");
  const [allowSuggestions, setAllowSuggestions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Extract the 'q' parameter from the URL
  const getQueryParam = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    return query;
  }, [location.search]);

  const searchQuery = getQueryParam();
  const searchWithProfession = async () => {
    try {
      const response = await axios.post(`${backendURL}/api/user/search`, {query: searchQuery});

      if (response.status === 200 && response.data.message === "success") {
        setMistris(response.data.mistri);
      } else {
        setMistris([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setMistris([]);
    } finally {
      setLoading(false);
    }
  };
  // Fetch search results when query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchedVal(searchQuery);
      setAllowSuggestions(false);
      setLoading(true);

      searchWithProfession();
    } else {
      setAllowSuggestions(true);
      setMistris([]);
    }
  }, [searchQuery]);

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

  // Popular categories for quick access
  const popularCategories = ["Electrician", "Plumber", "Carpenter", "Painter", "Handyman", "HVAC Technician"];

  const searchFnc = (e) => {
    setSearchedVal(e);

    if (e.length > 0) {
      setAllowSuggestions(true);
      const searchTerm = e.trim().toLowerCase();
      const filteredOptions = MistriOptions.filter((option) => option.toLowerCase().includes(searchTerm)).slice(0, 10); // Limit to 10 results for better performance

      setSearchFilter(filteredOptions);
      setError(filteredOptions.length === 0);
    } else {
      setSearchFilter([]);
      setError(false);
    }
  };

  const handleClearSearch = () => {
    setSearchedVal("");
    setSearchFilter([]);
    navigate("/search");
  };

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleSearchSubmit = (term) => {
    if (term) {
      navigate(`/search?q=${term}`);
    }
  };

  const handleRefresh = () => {
    searchWithProfession();
  };

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto dark:bg-black dark:text-white">
      {/* Fixed Header */}

      <div className="flex-shrink-0 bg-white dark:bg-zinc-900 shadow-md z-30">
        {/* Search Controls */}
        <div className="p-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-black transition-colors duration-200 mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          {/* Search Input */}
          <div className="flex items-center bg-white dark:bg-zinc-900 dark:text-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="pl-4 text-gray-400">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchedVal}
              onChange={(e) => searchFnc(e.target.value)}
              placeholder="Search for services..."
              className="w-full py-3 px-3 focus:outline-none dark:bg-zinc-900 dark:text-white "
            />
            {searchedVal && (
              <button
                onClick={handleClearSearch}
                className="pr-4 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto dark:bg-black bg-gray-50">
        <div className="w-full mx-auto px-4 py-4">
          {/* Search Suggestions */}
          {allowSuggestions && searchFilter.length > 0 && (
            <div className="mb-4">
              <div className="bg-white dark:bg-zinc-900 dark:text-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {searchFilter.map((search, i) => (
                  <div
                    key={i}
                    onClick={() => handleSearchSubmit(search)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                    <span className="bg-gray-100 rounded-full p-2 mr-3 flex items-center justify-center">
                      <SearchIcon className="w-4 h-4 text-gray-600" />
                    </span>
                    <p className="text-gray-700">{search}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Categories */}
          {allowSuggestions && !searchQuery && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Popular Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {popularCategories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/search?q=${category}`}
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 flex items-center">
                    <span className="dark:text-white  text-gray-800 truncate">{category}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {!allowSuggestions && (
            <div>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4 dark:text-white ">
                <h2 className="text-lg font-semibold">
                  {loading ? "Searching..." : mistris.length > 0 ? `Results for "${searchQuery}"` : `No results for "${searchQuery}"`}
                </h2>

                <button className="flex items-center text-gray-600 bg-white dark:bg-zinc-900 dark:text-white px-3 py-2 rounded-lg shadow-sm hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
                  <p className="text-gray-600">Searching for professionals...</p>
                </div>
              ) : mistris.length > 0 ? (
                <div className="pb-[50px]">
                  <MistriList
                    mistris={mistris}
                    showBookingBtns={true}
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 dark:text-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-16 h-16 dark:bg-black bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8 dark:text-white  text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">We couldn't find any professionals matching "{searchQuery}".</p>
                  <p className="text-gray-600">Try checking your spelling or using more general terms.</p>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {error && searchedVal && (
            <div className="bg-white dark:bg-zinc-900 dark:text-white rounded-xl shadow-sm p-6 text-center mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No suggestions found for "{searchedVal}"</h3>
              <p className="text-gray-600">Try checking your spelling or using more general terms.</p>
            </div>
          )}

          {/* Bottom Spacer for Mobile */}
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Search;
