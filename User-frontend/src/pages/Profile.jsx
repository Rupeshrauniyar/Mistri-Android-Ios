import React, { useContext } from "react";
import { userContext } from "@/context/Auth.context";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  History,
  LogOut,
  Settings
} from "lucide-react";

const Profile = () => {
  const { user } = useContext(userContext);

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // Calculate order statistics
  const totalOrders = user.orders?.length || 0;
  const pendingOrders = user.orders?.filter(order => order.status === 'pending').length || 0;
  const completedOrders = user.orders?.filter(order => order.status === 'accepted').length || 0;
  const cancelledOrders = user.orders?.filter(order => order.status === 'rejected').length || 0;

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: Clock, color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending', value: pendingOrders, icon: History, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Completed', value: completedOrders, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Cancelled', value: cancelledOrders, icon: XCircle, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="w-full h-full bg-gray-50 overflow-y-auto pb-[150px]">
     

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <User size={20} />
              <span>{user.username}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Mail size={20} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Phone size={20} />
              <span>{user.contactNumber}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <MapPin size={20} />
              <span>{user.address}</span>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4">
              <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center mb-3`}>
                <stat.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/settings">
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              <Settings size={20} className="mr-2" />
              Settings
            </Button>
          </Link>
          <Link to="/logout">
            <Button variant="outline" className="w-full border-2 border-black text-black hover:bg-gray-100">
              <LogOut size={20} className="mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
