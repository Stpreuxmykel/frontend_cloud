"use client";
import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import { RiMenuFold3Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { getToken } from "../lib/auth";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import { Console } from "console";
import PropertyCard from "../component/PropertyCard";

import { MdOutlineNotificationsActive } from "react-icons/md";
import { TbWaveSawTool } from "react-icons/tb";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [googleData, setGoogleData] = useState("");
  const [userData, setUserData] = useState("");
  const [properties, setProperties] = useState([]);

  const token = getToken();
  const { data: session } = useSession();

  console.log("the token is : ", token);

  const router = useRouter();

  const api_url= process.env.NEXT_PUBLIC_BACKEND_API_URL

  useEffect(() => {
    const fetchGoogleUserData = async () => {
      if (session) {
        try {
          // User is logged in via Google
          const response_data = await axios.get(
            `${api_url}/get-google-user-profile/${session?.user?.email}`
          );
          setGoogleData(response_data.data);
          console.log("The actual Google user profile: ", response_data.data);

          // Get property related to the Google user's state
          const response_data_user = await axios.get(
            `${api_url}/get_property/${response_data.data.state}`
          );
          console.log("Related info: ", response_data_user.data);

          const { google_user_properties, user_properties } =
            response_data_user.data;

          // Log the response data to check its structure
          console.log("Google User Properties: ", google_user_properties);
          console.log("User Properties: ", user_properties);

          // Combine both arrays
          const combinedProperties = [
            ...google_user_properties,
            ...user_properties,
          ];

          // Set the properties
          setProperties(combinedProperties);

          const response_sub = await axios.post(
            `${api_url}/subscribed-properties/`,
            {
              subscriber_id: response_data.data.id,
              subscriber_type: "regular", // 'regular' or 'google'
            }
          );

          console.log("Subscribed properties:", response_sub.data);
        } catch (error) {
          console.error("An error occurred while fetching the data:", error);
        }
      }

      if (token) {
        try {
          const response_data = await axios.get(
            `${api_url}/get-user-profile/`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              },
            }
          );
          setUserData(response_data.data);
          console.log("The actual user profile: ", response_data.data);

          const response_data_user = await axios.get(
            `${api_url}/get_property/${response_data.data.state}`
          );
          const { google_user_properties, user_properties } =
            response_data_user.data;

          // Log the response data to check its structure
          console.log("Google User Properties: ", google_user_properties);
          console.log("User Properties: ", user_properties);

          // Combine both arrays
          const combinedProperties = [
            ...google_user_properties,
            ...user_properties,
          ];

          // Set the properties
          setProperties(combinedProperties);
        } catch (error) {
          console.error("Error fetching user profile: ", error);
        }
      }
    };
    fetchGoogleUserData();
  }, [session, token, api_url]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 md:block">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-10 text-gray-700 overflow-y-auto ${
          isSidebarOpen ? "" : "w-full"
        } md:ml-64`}
      >
        <div
          className="md:hidden flex items-center space-x-2 p-2 mb-4 w-10 text-blue-800 border border-blue-800 rounded-md cursor-pointer hover:bg-blue-800 hover:text-white transition-colors duration-300"
          onClick={toggleSidebar}
        >
          <RiMenuFold3Fill className="text-xl" />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Bienvenue sur votre  fil d'actualités</h2>

          <div className="flex space-x-4">
            {" "}
            {/* Adjust space between icons */}
            <span
              className="text-sky-500 cursor-pointer"
              onClick={() => router.push("/recommendations")}
            >
              <TbWaveSawTool size={26} />
            </span>
            <span
              className="text-sky-500 cursor-pointer"
              onClick={() => router.push("/subs")}
            >
              <MdOutlineNotificationsActive size={26} />
            </span>
          </div>
        </div>

        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(properties) && properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <p>Aucune propriété disponible.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
