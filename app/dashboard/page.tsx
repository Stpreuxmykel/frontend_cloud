"use client";
import { useState, useEffect } from 'react';
import Sidebar from '../component/Sidebar';
import { RiArrowRightLine, RiHome5Line, RiMenuFold3Fill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { getToken } from "../lib/auth";
import { useSession } from "next-auth/react";
import axios from 'axios';
import CircularProgressBar from '../component/Progress';
import { FaSpinner } from "react-icons/fa";
import { getUserInterest, getUserProfile, getUserProperties, getVirtualCard, getUserActualPlan, getTotal, getPlanType, getPropertiesBasedOnUserLocation } from '../api/action';
import PropertyCard from '../component/PropertyCard';

import { CiMenuKebab } from "react-icons/ci";



type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  country: string;
  state: string;
  property_id:string;
  type: string;
  city:string;
  address: string;
  currency:string;
  status:string;
  decision: string;
  image: string;
  images?: { imageUrl: string }[];
};


interface PropertyCardProps {
  property: Property;
}


const Dashboard: React.FC<PropertyCardProps> = ({property}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [googleData, setGoogleData] = useState('');
  const [userData, setUserData] = useState('');
  const [loading, setLoading] = useState(true);  // Start loading as true
  const [verifyG, setVerifyG] = useState("");
  const [googleInterest,setGoogleInterest] = useState("");
  const router = useRouter();
  const token = getToken();
  const { data: session } = useSession();
  const [globalInterest, setGlobalInterest] = useState("");
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  const [basicAccount, setBasicAccount] = useState(25); // Default 25% for account creation
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [interestCompletion, setInterestCompletion] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);

  const [verification, setVerification]  = useState(false)
  


  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL

   const finalPercentage = basicAccount + profileCompletion + interestCompletion;

useEffect(()=> {
  if(!token) {
    setVerification(true)
    router.push("/login")
   }

}, [router, token])
  
  
   const actualPlan = getUserActualPlan();
   const totalP = getTotal();
   const type = getPlanType();

  
  

   useEffect(()=> {

    const fetchCardDate = async () => {
      try {
      const card = await getVirtualCard()
      console.log("Virtual card data: ", card);
    }catch(error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchCardDate()

   }, [])


  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userData = await getUserProfile();
        console.log("userData Profile: ", userData);
        if (userData?.user) {
          setProfileCompletion(50); // If profile is completed, add 50%
        }
  
        // Fetch user interests
        const userInterestData = await getUserInterest();
        console.log("userInterestData: ", userInterestData);
        if (userInterestData?.name) {
          setInterestCompletion(25); // If user has interests, add 25%
        }
  
        // Fetch user properties
        const response = await getUserProperties();
        console.log("response: ", response);
        localStorage.setItem("total", response?.total_properties );
        setAllProperties(response?.properties);
        setTotalProperties(response?.total_properties);
       
       
        console.log("All properties of this user: ", response);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If not mounted yet, return nothing (used to avoid hydration errors)
  if (!isMounted) return null;





  
  const truncateTitle = (title: any, maxLength: number) => {
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + "...";
    }
    return title;
  };

  const redirect = (id:any, propertyId:any) => {
    localStorage.setItem("propertyId", id)
    router.push(`/properties/${propertyId}`)
  }


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
    <div className="relative min-h-screen  bg-gradient-to-br  from-blue-900 via-blue-800 to-blue-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="transition-all  z-60 duration-300 md:ml-64">
        {/* Mobile Menu Button */}
        <button
          className="fixed top-20 left-2 mt-1  z-50 flex items-center space-x-2 rounded-lg   text-white transition-color md:hidden"
          onClick={toggleSidebar}
        >
          {/* <CiMenuKebab /> */}
          <CiMenuKebab className='text-2xl'  />
        </button>

        <div className="transform  transition-transform">
            <CircularProgressBar percentage={finalPercentage} />
          </div>       


        {/* Content Container */}
        <div className="relative z-10 p-8 text-white">
          {/* Decorative Elements */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-10">
            <div className="absolute right-32 top-20 h-48 w-48 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-30 mix-blend-screen blur-xl"></div>
            <div className="absolute bottom-10 left-24 h-32 w-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 opacity-20 mix-blend-screen blur-xl"></div>
          </div>

          {/* Hero Section */}
          <div className="relative mb-12 group">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 blur-3xl transition-opacity group-hover:opacity-60"></div>
            <div className="relative h-64 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <img
                src="/images/h4.webp"
                alt="Luxury Home"
                className="h-full w-full object-cover opacity-90 mix-blend-soft-light"
              />
              <div className="absolute inset-0 flex items-center p-8">
                <h3 className="text-4xl font-bold tracking-tight">
                  Welcome to Your Property Hub
                </h3>
              </div>
            </div>
          </div>



          {/* Stats Grid and Content */}

                 {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl mr-4">
                <RiHome5Line className="text-2xl text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Total Properties</p>
                <p className="text-2xl font-bold"> {totalProperties} </p>
              </div>
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <div className="w-3/4 h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
            </div>
          </div>

          {/* Repeat similar blocks for other stats */}
        </div>

        {/* Property Grid */}
        <PropertyCard properties={allProperties}  className="grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"/>
        
        
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
