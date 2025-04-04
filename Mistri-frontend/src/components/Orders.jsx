import React, {useState} from "react";
import {formatDistanceToNow} from "date-fns";

/**
 * Orders component for displaying individual order history items
 *
 * @param {Object} props
 * @param {Object} props.order - The order data
 */
const Orders = ({order}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {addSuffix: true});
  };

  return (
    <div className={`dark:bg-zinc-900 dark:text-white bg-white rounded-lg shadow-md p-4 my-4  cursor-pointer`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <img
            src="https://imgs.search.brave.com/oJmhCNRk22fQdZbu84cZUAGtfWey9UBMhi06dAXg6lw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jcmVhdGUtcGlj/dHVyZS10aGF0LXJl/cHJlc2VudHMtZGl2/ZXJzZS10ZWFtLWNv/bnN0cnVjdGlvbi13/b3JrZXJzLXN1Z2dl/c3RpbmctY29sbGFi/b3JhdGl2ZS1lXzkz/OTAzMy0xMDI1NDYu/anBnP3NpemU9NjI2/JmV4dD1qcGc"
            alt={order.user?.username}
            className="w-12 h-12 shadow-xl border border-black rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">{order.user?.username.slice(0, 10)}...</h3>
            <p className="text-gray-600 text-sm">{order.user?.profession}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{order.orderDate}</p>
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
          <p className="font-medium truncate">{order.user?.address}</p>
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
