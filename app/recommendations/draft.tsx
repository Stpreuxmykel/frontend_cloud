"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getToken } from "../lib/auth";
import axios from "axios";
import PropertyCard from "../component/PropertyCard";










// Recommendation Component
const Recommendation = () => {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState([]);
  const [recoresult, setRecoResult] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (session) {
        try {
          const response_data = await axios.get(
            `http://localhost:8000/api/get-google-user-profile/${session?.user?.email}`
          );
          const interest_data = await axios.get(
            `http://127.0.0.1:8000/api/recommendations/google/${response_data.data.user}/`
          );
          const recommendationList = interest_data.data.user_recommendations;
          const fetchPromises = recommendationList.map(async (item) => {
            if (item.google_name) {
              const response = await axios.get(
                `http://127.0.0.1:8000/api/google_r/${item.id}/`
              );
              return response.data;
            } else if (item.username) {
              const response = await axios.get(
                `http://127.0.0.1:8000/api/regular_r/${item.id}/`
              );
              return response.data;
            }
          });

          const results = await Promise.all(fetchPromises);
          const flattenedResults = results.filter((item) => item !== undefined);

          // Map and flatten the user_property arrays to get a new array of user_property values
            const userProperties = flattenedResults
            .map((result) => result.user_property) // Extract user_property arrays
            .flat(); // Flatten the array of arrays

            // Now userProperties contains all the values from the user_property arrays
            // console.log(userProperties);

          console.log("check new results ", userProperties)
          setRecoResult(userProperties);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      }
    };

    fetchRecommendations();
  }, [session]);

  return (
    <div className="bg-gradient-to-r min-h-screen py-8">
      
      <div className="container mx-auto p-4">
       <h1 className="text-slate-600">Vos suggestions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(recoresult) && recoresult.length > 0 ? (
              recoresult.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <p>No properties available.</p>
            )}
          </div>
        </div>
    </div>
  );
};

export default Recommendation;




