"use client";

import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import Image from "next/image";
import { BsHouseCheck } from "react-icons/bs";
import { IoPricetagOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { fetchProperties, getId } from "../api/action";
import { RiArrowRightLine, RiHome5Line, RiMenuFold3Fill } from "react-icons/ri";
import { IoMdHeart } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import axios from "axios";
import { getToken } from "../lib/auth";
import { MdOutlinePriceCheck } from "react-icons/md";


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

interface PropertyCardProps {
  property: Property;
  className?: string; // Accept className as a prop'
 
}

interface LikedState {
  [key: number]: boolean; // Allows number keys with boolean values
}

interface LikeCounts {
  [key: number]: number; // Allows number keys with number values
}

interface PropertyImages {
  [key: number]: string; // Allows number keys with string values (image URLs)
}

interface LikedPropertiesState {
  [key: number]: boolean; // Allows number keys with boolean values
}

const PropertyCard: React.FC<PropertyCardProps> = ({ properties, className }) => {
  const router = useRouter();
  // const [properties, setProperties] = useState<Property[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [imageURL, setImageURL] = useState(null);
  const [pageLoad, setPageLoad] = useState(false);
  const [status, setStatus] = useState("");
  const [token , setToken] = useState(null);

  const userId = getId();
 
  
  console.log("here is the user id : ", Number(userId));

  const [likedState, setLikedState] = useState<LikedState>({});
  const [likeCounts, setLikeCounts] = useState<LikeCounts>({});
  const [propertyImages, setPropertyImages] = useState<PropertyImages>({});

  useEffect(()=> {
    const token_info = getToken();
    console.log("The user token : ", token_info)
    setToken(token_info)

  }, [])

  useEffect(() => {
    // Initialize when properties load
    const initialLikedState: LikedState = {};
    const initialLikeCounts: LikeCounts = {};

    properties.forEach((property) => {
      const numericUserId =
        typeof userId === "string" ? Number(userId) : (userId as any);
      initialLikedState[property.id] =
        property.liked_by_users.includes(numericUserId);
      initialLikeCounts[property.id] = property.like_count;
    });

    setLikedState(initialLikedState);
    setLikeCounts(initialLikeCounts);
  }, [properties, userId]);

  const [likedProperties, setLikedProperties] = useState<LikedPropertiesState>(
    () => {
      // Create initial state from server data
      const initialState: LikedPropertiesState = {}; // Explicitly typed
      properties.forEach((property) => {
        initialState[property.id] = property.liked_by_users.includes(
          Number(userId)
        );
      });
      return initialState;
    }
  );

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;



  const truncateTitle = (title: any, maxLength: number) => {
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + "...";
    }
    return title;
  };

  const truncateDescription = (description: any, maxLength: number) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
  };



  useEffect(() => {
    setPageLoad(true);
  }, []);

  const redirect = (id: any, propertyId: any, propertyUser:any) => {
    localStorage.setItem("propertyId", id);
    localStorage.setItem("propertyUser", propertyUser);
    router.push(`/properties/${propertyId}`);
  };

  // Initialize random images ONCE when properties load
  useEffect(() => {
    if (properties.length > 0 && Object.keys(propertyImages).length === 0) {
      const newPropertyImages: PropertyImages = {}; // Explicitly typed
      properties.forEach((property) => {
        const images = Array.isArray(property.images) ? property.images : [];
        const shuffled = [...images].sort(() => Math.random() - 0.5);
        newPropertyImages[property.id] =
          shuffled[0]?.imageUrl || "fallback.jpg";
      });
      setPropertyImages(newPropertyImages);
    }
  }, [properties, propertyImages]); // Runs only when `properties` changes

  const handleLike = async (property_id: number) => {
    setPageLoad(false);
    
    if(!token) {
      router.push('/login')
      return
    }
    try {
      // Optimistic UI update first
      const wasLiked = likedState[property_id];
      setLikedState((prev) => ({ ...prev, [property_id]: !wasLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [property_id]: wasLiked ? prev[property_id] - 1 : prev[property_id] + 1,
      }));

      const response = await axios.post(
        `${api_url}/likes/`,
        {
          user: Number(userId),
          property: property_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      // Get the updated like count from the response
      const updatedLikeCount = response.data.like_count;
      setStatus(`${response.data.message}-${property_id}`);

      // Update state for the specific property
      setLikes((prevLikes) => ({
        ...prevLikes,
        [property_id]: updatedLikeCount,
      }));

      setLikeCounts((prev) => ({
        ...prev,
        [property_id]: updatedLikeCount,
      }));

      setLikedProperties((prev) => ({
        ...prev,
        [property_id]: response.data.message == "true", // true if liked, false if unliked
      }));

      console.log("Liked:", response.data);
    } catch (error) {
      console.error("Error liking property:", error);
      // Revert on error
      setLikedState((prev) => ({
        ...prev,
        [property_id]: !prev[property_id],
      }));
    }
  };

  const formatNumber = (num: any) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M"; // M for million
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "k"; // k for thousand
    } else {
      return num;
    }
  };

  {Array.isArray(properties) && properties.length > 0 ? (
    properties.map((property, index) => {
      const isLikedByUser = property.liked_by_users.includes(Number(userId));
  
      return (
        <div key={property.id}>
          <h2>{property.title}</h2>
          <p>{property.description}</p>
        </div>
      );
    })
  ) : (
    <p>No properties found</p>
  )}
  
  return (
    <>
      {/* <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6 m-2"> */}
      <div className={`grid grid-cols-1 sm:grid-cols-4 gap-6 m-2 ${className}`}>
        
        {properties.map((property, index) => {
          const isLikedByUser = property.liked_by_users.includes(
            Number(userId)
          );

          return (
            <div
              key={property.id}
              className="relative group overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={propertyImages[property.id]}
                  alt="Property"
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Heart icon and like count */}
              <div
                onClick={() => handleLike(property.id)}
                className="absolute cursor-pointer top-4 right-4 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full"
              >
                {likedState[property.id] ? (
                  <IoMdHeart className="text-2xl text-rose-500 cursor-pointer hover:text-red-500 transition-colors duration-300" />
                ) : (
                  <CiHeart className="text-2xl text-white cursor-pointer hover:text-red-500 transition-colors duration-300" />
                )}
                <span className="text-white text-sm font-semibold">
                  {likes[property.id] ?? property.like_count}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl text-gray-300 font-semibold">
                      {truncateTitle(property?.title, 10)}
                    </h4>
                    <span className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      {property?.decision}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {property?.type} | {property?.address}
                  </p>
                  <div className="flex justify-between items-center py-2">
                    {property?.price!=="0.00" ? (
                        <span className="text-2xl text-gray-300 font-bold">
                        ${formatNumber(property?.price)}
                      </span>
                    ):(
                      <span onClick={() =>
                        redirect(property?.id, property?.property_id, property?.user)
                      } className="text-green-500 font-bold text-sm flex items-center bg-green-100/10 hover:bg-green-100/20 py-1 px-2 rounded-lg transition-all">
                      <MdOutlinePriceCheck className="mx-2" size={24} />
                      Contact
                    </span>
                    
                     
                    )}
                  
                    <button
                      onClick={() =>
                        redirect(property?.id, property?.property_id, property?.user)
                      }
                      className="text-gray-300 flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                    >
                      <RiArrowRightLine className="mr-2" /> Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PropertyCard;
