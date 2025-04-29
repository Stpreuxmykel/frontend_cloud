"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getToken } from "../lib/auth";
import axios from "axios";
import PropertyCard from "../component/PropertyCard";
import { getId } from "../api/action";










// Recommendation Component
const Recommendation = () => {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState([]);
  const [recoresult, setRecoResult] = useState([]);
  const token = getToken();
  const router = useRouter();

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;


    useEffect(()=> {
      if(!token) {
        router.push("/login")
       }
    
    }, [router, token])
 

  const userId  = getId();

  useEffect(() => {
    const fetchRecommendations = async () => {
 
        try {
         
          const response = await axios.get(
            `${api_url}/recommendations/${userId}/`
          );

        const users = response.data.user_recommendations;
        console.log("recommendation data : ", response.data)
        // Combine properties for each user
        const combinedProperties = users.reduce((acc, user) => {
          if (user.properties) {
            // Combine each user's properties into the accumulated array
            acc = [...acc, ...user.properties];
          }
          return acc;
        }, []);
          // Set the combined properties to the state
          console.log("Combined properties : ",combinedProperties )
          setRecoResult(combinedProperties)
        //  setProperties(combinedProperties);
       
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      
    };

    fetchRecommendations();
  }, [userId]);

  return (
    <div className="bg-gradient-to-r min-h-screen py-8">
      
      <div className="container mx-auto p-4">
       <h1 className="text-slate-600">Vos suggestions</h1>
          <div>
            {Array.isArray(recoresult) && recoresult.length > 0 ? (
             <PropertyCard properties={recoresult} />
            ) : (
              <p>No properties available.</p>
            )}
          </div>
        </div>
    </div>
  );
};

export default Recommendation;




