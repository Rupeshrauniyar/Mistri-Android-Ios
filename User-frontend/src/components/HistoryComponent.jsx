import React, {useState, useEffect, useContext} from "react";
import {ToastContainer, toast} from "react-toastify";
import {userContext} from "@/context/Auth.context";
import Orders from "./Orders";
import BookingNavbar from "./BookingNavbar";
const HistoryComponent = (props) => {
  const {user, setUser, userLoading} = useContext(userContext);
  const [History, setHistory] = useState([]);
  useEffect(() => {
    setHistory(user.history);
  }, [user]);
  return (
    <div className="w-full overflow-y-auto h-full  pb-[100px]">
      {props.showNavbar === true ? <BookingNavbar /> : <></>}
      {/* {console.log(user)} */}
      <ToastContainer />
      {userLoading ? (
        <h3>Loading...</h3>
      ) : (
        <div className="w-full flex flex-col">
          {History.length > 0 ? (
            <div className="px-2 xl:py-2">
              {History.slice().reverse().map((History) => (
                <Orders
                  key={History._id}
                  orders={History}
                />
              ))}
              <h3 className="mt-4 text-center">End of the results.</h3>
            </div>
          ) : (
            <>
              <div className="w-full h-full flex items-center justify-center mt-10 text-2xl font-bold">No any history</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryComponent;
