import React from "react";
import {formatDistanceToNow} from "date-fns";

/**
 * Orders component for displaying individual order history items
 *
 * @param {Object} props
 * @param {Object} props.order - The order data
 */
const Orders = ({order}) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {addSuffix: true});
  };

  return (
    <div className="dark:bg-zinc-900 dark:text-white bg-white rounded-lg shadow-sm p-4 mb-4 transition-all hover:shadow-md ">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={
              order.mistri?.profileImage ||
              "https://imgs.search.brave.com/oJmhCNRk22fQdZbu84cZUAGtfWey9UBMhi06dAXg6lw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jcmVhdGUtcGlj/dHVyZS10aGF0LXJl/cHJlc2VudHMtZGl2/ZXJzZS10ZWFtLWNv/bnN0cnVjdGlvbi13/b3JrZXJzLXN1Z2dl/c3RpbmctY29sbGFi/b3JhdGl2ZS1lXzkz/OTAzMy0xMDI1NDYu/anBnP3NpemU9NjI2/JmV4dD1qcGc"
            }
            alt={order.mistri?.mistriname}
            className="w-12 h-12 shadow-xl border border-black rounded-full object-cover"
          />
          <div>
            <h3 className={`font-bold text-lg ${order.mistri ? "" : "text-zinc-500 "}`}>{order.mistri ? order.mistri.mistriname.slice(0, 10) : "Pending"}</h3>
            <p className="text-gray-600 text-sm">{order.mistri ? order.mistri.profession : order.profession}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Time</p>
          <p className="font-medium">{order.orderTime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Charges</p>
          <p className="font-medium">₹{order.charges}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className={`font-medium truncate ${order.mistri ? "" : "text-gray-400"}`}>{order.mistri ? order.mistri.address : "Pending"}</p>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t">
        <p>Order ID: {order._id.slice(-8)}...</p>
        <p>{formatDate(order.createdAt)}</p>
      </div>
    </div>
  );
};

export default Orders;
