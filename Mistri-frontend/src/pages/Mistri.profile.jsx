import React, {useContext} from "react";
import {AuthContext} from "@/context/Auth.context";
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";
import {User, Mail, Phone, MapPin, Clock, CheckCircle, XCircle, History, LogOut, Settings, Pen} from "lucide-react";
import SimplePullToRefresh from "@/components/SimplePullToRefresh";

const MistriProfile = () => {
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
          <div className="bg-white dark:bg-zinc-900  rounded-xl shadow-sm p-6 mb-6">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {mistri.mistriname?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{mistri.mistriname}</h2>
                  <p className="text-gray-500">Member since {new Date(mistri.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="sm:hidden xl:block flex items-center space-x-4 mb-10">
                <Link to="edit-profile">
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
                    <Pen
                      size={20}
                      className="mr-2"
                    />
                    Edit profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* mistri Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-white">
                <User size={20} />
                <span>{mistri.mistriname}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-white">
                <Mail size={20} />
                <span>{mistri.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-white">
                <Phone size={20} />
                <span>{mistri.contactNumber}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-white">
                <MapPin size={20} />
                <span>{mistri.address}</span>
              </div>
            </div>
            <div className="xl:hidden sm:block flex items-center space-x-4 mt-2">
              <Link to="edit-profile">
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  <Pen
                    size={20}
                    className="mr-2"
                  />
                  Edit profile
                </Button>
              </Link>
            </div>
          </div>

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
          <div className="grid grid-cols-2 gap-4">
            <Link to="/settings">
              <Button className="w-full dark:bg-zinc-800 bg-black text-white hover:bg-gray-800">
                <Settings
                  size={20}
                  className="mr-2"
                />
                Settings
              </Button>
            </Link>
            <Link to="/logout">
              <Button
                variant="outline"
                className="w-full border-2 border-black dark:text-white dark:bg-zinc-800 text-black hover:bg-gray-100">
                <LogOut
                  size={20}
                  className="mr-2"
                />
                Logout
              </Button>
            </Link>
          </div>
        </SimplePullToRefresh>
      </div>
    </div>
  );
};

export default MistriProfile;
