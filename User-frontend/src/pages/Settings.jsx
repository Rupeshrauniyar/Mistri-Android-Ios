import React, {useState, useContext} from "react";
import {userContext} from "../context/Auth.context";
import {Moon, Sun, Bell, BellOff, Smartphone, Mail, Shield, User, ChevronRight, LogOut} from "lucide-react";
import {Link} from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";

const Settings = () => {
  const {user} = useContext(userContext);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "light" ? false : true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const {theme, setTheme} = useContext(userContext);
  const toggleDarkMode = () => {
    localStorage.setItem("theme", "dark");
    // Here you would implement the actual dark mode logic
    setTheme("dark");
  };
  const toggleLightMode = () => {
    localStorage.setItem("theme", "light");
    setTheme("light");
  };
  const handleToggle = (label) => {
    if (theme === "light") {
      toggleDarkMode();
      setDarkMode(true);
    } else {
      toggleLightMode();
      setDarkMode(false);
    }
  };
  const settingsGroups = [
    {
      title: "Appearance",
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: "Dark mode",
          isToggle: true,
          value: darkMode,
          onChange: () => handleToggle(),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Smartphone,
          label: "Push Notifications",
          isToggle: true,
          value: pushNotifications,
          onChange: () => setPushNotifications(!pushNotifications),
        },
        {
          icon: Mail,
          label: "Email Notifications",
          isToggle: true,
          value: emailNotifications,
          onChange: () => setEmailNotifications(!emailNotifications),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Personal Information",
          link: "/profile",
          value: user?.username || "Not set",
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          link: "/privacy",
        },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen dark:bg-black  mt-3 pb-[100px]">
      <div className="px-2"></div>

      <div className="p-4">
        {settingsGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="mb-8">
            <h2 className="text-lg font-semibold mb-4 px-2">{group.title}</h2>
            <div className=" rounded-xl">
              {group.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`flex items-center justify-between p-4 ${itemIndex !== group.items.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{item.label}</span>
                  </div>

                  {item.isToggle ? (
                    <button
                      onClick={item.onChange}
                      className={`relative dark:bg-white bg-black inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                        item.value ? "" : ""
                      }`}>
                      <span
                        className={`inline-block dark:bg-black  bg-white h-4 w-4 transform rounded-full  transition duration-200 ease-in-out ${
                          item.value ? "translate-x-6 " : "translate-x-1"
                        }`}
                      />
                    </button>
                  ) : item.link ? (
                    <Link
                      to={item.link}
                      className="flex items-center text-gray-600">
                      {item.value && <span className="mr-2 text-sm text-gray-500">{item.value}</span>}
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  ) : (
                    <span className="text-gray-600">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        {user && (
          <Link to="/logout">
            <button className="w-full mt-4 p-4 flex items-center justify-center space-x-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors duration-200">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Settings;
