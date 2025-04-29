"use client";

import { IoIosHeartEmpty } from "react-icons/io";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, getUser, logout } from "@/app/lib/auth";
import axios from "axios";
import PropertyCard from "./component/PropertyCard";
import { v4 as uuidv4 } from "uuid";
import { fetchProperties, PlanTracking } from "./api/action";

// Define Property interface based on API response
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

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLength, setNewLength] = useState(7); // Initialize as a number
  const [session, setSession] = useState<any>(null); // Use any or a more specific type for session

  const token = getToken();
  const { data: testsession } = useSession(); // Get session from useSession hook

  console.log("The session is : ", session);
  console.log("Checking the user token: ", token);
  console.log(" properties:  ", properties);

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;



  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await PlanTracking();
  //       console.log("plan tracking data : ",  result)
  //     } catch (error) {
  //       console.error("Error fetching plan tracking:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);


  
 
  useEffect(() => {
    setSession(testsession);
  }, [testsession]);

 

  useEffect(() => {
    const fetchProperties = async () => {
      const token = getToken()
      try {
        const response = await axios.get(`${api_url}/create_property_user/`);
        console.log("Properties information : ", response.data );
      
        // Remove duplicates using a Map
        const uniqueProperties = Object.values(
          response.data.reduce((acc, property) => {
            acc[property.id] = property;
            return acc;
          }, {})
        );
      
        setTimeout(() => {
          setProperties(uniqueProperties);
          setLoading(false);
        }, 2000); // Simulated loading delay
      
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
      
    };

    fetchProperties();
    setIsMounted(true);
  }, [api_url]);



  console.log("Porperty length : ", properties.length);

  if (!isMounted) return null;

  return (
    <div className="bg-gradient-to-r min-h-screen py-8">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: newLength }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="flex items-center">
                  <div className="h-4 bg-gray-200 rounded mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : (
        
          ""
          )}

        </div>
        {!loading ?
         <PropertyCard properties={properties} className="lg:grid-cols-4 " /> 
        : ""}
       
      </div>
    
    </div>



  );
}
