"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getId, getPropertyDetails } from "@/app/api/action";



import { RiMessage2Line } from "react-icons/ri";
import { MdOutlineSend } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaRegTrashCan } from "react-icons/fa6";
import { getPropertyId, getToken } from "@/app/lib/auth";
import { useSession } from "next-auth/react";
import { SiGnuprivacyguard } from "react-icons/si";
import { SiProgress } from "react-icons/si";
import { FaPowerOff } from "react-icons/fa6";
import { FaPhoneVolume, FaSpinner } from "react-icons/fa";

import axios from 'axios';



import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Property {
  id: string;
  title: string;
  author_name: string;
  author_image?:string;
  description: string;
  price: number;
  subscriber_count:number;
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
  status:string;
  new_phone_number: string;
  phone_user: string;
  images?: { imageUrl: string }[];
 
}

interface PropertyCardProps {
  property: Property;
}

const PropertyPage: React.FC<PropertyCardProps> = ({ property }) => {
  // Renamed state variable to 'propertyState'
  const [propertyState, setPropertyState] = useState<Property | null>(null);
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState (false)

  const router = useRouter();
  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const defaultImage = '/images/np.webp';
  const [imageLink, setImageLink] = useState(defaultImage);

  const propertyId = getPropertyId();
  console.log(" propertyId: ", propertyId)
  const userId = getId();
  
  const numericUserId = Number(userId)
  const token = getToken()


// Define the function to handle the subscription request
const handleSubscription = async (userId_received) => {
  console.log(" id : ",userId_received )
  try {
    // Prepare the data to be sent to the backend
    const requestData = {
      subscriber_id: userId,  // The ID of the user subscribing
    };

    // Make the POST request to the backend to subscribe/unsubscribe
    const response = await axios.post(`${api_url}/subscribe/${userId_received}/`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
       
      },
    });

    // Handle the response (e.g., updating the UI)
    if (response.status === 201 || response.status === 200) {
      const { message, subscription_count } = response.data;
      console.log(message); // "Subscribed" or "Unsubscribed"
      if (message=="Unsubscribed") {
        setStatus(false)
      }
      if(message=="Subscribed") {
        setStatus(true)
      }

      setMessage(message)

      console.log(`Total subscriptions: ${subscription_count}`);
      setCount(subscription_count)

      // Update state or perform other UI updates as needed
    }
  } catch (error) {
    // Handle error (e.g., user not found, server errors)
    console.error('Error subscribing:', error.response?.data?.message || error.message);
  }
};



  const handleEditClick = (propertyUser:any, slug:any) => {
    if (!propertyId) {
      console.error("No property ID found in localStorage");
      return;
    }
    localStorage.setItem("propertyId", propertyId);
    localStorage.setItem("propertyUser", propertyUser);
    router.push(`/update/${slug}`);
  };

  const handleDeleteClick = (propertyUser:any, slug:any) => {
    if (!propertyId) {
      console.error("No property ID found in localStorage");
      return;
    }
    localStorage.setItem("propertyId",propertyId )
    localStorage.setItem("propertyUser", propertyUser);
    router.push(`/delete/${slug}`);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPropertyDetails();
        console.log("The property you're looking for: ", result);
        setPropertyState(result); // Set propertyState with the fetched result
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchData();
  }, []);

  const authorImage = `${propertyState?.author_image}`

    // Ensure property.images is an array and has at least one image
    const images = Array.isArray(propertyState?.images) ? propertyState?.images : [];
    const firstImage =
      images.length > 0
        ? `${images[0].imageUrl}`
        : "/images/espaslink.png";

        console.log("firstImage : ", firstImage)

    const isSubscribed_by_user =propertyState?.subscribed_by_users.includes(numericUserId);
    console.log("isSubscribed_by_user : ", isSubscribed_by_user)

    useEffect(()=> {
      setStatus(isSubscribed_by_user)
    }, [isSubscribed_by_user])


  return (
    <div className="property-page container mx-auto p-4">
      {/* Author Section */}
      <div className="relative top-7">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {/* Author Info */}
          <div className="author-info w-full bg-gradient-to-r from-gray-300 via-gray-200 to-transparent bg-opacity-80 backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-md flex items-center">
            <img
              src={authorImage}
              alt="user profile"
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">{propertyState?.author_name}</h2>
              <p className="text-slate-500">
                {message =="Subscribed" || message=="Unsubscribed" ? count : propertyState?.subscriber_count} <span className="mx-2">followers</span>
              </p>
            </div>
            {propertyState?.user!==numericUserId ? 
            <button onClick={()=>handleSubscription(propertyState?.user)}  className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {message =="Subscribed" || status ? "Subscribed":  "Subscribe" }
          </button>
            
            :
            "" }
            
          </div>
        </div>
      </div>
  
      {/* Action Dropdown */}
      <div className="w-full flex justify-end relative top-[-57px]">
        {propertyState?.user===numericUserId ?
         <DropdownMenu>
         <DropdownMenuTrigger className="outline-none text-white bg-gradient-to-r from-blue-500 to-purple-600 relative top-14 md:top-0 mt-12 md:mt-0 md:w-28 md:h-10 w-full h-11 items-center rounded-xl">
           <div className="flex items-center">
             <SiGnuprivacyguard className="mx-2" size={18} />
             Action
           </div>
         </DropdownMenuTrigger>
 
         <DropdownMenuContent className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
           <DropdownMenuLabel className="px-4 py-2 font-semibold text-gray-800">
             Mettre à jour ou supprimer
           </DropdownMenuLabel>
           <DropdownMenuSeparator />
           <DropdownMenuItem onClick={()=>handleEditClick(propertyState?.user, propertyState?.property_id)} className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100">
             <HiOutlinePencilSquare size={26} className="mr-2" />
             Mettre à jour
           </DropdownMenuItem>
           <DropdownMenuItem onClick={()=>handleDeleteClick(propertyState?.user, propertyState?.property_id)} className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100">
             <FaRegTrashCan size={20} className="mr-2" />
             Supprimer
           </DropdownMenuItem>
         </DropdownMenuContent>
       </DropdownMenu>
        :
        ""
        }
       
      </div>

         <div className="mt-10">
              <div className="flex">
              <h1 className="text-2xl font-bold mb-4">{propertyState?.title}</h1>
              {propertyState?.status=="open" ?
              <p><SiProgress size={22} className="text-sky-500"/></p>
              :
              <p><FaPowerOff size={22} className="text-rose-500 mx-1"/></p>
            }
              
              </div>
              <img
                src={firstImage}
                alt={propertyState?.title}
                width={500} 
                height={256}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
      
             
      
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {images.length > 0 ? (
                  images.map((img, index) => (
                    <img
                      key={index}
                      src={`${img.imageUrl}`}
                      width={256}   // Adjust this width according to your layout needs
                      height={128}  // Matches the Tailwind class h-32
                      alt={`Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ))
                ) : (
                  <p>No additional images available.</p>
                )}
              </div>
      
              <div className="bg-gradient-to-r from-gray-300 via-gray-200 to-transparent bg-opacity-80 backdrop-filter backdrop-blur-md text-black shadow-lg rounded-r-lg p-6 space-y-6">
                {/* Description Title Box */}
                <div className="flex items-center bg-gray-500 bg-opacity-50 px-3 py-1 rounded-full w-max mb-2">
                  <p className="uppercase font-bold tracking-wide text-sm text-black">
                    Description
                  </p>
                </div>
      
                <p className="text-slate-700 mb-3 text-lg font-semibold tracking-wide">
                  {propertyState?.description}
                </p>
      
                {/* Price Title Box */}
              
                {propertyState?.type !=="Site Touristique" && propertyState?.price && (
      
                  
                  <div className="flex items-center space-x-2 mb-2">
                  {/* Price Title */}
                  <div className="flex items-center bg-pink-500 text-white px-3 py-1 rounded-full w-max">
                    <p className="uppercase font-bold tracking-wide text-sm">{propertyState?.type==="Hotel"  ? "Prix par nuit" : "Prix" }</p>
                  </div>
                  <p className="text-slate-700 font-bold text-[20px]">{propertyState?.currency == "USD" ? "$ " + propertyState?.price + " " + propertyState?.currency : propertyState?.price + " " + propertyState?.currency}</p>
                  </div>
      
      
                )}
             
                {propertyState?.phone_user ?
      
                    <div className="flex items-center space-x-2 mb-2">
                    {/* Phone User */}
                    <div className="flex items-center bg-sky-500 text-white px-3 py-1 rounded-full w-max">
                      <p className="uppercase font-bold tracking-wide text-sm"><FaPhoneVolume size={18}/></p>
                    </div>
      
                    
                     <p className="text-slate-700 font-bold text-[20px]">
                    
                      {propertyState?.phone_user}
                     </p>
                     
               
                    
                    </div>
                              
              :null}
                
      
                
      
                {/* FaPhoneVolume */}
              
      
      
                <div className="flex items-center space-x-2 mb-2">
                  {/* Location Title */}
                  <div className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full w-max">
                    <p className="uppercase font-bold tracking-wide text-sm">Location</p>
                  </div>
      
      
                  {/* Location Value */}
                  <p className="uppercase text-slate-600 text-sm"> {propertyState?.country}, {propertyState?.state}, {propertyState?.city}</p>
                  <span className="text-sm text-slate-800"> ({propertyState?.address})</span>
                </div>
              </div>
      
      
            </div>

    </div>
  );
  
};

export default PropertyPage;
