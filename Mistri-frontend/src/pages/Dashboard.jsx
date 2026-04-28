import React, {useContext} from "react";
import {AuthContext} from "@/context/Auth.context";
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";
import {User, Mail, Phone, MapPin, Clock, CheckCircle, XCircle, History, LogOut, Settings, Pen} from "lucide-react";
import SimplePullToRefresh from "@/components/SimplePullToRefresh";

const Dashboard = () => {
  const {mistri, CheckMistri, mistriLoading} = useContext(AuthContext);

  if (mistriLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // Calculate order statistics
  const totalOrders = mistri?.acceptedOrder?.length + mistri?.rejectedOrders?.length || 0;
  const pendingOrders = mistri?.orders?.filter((order) => order.status === "pending").length || 0;
  const completedOrders = mistri?.acceptedOrder?.length || 0;
  const cancelledOrders = mistri?.rejectedOrders?.length || 0;

  const stats = [
    {label: "Total Bookings Orders", value: totalOrders, icon: Clock, color: "bg-blue-100 text-blue-600"},
    {label: "Pending", value: pendingOrders, icon: History, color: "bg-yellow-100 text-yellow-600"},
    {label: "Completed", value: completedOrders, icon: CheckCircle, color: "bg-green-100 text-green-600"},
    {label: "Cancelled", value: cancelledOrders, icon: XCircle, color: "bg-red-100 text-red-600"},
  ];
  const handleRefresh = async () => {
    try {
      // await CheckMistri();
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  };
  return (
    <div className="w-full  dark:bg-black dark:text-white bg-gray-100 overflow-y-auto px-4 ">
      <div className="w-full pb-[200px] py-6 ">
        {/* Profile Card */}

        <SimplePullToRefresh onRefresh={handleRefresh}>
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900  rounded-xl shadow-sm p-4">
                <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center mb-3`}>
                  <stat.icon size={20} />
                </div>
                <h3 className="text-lg font-semibold truncate">{stat.label}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          
        </SimplePullToRefresh>
      </div>
    </div>
  );
};

export default Dashboard;
