import React, {useState, useEffect, useContext} from "react";
import {userContext} from "@/context/Auth.context";
import {XCircle, CheckCircle, HistoryIcon} from "lucide-react";
import {motion} from "framer-motion";
import SimplePullToRefresh from "@/components/SimplePullToRefresh";
const Notification = () => {
  const {user, CheckUser, History} = useContext(userContext);
  const handleRefresh = async () => {
    await CheckUser();
  };
  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000); // Difference in seconds

    if (diff < 60) return `${diff} seconds ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };
  return (
    <div className="w-full h-full p-4 mt-2 overflow-y-auto">
      <SimplePullToRefresh onRefresh={handleRefresh}>
        <h3 className="font-bold text-2xl mb-1">Notifications </h3>
        <hr />
        {user?.history ? (
          user.history
            .slice()
            .reverse()
            .map((history, i) => (
              <div
                key={i}
                className="w-full px-2 bg-zinc-50 dark:bg-zinc-900 rounded-md shadow-xl flex items-center justify-start mt-2">
                <div className="flex items-center justify-start mt-1">
                  {history?.status === "accepted" ? (
                    <div className={`w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3`}>
                      <CheckCircle />
                    </div>
                  ) : history?.status === "pending" ? (
                    <div className={`w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3`}>
                      <HistoryIcon />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3`}>
                      <XCircle />
                    </div>
                  )}
                  <span className="w-full mb-2 ml-2 overflow-hidden">
                    {history.status === "accepted" ? (
                      <span className="w-full flex flex-wrap">
                        Your order for <p className="text-blue-600 mx-1">{history.mistri.profession}</p> was
                        <span className="text-green-600 mx-1 flex-shrink-0">{history?.status}</span>
                        by
                        <span className="flex-1 min-w-0 truncate overflow-hidden whitespace-nowrap text-ellipsis mx-1 text-zinc-500">
                          {history?.mistri?.mistriname}
                        </span>
                      </span>
                    ) : history.status === "pending" ? (
                      <span className="w-full flex overflow-hidden">
                        Your order is
                        <span className="text-blue-600  flex-shrink-0">{history?.status}</span>
                      </span>
                    ) : (
                      <span className="w-full flex flex-wrap">
                        Your order for <p className="text-blue-600 mx-1">{history.mistri.profession}</p> was
                        <span className="text-red-600 mx-1 flex-shrink-0">{history?.status}</span>
                        by
                        <span className="flex-1 min-w-0 truncate overflow-hidden whitespace-nowrap text-ellipsis mx-1 text-zinc-500">
                          {history?.mistri?.mistriname}
                        </span>
                      </span>
                    )}

                    <p className="text-xs font-light text-zinc-400">{timeAgo(history?.createdAt)}</p>
                  </span>
                </div>
              </div>
            ))
        ) : (
          <>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No order history</h3>
              <p className="mt-1 text-sm text-gray-500">No any notifications</p>
            </motion.div>
          </>
        )}
      </SimplePullToRefresh>
    </div>
  );
};

export default Notification;
