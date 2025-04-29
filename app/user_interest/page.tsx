"use client";

import Sidebar from "../component/Sidebar";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { getToken, verifyInterest, verifyProfile } from "../lib/auth";
import { useSession } from "next-auth/react";
import { RiMenuFold3Fill } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { getId } from "../api/action";

const interestsList = [
  "Maisons de luxe",
  "Propriétés en bord de mer",
  "Vie urbaine",
  "Vie rurale",
  "Maisons de montagne",
  "Maisons écologiques",
  "Maisons intelligentes",
  "Propriétés d'investissement",
  "Premier achat immobilier",
  "Maisons familiales",
  "Communautés de retraités",
  "Communautés sécurisées",
  "Propriétés historiques",
  "Architecture moderne",
  "Architecture traditionnelle",
  "Propriétés en bord de l'eau",
  "Résidences secondaires",
  "Propriétés à louer",
  "Condos",
  "Maisons de ville",
  "Maisons multifamiliales",
  "Maisons unifamiliales",
  "Propriétés commerciales",
  "Lofts",
  "Fermes",
  "Plans ouverts",
  "Espaces de bureaux à domicile",
  "Propriétés acceptant les animaux",
  "Maisons avec piscines",
  "Jardins",
  "Maisons économes en énergie",
  "Maisons neuves",
  "Propriétés à rénover",
  "Espaces verts",
  "Vues sur la ville",
  "Vie en banlieue",
  "Logements abordables",
  "Domaines campagnards",
  "Maisons Art déco",
  "Maisons du milieu du siècle",
  "Maisons minimalistes",
  "Locations de luxe",
  "Locations de vacances",
  "Espaces de cohabitation",
  "Tiny Houses (petites maisons)",
  "Maisons accessibles",
  "Maisons avec maisons d'amis",
  "Maisons avec sous-sols",
  "Maisons avec garages",
  "Appartements en hauteur",
];

const UserIntress = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [googleToken, setGoogleToken] = useState("");
  const [googleInterest, setGoogleInterest] = useState("");
  const [userInterest, setUserInterest] = useState("");

  const itemsPerPage = 10;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  // const [token, setToken] = useState(null);
 
  
  const token = getToken();
  const userId = getId();
  
  const interest = verifyInterest();
  const profile= verifyProfile();

      useEffect(()=> {
          if(!token) {
            router.push("/login")
           }
        
        }, [router, token])

  
  if (interest == "true" && profile == "true" && interest != null) {
    router.push("/dashboard");
  }

  if (profile == "false" && interest == "true") {
    router.push("/complete_profile");
  }


  

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelect = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Replace with actual token retrieval logic
    // Create FormData object
    const formData = new FormData();

    formData.append("name", JSON.stringify(selectedInterests));
    formData.append("user", userId);

    axios
      .post(`${api_url}/create_user_interests/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Typically not required, but included for completeness
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Interests saved!", response.data); // Log the response data
        setLoading(false);
        if(profile=="false") {
          router.push("/complete_profile");
        }else {
          router.push("/dashboard");
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("user_interest", "true");
        }
      })
      .catch((error) => {
        console.error(
          "Error saving interests:",
          error.response ? error.response.data : error.message
        );
        setLoading(false);
      });
  };

  // function end

  const totalPages = Math.ceil(interestsList.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Slice the interests list for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInterests = interestsList.slice(startIndex, endIndex);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div
        className={`fixed inset-y-0 left-0 z-10 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
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

        <h1 className="text-4xl font-bold text-center mb-8 text-gray-300">
          Sélectionnez Vos Intérêts
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {currentInterests.map((interest, index) => (
            <div
              key={index}
              onClick={() => handleSelect(interest)}
              className={`p-6 border rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${
                selectedInterests.includes(interest)
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 hover:bg-blue-50"
              }`}
            >
              <h3 className=" font-semibold">{interest}</h3>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-300 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span className="text-gray-300">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-300 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl  bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900   hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
         
            {loading ? <FaSpinner className="animate-spin text-3xl mr-2 text-white" /> : "Sauvegarder"} 
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserIntress;
