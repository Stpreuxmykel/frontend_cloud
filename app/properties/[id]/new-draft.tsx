"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { RiMessage2Line } from "react-icons/ri";
import { MdOutlineSend } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaRegTrashCan } from "react-icons/fa6";
import { getToken } from "@/app/lib/auth";
import { useSession } from "next-auth/react";
import { SiGnuprivacyguard } from "react-icons/si";
import { SiProgress } from "react-icons/si";
import { FaPowerOff } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { FaPhoneVolume } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { getPropertyDetails } from "@/app/api/action";
const PropertyPage = ({ params }: { params: { id: string } }) => {
  const [property, setProperty] = useState(null);

  const [error, setError] = useState("");
  const router = useRouter();

  const [checkUser, setCheckUser] = useState(null);
  const [checkGoogleUser, setCheckGoogleUser] = useState(null);


  const [actualUser, setActualUser] = useState(null);
  const [actualGoogleUser, setActualGoogleUser] = useState(null);
  const [subscriptionState, setSubscriptionState] = useState("");

  const [googleSub, setGoogleSub] = useState([]);
  const [regularSub, setRegularSub] = useState([]);

  const [googleSubState, setGoogleSubState] = useState([]);
  const [regularSubState, setRegularSubState] = useState([]);


  const [token, setToken] = useState("");

  const [loading, setLoading] =useState(false);

  const defaultImage = '/images/np.webp'

  const [imageLink, setImageLink] =useState(defaultImage);

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL


  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPropertyDetails();
        console.log("The property you're looking for : ", result )
        setProperty(result);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchData();
  }, []);


  const postOwner = checkUser?.user;
  const postGoogleOnwer = checkGoogleUser?.user;

  const special_google_owner_image = checkGoogleUser?.author_image
  const special_google_owner_name = checkGoogleUser?.author_name

  const special_regular_owner_image = checkUser?.author_image
  const special_regular_owner_name = checkUser?.author_name

 
 
 
  const { id } = params;
  const { data: session } = useSession();

 


  console.log("user token: ", token)
  console.log("I'm verifying the actual user : ", actualUser)
  console.log("I'm verifying the actual google user : ", actualGoogleUser)
  console.log("I'm verifying the actual property id here : ", property?.id)

  console.log("googleSubState : ", googleSubState);
  console.log("regularSubState : ", regularSubState);






  const userMatch = googleSubState.some(
    (item) =>
      item.google_user === actualGoogleUser &&
      (item.subscribed_to_google_user === postGoogleOnwer ||
        item.subscribed_to_user === postOwner)
  );




  const regularMatch = regularSubState.some(
    (item) =>
      item.user === actualUser &&
      (item.subscribed_to_google_user === postGoogleOnwer ||
        item.subscribed_to_user === postOwner)
  )






  useEffect(()=> {
    const my_token = getToken()
    setToken(my_token)
  }, [])

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      try {
        const get_subscriptions = await axios.get(
          `${api_url}/get_subscriptions/`
        );
        const { google_user_subscriptions, regular_user_subscriptions } =
          get_subscriptions.data;
        console.log("All subscription data: ", get_subscriptions.data);

        const newGoogleSub = [];
        const newRegularSub = [];

        // Map over google_user_subscriptions
        google_user_subscriptions.forEach((sub) => {
          newGoogleSub.push({
            user_id: sub.subscribed_to_google_user,
            subscription_count: sub.subscription_count,
          });
        });

        // Map over regular_user_subscriptions
        regular_user_subscriptions.forEach((sub) => {
          newRegularSub.push({
            user_id: sub.subscribed_to_user,
            subscription_count: sub.subscription_count,
          });
        });

        // Now you have newGoogleSub and newRegularSub populated with the mapped data
        setGoogleSub(newGoogleSub);
        setRegularSub(newRegularSub);
      } catch (error) {
        console.error("An error occurred while fetching subscriptions:", error);
        // Optionally, you can handle the error state by updating your UI or state here
      }finally{
        setLoading(false)
      }




      try {
        if (token) {
          try {
            const actual_user = await axios.get(
              `${api_url}/actual_user_data/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
              }
            );

            const my_data = actual_user.data.actual_user_data[0];

            console.log("actual_user data  : ", my_data.user);
            setActualUser(my_data.user);
          } catch (error) {
            console.error("Error fetching actual user data:", error);
            // Handle the error appropriately (e.g., show a message to the user)
          }
        }

        if (session) {
          try {
            const get_google_data = await axios.get(
              `${api_url}/google-user-token/${session?.user?.email}`
            );

            console.log(
              "Here is the google user id: ",
              get_google_data.data.google_users_data[0].id
            );
            const google_id = get_google_data.data.google_users_data[0].id;

            const user_profile_data = await axios.get(
              `${api_url}/specific_google_user/${google_id}`
            );
            console.log(
              "the actual google user profile data  you're looking for : ",
              user_profile_data.data.google_user_profile.user
            );

            setActualGoogleUser(user_profile_data.data.google_user_profile.user);
          } catch (error) {
            console.error("Error fetching Google user data:", error);
            // Handle the error appropriately (e.g., show a message to the user)
          }
        }
      } catch (error) {
        console.error("Unexpected error occurred:", error);
        // Handle any other unexpected errors here
      }


      try {
        const response = await axios.get(
          `${api_url}/get-property/${id}`
        );

        const { user_property, google_user_property } = response.data;
        console.log("all property regular  user  : ", user_property);
        console.log("all property google  user  : ", google_user_property);

        setCheckUser(user_property);
        setCheckGoogleUser(google_user_property);

       

        
        // Combine properties if both exist, or handle separately
        const combinedProperties = [];
        if (user_property) {
          combinedProperties.push(user_property);
        }
        if (google_user_property) {
          combinedProperties.push(google_user_property);
        }

        // // Set the property state with combined data
        setProperty(
          combinedProperties.length > 0 ? combinedProperties[0] : null
        );
       
   
      } catch (error) {

        if (error.response && error.response.status === 404) {
          setError("Propriété non trouvée");  // Handle 404 error
        } else {
          setError("Échec de la récupération des détails de la propriété.");
        }
        
    

      }



      try {
        if (session) {
          try {
            const sub_data = await axios.get(
              `${api_url}/get_subs/${actualGoogleUser}/google/`
            );

            const my_data = sub_data.data.sub_data;
            const googleSubsData = my_data.map((sub) => ({
              user: sub.user,
              google_user: sub.google_user,
              subscribed_to_user: sub.subscribed_to_user,
              subscribed_to_google_user: sub.subscribed_to_google_user,
            }));

            setGoogleSubState(googleSubsData);

            console.log("Response data for actual Google subs:", sub_data.data);
          } catch (error) {
            console.error("Error fetching Google subscriptions:", error);
          }
        } else {
          try {
            const sub_data = await axios.get(
              `${api_url}/get_subs/${actualUser}/regular/`
            );

            const my_data = sub_data.data.sub_data;
            const regularSubsData = my_data.map((sub) => ({
              user: sub.user,
              google_user: sub.google_user,
              subscribed_to_user: sub.subscribed_to_user,
              subscribed_to_google_user: sub.subscribed_to_google_user,
            }));

            setRegularSubState(regularSubsData);

            console.log(
              "Response data for actual regular subs:",
              sub_data.data
            );
          } catch (error) {
            console.error("Error fetching regular subscriptions:", error);
          }
        }
      } catch (error) {
        console.error("General error:", error);
      }
    };

    fetchProperty();
  }, [id, session, token, actualGoogleUser, actualUser, api_url]);

  // if(!token) {

  // }
  const handleSubscribe = async () => {
    if (token || session) {
      if (session) {
        // Ensure user session exists
        if (checkUser) {
          // Ensure user check is valid
          try {
            const subscribeResponse = await axios.post(
              `${api_url}/subscribe/${postOwner}/regular/`, // Assuming postOwner is the target user ID and 'regular' is the user type of postOwner
              {
                subscriber_id: actualGoogleUser,
                subscriber_type: actualGoogleUser ? "google" : "regular", // Determine if the subscriber is a Google or regular user
              },
              {
                headers: {
                  "Content-Type": "application/json", // Specify the request body as JSON
                },
              }
            );

            setSubscriptionState(subscribeResponse.data);
          } catch (error) {
            alert("Error during subscription");
            console.error(
              "Error during subscription:",
              error.response ? error.response.data : error.message
            );
          }
        } else {
          try {
            const subscribeResponse = await axios.post(
              `${api_url}/subscribe/${postGoogleOnwer}/google/`, // Assuming postOwner is the target user ID and 'regular' is the user type of postOwner
              {
                subscriber_id: actualGoogleUser,
                subscriber_type: actualGoogleUser ? "google" : "regular", // Determine if the subscriber is a Google or regular user
              },
              {
                headers: {
                  "Content-Type": "application/json", // Specify the request body as JSON
                },
              }
            );
            setSubscriptionState(subscribeResponse.data);
          } catch (error) {
            alert("Error during subscription");
            console.error(
              "Error during subscription:",
              error.response ? error.response.data : error.message
            );
          }
        }
      }

      if (token) {
        if (checkGoogleUser) {
          try {
            const subscribeResponse = await axios.post(
              `${api_url}/subscribe/${postGoogleOnwer}/google/`, // Assuming postOwner is the target user ID and 'regular' is the user type of postOwner
              {
                subscriber_id: actualUser,
                subscriber_type: actualGoogleUser ? "google" : "regular", // Determine if the subscriber is a Google or regular user
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json", // Specify the request body as JSON
                },
              }
            );

            setSubscriptionState(subscribeResponse.data);
          } catch (error) {
            alert("Error during subscription");
            console.error(
              "Error during subscription:",
              error.response ? error.response.data : error.message
            );
          }
        } else {
          try {
            const subscribeResponse = await axios.post(
              `${api_url}/subscribe/${postOwner}/regular/`, // Assuming postOwner is the target user ID and 'regular' is the user type of postOwner
              {
                subscriber_id: actualUser,
                subscriber_type: actualGoogleUser ? "google" : "regular", // Determine if the subscriber is a Google or regular user
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json", // Specify the request body as JSON
                },
              }
            );

            setSubscriptionState(subscribeResponse.data);
            console.log("Subscription update here man : ", subscribeResponse.data)
          } catch (error) {
            alert("Error during subscription");
            console.error(
              "Error during subscription:",
              error.response ? error.response.data : error.message
            );
          }
        }
      }

    } else {
      // router.push("/login")
      // Store the current URL before redirecting
      const currentUrl = window.location.pathname;
      // Redirect to the login page with the current URL as a query parameter
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
    }
  };



  console.log("subscriptionState message : ", subscriptionState.message)

  const displayRegular = useMemo(() => {
    if (subscriptionState.message === "subscribed") {
      return "Suivi(es)";
    }
    if (subscriptionState.message === "unsubscribed") {

      return "Suivre";
    }

    if (regularMatch === true) {

      return "Suivi(es)";
    }

    if (regularMatch === false) {

      return "Suivre";
    }
    return "Other"; // Replace with the default value you want
  }, [subscriptionState, regularMatch]);

  const displayMessage = useMemo(() => {
    if (subscriptionState.message === "subscribed") {
      return "Suivi(es)";
    }
    if (subscriptionState.message === "unsubscribed") {
      return "Suivre";
    }

    if (userMatch === true) {
      return "Suivi(es)";
    }

    if (userMatch === false) {
      return "Suivre";
    }
    return "Other"; // Replace with the default value you want
  }, [subscriptionState, userMatch]);

  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M'; // M for million
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'k'; // k for thousand
    } else {
      return num;
    }
  };

  const baseUrl = api_url;




console.log('defaultImage', defaultImage)
  useEffect (()=>{
   

    if(checkGoogleUser?.author_image) {
      const img_url = ` ${baseUrl}${special_google_owner_image}`
      setImageLink(img_url)
    }else {
      setImageLink(defaultImage)
    }
  }, [baseUrl, special_google_owner_image, checkGoogleUser?.author_image])

  useEffect(()=> {
    
    if(checkUser?.author_image) {
    
      const img_url = `${baseUrl}${special_regular_owner_image}`
 
      setImageLink(img_url)
     
     }else {
      console.log("No image avalaible for this user owner")
       setImageLink(defaultImage)
     }

  }, [baseUrl, checkUser?.author_image, special_regular_owner_image])


  if (error) {

return (
  <div className="flex justify-center items-center mt-52">
    <div className="text-center">
      <div className="mb-4"> {/* Margin for spacing between elements */}
        <span className="text-xl font-bold">{error}</span> {/* Error message */}
      </div>
      <div>
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  </div>
);

  } 



  if (!property || loading) {
    return (
      <div className="flex justify-center items-center mt-52">
        <div className="text-center">
          {loading ? (
            <div className="flex items-center">
              <FaSpinner className="animate-spin text-3xl mr-2 text-sky-500" /> {/* Loading spinner */}
              <span className="text-xl font-bold">Checking...</span> {/* Loading message */}
            </div>
          ) : (
            <span className="text-xl font-bold"></span>
          )}
        </div>
      </div>
    );
  }
  

  // Ensure property.images is an array and has at least one image
  const images = Array.isArray(property.images) ? property.images : [];
  const firstImage =
    images.length > 0
      ? `${baseUrl}${images[0].image}`
      : "/path/to/default/image.jpg";

  const regularS = regularSub.find((sub) => sub.user_id === postOwner);
  const googleS = googleSub.find((sub) => sub.user_id === postGoogleOnwer);

  const newSubCount =
    (regularS ? regularS.subscription_count : 0) +
    (googleS ? googleS.subscription_count : 0);




  return (
    <div className="property-page container mx-auto p-4">
      {/* Author secition */}

      


      {checkUser && (
        <div className="relative">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {/* Author Info */}
            <div className="author-info w-full bg-gradient-to-r from-gray-300 via-gray-200 to-transparent bg-opacity-80 backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-md flex items-center">
              <img
                src={imageLink}
                alt='user profile'
              // width={190}
              // height={190}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">
                  {special_regular_owner_name}
                </h2>
                <p className="text-slate-500">
                  {subscriptionState.message === "subscribed"
                    ? formatNumber(subscriptionState.subscription_count)
                    : subscriptionState.message === "unsubscribed"
                      ? formatNumber(subscriptionState.subscription_count)
                      : formatNumber(newSubCount)}
                  <span className="mx-2">followers</span>
                </p>
              </div>
              {postOwner === actualUser ? (
                ""
              ) : (
                <button
                  onClick={handleSubscribe}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {session ? displayMessage : displayRegular}
                </button>
              )}
            </div>

            {/* Dropdown Menu */}
            {postOwner === actualUser && (
              <div className="md:col-start-3 md:row-start-1 flex justify-end mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none text-white bg-gradient-to-r from-blue-500 to-purple-600 md:w-28 md:h-10 w-full h-11 items-center rounded-xl">
                    <div className="flex items-center">
                      <SiGnuprivacyguard className="mx-2" size={18} />
                      Action
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
                    <DropdownMenuLabel className="px-4 py-2 font-semibold text-gray-800">Metrre a jour ou supprimer</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/update/${checkUser?.property_id}`)} className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100">
                      <HiOutlinePencilSquare size={26} className="mr-2" /> Mettre a jour
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/delete/${checkUser?.property_id}`)} className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100">
                      <FaRegTrashCan size={20} className="mr-2" /> Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>


      )}

      {checkGoogleUser && (

        <div className="relative">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {/* Author Info */}
            <div className="author-info w-full bg-gradient-to-r from-gray-300 via-gray-200 to-transparent bg-opacity-80 backdrop-filter backdrop-blur-md p-4 rounded-lg shadow-md flex items-center">
              <img
                src={imageLink}
                // width={64}
                // height={64}
                alt='image'
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">
                 {special_google_owner_name}
                </h2>
                <p className="text-slate-500">
                  {subscriptionState.message === "subscribed"
                    ? subscriptionState.subscription_count
                    : subscriptionState.message === "unsubscribed"
                      ? subscriptionState.subscription_count
                      : newSubCount}
                  <span className="mx-2">followers</span>
                </p>
              </div>
              {postGoogleOnwer === actualGoogleUser ? (
                ""
              ) : (
                <button
                  onClick={handleSubscribe}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {session ? displayMessage : displayRegular}
                </button>
              )}
            </div>
            <div>

            </div>

            {/* Dropdown Menu */}
            {postGoogleOnwer === actualGoogleUser && (
              <div className="w-full flex justify-end mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none text-white bg-gradient-to-r from-blue-500 to-purple-600 md:w-28 md:h-10 w-full h-11 items-center rounded-xl">
                    <div className="flex items-center">
                      <SiGnuprivacyguard className="mx-2" size={18} />
                      Action

                    </div>



                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
                    <DropdownMenuLabel className="px-4 py-2 font-semibold text-gray-800">Metrre a jour ou supprimer</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/update/${checkGoogleUser?.property_id}`)} className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100">
                      <HiOutlinePencilSquare size={26} className="mr-2" /> Mettre a jour
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/delete/${checkGoogleUser?.property_id}`)} className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100">
                      <FaRegTrashCan size={20} className="mr-2 " /> Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>





      )}


      {/* end */}

      <div className="mt-10">
        <div className="flex">
        <h1 className="text-2xl font-bold mb-4">{property?.title}</h1>
        {property.status=="open" ?
        <p><SiProgress size={22} className="text-sky-500"/></p>
        :
        <p><FaPowerOff size={22} className="text-rose-500 mx-1"/></p>
      }
        
        </div>
        <img
          src={firstImage}
          alt={property.title}
          width={500} 
          height={256}
          className="w-full h-64 object-cover rounded-md mb-4"
        />

       

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {images.length > 0 ? (
            images.map((img, index) => (
              <img
                key={index}
                src={`${baseUrl}${img.image}`}
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
            {property.description}
          </p>

          {/* Price Title Box */}
        
          {property.type !=="Site Touristique" && property.price && property.price !=="0.00" && (

            
            <div className="flex items-center space-x-2 mb-2">
            {/* Price Title */}
            <div className="flex items-center bg-pink-500 text-white px-3 py-1 rounded-full w-max">
              <p className="uppercase font-bold tracking-wide text-sm">{property.type==="Hotel"  ? "Prix par nuit" : "Prix" }</p>
            </div>
            <p className="text-slate-700 font-bold text-[20px]">{property.currency == "USD" ? "$ " + property.price + " " + property.currency : property.price + " " + property.currency}</p>
            </div>


          )}
       
          {property.phone_user || property.new_phone_number ?

              <div className="flex items-center space-x-2 mb-2">
              {/* Phone User */}
              <div className="flex items-center bg-sky-500 text-white px-3 py-1 rounded-full w-max">
                <p className="uppercase font-bold tracking-wide text-sm"><FaPhoneVolume size={18}/></p>
              </div>


              {/* Price Value */}
              {/* <p className="text-slate-700 font-bold text-[20px]">
              $ {property.price} US{" "}
              </p> */}
               {property.phone_user && property.new_phone_number ? 
               <p className="text-slate-700 font-bold text-[20px]">
              
                {property.phone_user} / {property.new_phone_number}
               </p>
               : 
               <p className="text-slate-700 font-bold text-[20px]">
              
                {property.phone_user || property.new_phone_number}
               </p>
               }
              
              </div>
                        
        :null}
          

          

          {/* FaPhoneVolume */}
        


          <div className="flex items-center space-x-2 mb-2">
            {/* Location Title */}
            <div className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full w-max">
              <p className="uppercase font-bold tracking-wide text-sm">Location</p>
            </div>


            {/* Location Value */}
            <p className="uppercase text-slate-600 text-sm"> {property.country}, {property.state}, {property.city}</p>
            <span className="text-sm text-slate-800"> ({property.address})</span>
          </div>
        </div>


      </div>

    

 
   
    </div>

  );
};

export default PropertyPage;
