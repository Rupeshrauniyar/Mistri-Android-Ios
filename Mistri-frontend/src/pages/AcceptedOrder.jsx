import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
const BACKEDNURL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import AcceptedOrderComp from "@/components/AcceptedOrdersComp";
import {Loader} from "lucide-react";
const AcceptedOrder = () => {
  const URL = useParams();
  const [fetched, setFetched] = useState(false);
  const [acceptedOrder, setAcceptedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const GetAcceptedOrder = async () => {
    const id = URL.id;
    const Data = {
      id,
    };
    await axios.post(`${BACKEDNURL}/mistri/fetch/particular-accepted-order`, Data).then(function (res) {
      if (res.data.status === "OK" && res.data.order) {
        setAcceptedOrder([])
        setAcceptedOrder(res.data.order);
        setLoading(false);
      } else {
        setAcceptedOrder([]);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    if (URL) {
      try {
        GetAcceptedOrder();
      } catch (err) {
        console.log(err);
      }
    }
  }, []);
  return (
    <div className="w-full h-full">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin slow-spin" />
        </div>
      ) : acceptedOrder?._id ? (
        <>
          <AcceptedOrderComp acceptedOrder={acceptedOrder} />
        </>
      ) : (
        <>No accepted Order</>
      )}
    </div>
  );
};

export default AcceptedOrder;
