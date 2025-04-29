"use client";
import { useState, useEffect } from 'react';
import Sidebar from '../component/Sidebar';
import { RiMenuFold3Fill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { getToken } from "../lib/auth";
import { useSession } from "next-auth/react";
import axios from 'axios';
import CircularProgressBar from '../component/Progress';
import { FaSpinner } from "react-icons/fa";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [googleData, setGoogleData] = useState('');
  const [userData, setUserData] = useState('');
  const [basic_account, setPercentage] = useState(0); 
  const [profile_completion, setUpdatePercent] = useState(0);
  const [interest_completion, setNewPercent] = useState(0);
  const [loading, setLoading] = useState(true);  // Start loading as true
  const [verifyG, setVerifyG] = useState("");
  const [googleInterest,setGoogleInterest] = useState("");
  const router = useRouter();
  const token = getToken();
  const { data: session } = useSession();
  const [globalInterest, setGlobalInterest] = useState("");

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL

  const finalPercentage = basic_account + profile_completion + interest_completion;




  useEffect(() => {
    const timer = setTimeout(() => {
      const my_google_data = session;
      const my_regular_data = token;
      if (my_google_data || my_regular_data) {
        console.log("There is a session for at least one user type");
      } else {
        console.log("There is NO session for users at all");
        router.push('/login');
      }
      setLoading(false); // Stop loading after session/token check
    }, 500); // Wait for 0.5 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [session, router, token]);



  useEffect(() => {
  

    if (!token && !session) return;

    if (typeof window !== 'undefined') {
   
      const profile_info = localStorage.getItem('profile_info')
      const new_profile =  JSON.parse(profile_info)
      
     

      const interest_info = localStorage.getItem('interest_info')
      const new_interest =  JSON.parse(interest_info)
      console.log("Interest info data here now : ",   new_interest)

      if(new_interest) {
        if (new_interest.name) {
          setNewPercent(25)
          setGlobalInterest(new_interest.name)
        }
    
      }
  
     if (new_profile) {
      if (new_profile.user) {
        setUserData(new_profile)
        setUpdatePercent(50)
      }
     }
     

      if(session || token) {
        setPercentage(25);
      }

}
 
   
  }, [session, token]);
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const redirectUser = () => {
 

    if(!userData ) {
      router.push('/complete_profile')
    }



    if(!globalInterest){
      router.push('/user_interest')
    }
  
  }


  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If not mounted yet, return nothing (used to avoid hydration errors)
  if (!isMounted) return null;

  // Show loading until data is available
  if(loading) {
    return (
      <div className="flex justify-center items-center mt-52">
        <div className="text-center">
       
            <div className="flex items-center">
              <FaSpinner className="animate-spin text-3xl mr-2 text-sky-500" /> {/* Icon with spin animation */}
              <span className="text-xl font-bold">Checking...</span>
            </div>
        
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 md:block">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-10 text-gray-700 overflow-y-auto ${isSidebarOpen ? '' : 'w-full'} md:ml-64`}>
        <div className="flex justify-between">
          <div 
            className="md:hidden flex items-center space-x-2 p-2 mb-4 w-10 text-blue-800 border border-blue-800 rounded-md cursor-pointer hover:bg-blue-800 hover:text-white transition-colors duration-300" 
            onClick={toggleSidebar}>
            <RiMenuFold3Fill className="text-xl" />
          </div>
          <div>
            <CircularProgressBar percentage={finalPercentage} />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-semibold">Bienvenue sur votre dashboard</h3>
        </div>

        {googleData && googleInterest || userData   ? (
          <>
            <p>Vous avez déjà complété votre profile {session?.user?.name || userData?.firstname}</p> 
            <button  
              onClick={() => router.push('/create')}
              className='p-2 rounded-xl text-white bg-gradient-to-r mt-3 from-indigo-500 via-purple-500 to-pink-500'>
              Publier vos propriétés
            </button>
          </>
        ) : (
          <>
            <p>S'il vous plaît, veuillez compléter votre profile pour continuer</p> 
            
            <button  
              onClick={redirectUser}
              className='p-2 rounded-xl text-white bg-gradient-to-r mt-3 from-indigo-500 via-purple-500 to-pink-500'>
             Compléter votre profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
