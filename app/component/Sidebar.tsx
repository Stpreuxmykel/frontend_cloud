"use client";

import { MdClose } from "react-icons/md";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CiCreditCard1 } from "react-icons/ci";

import {
  MdHome,
  MdFavorite,
  MdPerson,
  MdAdd,
  MdList,
  MdRssFeed,
  MdNotifications,
  MdLogout,
} from "react-icons/md";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";
import { getToken, logout, verifyInterest, verifyProfile } from "../lib/auth";
import { useRouter } from "next/navigation";

import { MdAddHomeWork } from "react-icons/md";
import {
  getId,
  getNotification,
  getPropertiesBasedOnUserLocation,
  getUserActualPlan,
} from "../api/action";
import toast from "react-hot-toast";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);
  const [googleToken, setGoogleToken] = useState("");
  const [userId, setuserId] = useState();
  const [googleInterest, setGoogleInterest] = useState("");
  const [userInterest, setUserInterest] = useState("");
  const [notification, setNotification] = useState(0);

  const [pIds, setPIds] = useState([])

  const { data: testsession } = useSession();
  const router = useRouter();

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const userInterestVerify = verifyInterest();
  const userProfile = verifyProfile();
  const [behavior, setBehavior] = useState(false);

  const user_id = getId();

  

  const plan_value = getUserActualPlan();

  const handleLogout = () => {
    if (token) {
      logout();
      router.push("/login");
    }
  };

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const result = await getPropertiesBasedOnUserLocation();
        console.log("location property: ", result.properties);
        const propertyIds = [...new Set(result.properties.map(property => property.id))];
        setPIds(propertyIds)
        console.log("propertyIds : ",propertyIds ); 


        setBehavior(result.has_not_read_yet);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchNofication = async () => {
      const result = await getNotification();
      console.log("Notification data : ", result);
      setNotification(result.notification_count);
    };

    fetchNofication();
  }, []);

  const markAsRead = async () => {
   
    try {
      const response = await axios.post(
        `${api_url}/notifications/mark-as-read/${user_id}/`,
      );
      router.push("/subs");
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  const nextRead = async () => {
    if (pIds.length === 0) {
      console.log("No property ids.");
      router.push("/subs");
      return; // Exit early
    }
    try {
      const response = await axios.post(
        `${api_url}/properties/mark-as-read/`, {
          user_id : user_id,
          property_ids: pIds,
        }
      );
      router.push("/my_feed");
    } catch (error) {
      console.error("Failed to mark notifications for property as read:", error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed  bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-gradient-to-r from-blue-900/90 via-blue-800/50 to-transparent shadow-xl backdrop-blur-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Sidebar Content */}
        <div className="flex h-full flex-col">
          {/* Dashboard Header */}
          <div
            onClick={() => router.push("/dashboard")}
            className="mb-10 cursor-pointer mt-20 flex items-center justify-center border-b border-white/10 pb-6"
          >
            <h1 className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
              Dashboard
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 px-4">
            <Link
              href="/"
              className="group flex items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              <MdHome className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />
              Accueil
            </Link>

            {/* Repeat for other links with similar structure */}
            <Link
              href="/profile"
              className="group flex items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              <MdPerson className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />
              Profile
            </Link>

            <Link
              href="/create"
              className="group flex items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              <MdAddHomeWork className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />
              Ajouter
            </Link>

            <Link
              href="/my_list"
              className="group flex items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              <MdList className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />
              Mes Proprietes
            </Link>

            <Link
              onClick={nextRead}
              href=""
              className="group flex items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              <span className="relative">
                <MdRssFeed className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />

                {behavior && (
                  <span className="absolute -top-1 -right-1 h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-slow-ping rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
                  </span>
                )}
              </span>
              Mon fil d'actualités
            </Link>

            <Link
              onClick={markAsRead}
              href=""
              className="relative group flex items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              {/* 🔔 Icon with notification badge */}
              <div className="relative mr-3">
                <MdNotifications className="text-lg opacity-70 transition-opacity group-hover:opacity-100" />

                {notification > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
                    {notification > 10 ? `${10}+` : notification}
                  </span>
                )}
              </div>
              Notifications
            </Link>

            <Link
              href="/digital_cart"
              className="group flex items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              <CiCreditCard1 className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />
              Carte Virtuelle
            </Link>

            {/* Add other navigation links here */}

            <button
              onClick={handleLogout}
              className="group flex w-full items-center rounded-lg py-3 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              <MdLogout className="mr-3 text-lg opacity-70 transition-opacity group-hover:opacity-100" />
              Se déconnecter
            </button>
            {plan_value !== "true" ? (
              <button
                onClick={() => router.push("/plan")}
                className="px-6 py-2 mx-3 bg-gradient-to-r from-green-400/20 to-cyan-400/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl cyber-font">⚡</span>
                  <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent text-lg font-semibold">
                    UPGRADE
                  </span>
                  <span className="text-xl cyber-font animate-pulse">➔</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => router.push("/manage")}
                className="px-6 py-1 mx-3 bg-gradient-to-r from-green-400/20 to-cyan-400/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="bg-gradient-to-r text-sm font-bold  from-cyan-400 to-green-400 bg-clip-text text-transparent">
                    Gérer votre plan
                  </span>
                  <span className="text-xl cyber-font animate-pulse">➔</span>
                </div>
              </button>
            )}
          </nav>

          {/* Close Button */}
          <button
            className="absolute top-6 right-4 rounded-full p-2 transition-colors hover:bg-white/10 md:hidden"
            onClick={toggleSidebar}
          >
            <MdClose className="text-2xl text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
