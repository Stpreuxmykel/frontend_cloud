"use client";
import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import { RiHome5Line, RiMenuFold3Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { getToken } from "../lib/auth";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import { Console } from "console";
import PropertyCard from "../component/PropertyCard";

import { MdOutlineNotificationsActive } from "react-icons/md";
import { TbWaveSawTool } from "react-icons/tb";
import {
  getId,
  getNotification,
  getPropertiesBasedOnUserLocation,
} from "../api/action";
import { CiMenuKebab } from "react-icons/ci";
import toast from "react-hot-toast";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  property_id: string;
  type: string;
  country: string;
  state: string;
  city: string;
  address: string;
  category: string;
  decision: string;
  currency: string;
  liked_by_users: number[]; // Ensure this is typed as number[]
  new_phone_number: string;
  like_count: number;
  images?: { imageUrl: string }[];
}
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [googleData, setGoogleData] = useState("");
  const [userData, setUserData] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [verification, setVerification] = useState(false);
  const [notification, setNotification] = useState(0);

  const token = getToken();
  const { data: session } = useSession();

  const router = useRouter();

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const user_id = getId();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!token) {
      setVerification(true);
      router.push("/login");
    }
  }, [router, token]);

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
        `${api_url}/notifications/mark-as-read/${user_id}/`
      );
      router.push("/subs");
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      toast.error("Something went wrong. Please try again!");
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPropertiesBasedOnUserLocation();
        console.log("The property you're looking for: ", result);

        // Remove duplicates by property ID
        const uniquePropertiesMap = new Map();
        result.properties.forEach((property) => {
          if (!uniquePropertiesMap.has(property.id)) {
            uniquePropertiesMap.set(property.id, property);
          }
        });

        const uniqueProperties = Array.from(uniquePropertiesMap.values());

        setProperties(uniqueProperties); // Set state with filtered properties
        setTotal(uniqueProperties.length); // Update the total too
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (verification) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center">
          {/* Pulsing dot animation */}
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse mb-2"></div>
          {/* Optional text */}
          <span className="text-gray-600">Vérification...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen z-40 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 p-10 text-gray-700 overflow-y-auto z-60 ${
          isSidebarOpen ? "" : "w-full"
        } md:ml-64`}
      >
        <button
          className="fixed top-20 left-2 mt-1  z-50 flex items-center space-x-2 rounded-lg   text-white transition-color md:hidden"
          onClick={toggleSidebar}
        >
          {/* <CiMenuKebab /> */}
          <CiMenuKebab className="text-2xl" />
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-white">
            Bienvenue sur votre fil d'actualités
          </h2>

          <div className="flex space-x-4">
            {" "}
            {/* Adjust space between icons */}
            <span
              className="text-white cursor-pointer"
              onClick={() => router.push("/recommendations")}
            >
              <TbWaveSawTool size={26} />
            </span>
            <span
              className="relative text-white cursor-pointer"
              onClick={markAsRead}
            >
              <MdOutlineNotificationsActive size={26} />

              {notification > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
                  {notification > 10 ? "10+" : notification}
                </span>
              )}
            </span>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 shadow-xl p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl mr-4">
                <RiHome5Line className="text-2xl text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Total Properties</p>
                <p className="text-2xl font-bold text-white"> {total} </p>
              </div>
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <div className="w-3/4 h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
            </div>
          </div>

          {/* Repeat similar blocks for other stats */}
        </div>

        <PropertyCard
          properties={properties}
          className="grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"
        />

        {/* <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(properties) && properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <p>Aucune propriété disponible.</p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
