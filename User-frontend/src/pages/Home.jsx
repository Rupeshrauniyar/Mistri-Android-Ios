import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import Search from "../components/SearchComp";
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginComp from "../components/Login.component";
import MistriSkeletonLoading from "../components/Mistri.skeleton.loading";
import {userContext} from "../context/Auth.context";
import MistriComponent from "../components/Mistri.component";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";
import {mistriContext} from "../context/Mistris.context";
import MistriList from "@/components/MistriList";
import PageHeader from "@/components/ui/PageHeader";
import {motion} from "framer-motion";
const Home = () => {
  const {mistris, setMistris} = useContext(mistriContext);
  const [mistrisLoadingArray, setMistrisLoadingArray] = useState([{}, {}, {}, {}, {}, {}, {}, {}]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [hidden, sethidden] = useState(true);
  const {user, setUser, userLoading} = useContext(userContext);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    if (mistris.length < 1) {
      fetchMistris();
    } else {
      setMistris(mistris);
      setLoading(false);
    }
  }, []);
  const fetchMistris = () => {
    axios.get(`${backendURL}/user/fetch/mistri`).then(function (response) {
      if (response && response.data.status === "OK" && response.data.mistri.length > 0) {
        setMistris(response.data.mistri);
      } else if (response && response.data.status === "OK" && response.data.mistri.length === 0) {
        setMistris([]);
      }
      setLoading(false);
    });
  };

  return (
    <>
      {/* {console.log(mistris)} */}
      <div className={` ${hidden === true ? "hidden" : "flex"} items-center justify-center xl:w-[80%] sm:w-full h-full fixed z-20`}>
        <div className="w-full h-full blur z-10 relative"></div>
        <div className="absolute z-30 mb-60 flex items-center justify-between xl:w-[40%] sm:w-[85%]">
          <div></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => sethidden(true)}
            aria-label="Close"
            className="p-1 hover:text-red-500 transition-all cursor-pointer"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24">
            <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
          </svg>
        </div>
        <div className="z-20 absolute w-full h-full flex flex-col items-center justify-center">
          <LoginComp
            doRedirect={false}
            setHidden={hidden}
          />
        </div>
      </div>
      <ToastContainer />
      <div className="flex flex-col w-full h-full bg-zinc-100 p-2 overflow-y-auto sm:pb-[130px] xl:pb-[200px] mt-4 ">
        <PageHeader
          title="Discover Mistris."
          subtitle="Find best and pocket friendly Mistris."
        />
        <Link
          to={"/search"}
          className="flex mt-4">
          <Search />
        </Link>

        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -20}}
          transition={{duration: 0.3}}
          className="noScroll w-full xl:h-[80%]   flex flex-wrap  ">
          {loading ? (
            <MistriSkeletonLoading />
          ) : userLoading ? (
            <MistriSkeletonLoading />
          ) : user && user.acceptedOrder.length > 0 ? (
            mistris.length > 0 ? (
              <>
                <MistriList
                  mistris={mistris}
                  showBookingBtns={true}
                />
              </>
            ) : (
              <>
                <>
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <h3 className="xl:text-5xl sm:text-2xl font-bold">No mistri available.</h3>
                    <p className="text-lg ">
                      Either,you can create a order.
                      <Link
                        className="text-blue-500 ml-1"
                        to="/create">
                        Create
                      </Link>
                    </p>
                  </div>
                </>
              </>
            )
          ) : mistris.length > 0 ? (
            <>
              <MistriList
                mistris={mistris}
                showBookingBtns={true}
              />
            </>
          ) : (
            <>
              <>
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <h3 className="xl:text-5xl sm:text-2xl font-bold">No mistri available.</h3>
                  <p className="text-lg ">
                    Either,you can create a order.
                    <Link
                      className="text-blue-500 ml-1"
                      to="/create">
                      Create
                    </Link>
                  </p>
                </div>
              </>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Home;
