"use client";
import { useState, useEffect } from 'react';
import Sidebar from '../component/Sidebar';
import { RiMenuFold3Fill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { getToken } from "../lib/auth";
import { useSession, signIn } from "next-auth/react";
import axios from 'axios';
import { Console } from 'console';
import PropertyCard from '../component/PropertyCard';

import { MdOutlineNotificationsActive } from "react-icons/md";
import { getPropertiesBasedOnUserSubscription } from '../api/action';

import { CiMenuKebab } from "react-icons/ci";


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [googleData, setGoogleData] = useState('');
  const [userData, setUserData] = useState('');
  const [properties, setProperties] = useState([]);

  const token = getToken()
  const { data: session } = useSession();

  

  const api_url= process.env.NEXT_PUBLIC_BACKEND_API_URL
  
  const router = useRouter();

    useEffect(()=> {
        if(!token) {
          router.push("/login")
         }
      
      }, [router, token])


      useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await getPropertiesBasedOnUserSubscription();
            console.log("The property you're looking for subscription: ", result);
            setProperties(result); // Set propertyState with the fetched result
          } catch (error) {
            console.error("Error fetching properties subscription:", error);
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

  if (!isMounted) return null;

  return (
    <div className="flex h-screen z-40 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />


      {/* Main Content */}
      <div className={`flex-1 p-10 text-gray-700 overflow-y-auto z-60 ${isSidebarOpen ? '' : 'w-full'} md:ml-64`}>
       
            <button
                       className="fixed top-20 left-2 mt-1  z-50 flex items-center space-x-2 rounded-lg   text-white transition-color md:hidden"
                       onClick={toggleSidebar}
                     >
                       {/* <CiMenuKebab /> */}
                       <CiMenuKebab className='text-2xl'  />
                     </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-white">Les publications de mes abonnes</h2>
        </div>

        <div className="container mx-auto p-4">
        <div>
          {Array.isArray(properties) && properties.length > 0 ? (
            <PropertyCard properties={properties} className="grid-cols-1 sm:grid-cols-3 lg:grid-cols-3"/>
          ) : (
            <p className='text-slate-400 ml-[-15px]'>Aucune propriété disponible. 🏡</p>
          )}
        </div>
      </div>
      
        
        
      </div>
    </div>
  );
};

export default Dashboard;
