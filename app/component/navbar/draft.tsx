"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import MenuItem from "./MenuItem";
import { getToken, getUser, logout } from "@/app/lib/auth";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { setToken } from '../../lib/auth';
import Link from "next/link";
import Image from "next/image";

const UserMenu = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [regularUser, setRegularUser] = useState("");
    const [googleData, setGoogleData] = useState("");
    const [fullName, setFullName] = useState("");
    const [session, setSession] = useState("");
 
    // const [token , setToken] = useState("");

    const [rName, setRName]  = useState("");
    const [rImage, setRImage]  = useState("");
    const [gImage, setGImage] =  useState("");
    const [newGName, setNewGName] =  useState("");
   
    const defaultImage = '/images/np.webp'

    const [imageLink, setImageLink] =useState(defaultImage);

    const { data: testsession } = useSession();  
    const token = getToken();

    console.log("The regular name : ")

  
    const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL

  
    const baseUrl = api_url;
  
    const regularImage = `${baseUrl}${regularUser.profile_picture}`
    const GoogleImage = `${baseUrl}${googleData.profile_picture}`

    const imageExist = googleData.profile_picture

    const rImageExist = regularUser.profile_picture



    console.log("rImage : ", rImage)

    useEffect(() => {
        if (session) {
            if (gImage || imageExist) {
                setImageLink(gImage || GoogleImage); // Set to available image
            } else {
                setImageLink(defaultImage); // Fallback to default image
            }
        } 


        if(token) {

            if(rImage ||rImageExist ) {
                setImageLink(rImage || regularImage); // Set to available image
            }else {
                setImageLink(defaultImage);
            }
            

        }
    }, [session, gImage, GoogleImage, defaultImage, imageExist,  token, rImage,rImageExist, regularImage]); //








    const storedInfo = localStorage.getItem('regular_info');
    
    console.log("Checking local sotrage for regular : ",  storedInfo)
    console.log("Checking first name data  : ",   regularUser.firstname)
    console.log("Checking rName name data  : ",  rName)
    console.log("Checking full name data  : ",  fullName)

   

    const storedGoogle = localStorage.getItem('google_info');
    const storedGoogleName = localStorage.getItem('gName');
    console.log("Checking for gname : ",storedGoogleName )

    const userId = localStorage.getItem("userId")
    console.log("user id: ", userId)



    if (storedInfo) {
        const regularInfo = JSON.parse(storedInfo);
        console.log("Retrieved regular info: ", regularInfo);
        const fullUrl = regularInfo?.imageUrl
       
       
        const finalLink = fullUrl



        console.log('finalLink: ', finalLink)


        setRName(regularInfo.firstname);
        setRImage(finalLink);

        // Clear the local storage after retrieving the data
        localStorage.removeItem('regular_info');
    }




    if (storedGoogle) {
        const googleInfo = JSON.parse(storedGoogle);
        console.log("Retrieved regular info: ", googleInfo);
        const fullUrl = googleInfo.imageUrl

        const finalLink = fullUrl

        console.log('finalLink: ', finalLink)


        setGImage(finalLink);

        // Clear the local storage after retrieving the data
        localStorage.removeItem('google_info');
    }


    useEffect(() => {
      // Get session data directly in useEffect
        
    
        setSession(testsession);  // Set session state
        // Set token state
    }, [testsession]); 


  


    useEffect(()=>{
        const fetchInterest = async ()=> {

         

                    if (token) {
                        try{
                        const response_interest_data = await axios.get(
                            `${api_url}/get-user-interest/`,
                            {
                            headers: {
                                Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
                            },
                            }
                        );

                
                        console.log("user interest data here : ", response_interest_data.data)
                        if (typeof window !== 'undefined') {

                            localStorage.setItem('interest_info', JSON.stringify(response_interest_data.data));
                    
                        }
                    }catch(error){
                        console.log('error finding interest : ',error )
                        localStorage.removeItem('interest_info')
                    }
            }
        
        
        if(session){

            try{
                const Email = session?.user?.email
                const response_interest_data =  await axios.get(`${api_url}/get-user-google-interest/${Email}`)
                console.log("Here is the google user interest data here : ", response_interest_data.data)
                if (typeof window !== 'undefined') {
    
                    localStorage.setItem('interest_info', JSON.stringify(response_interest_data.data));
            
                }
            }catch(error) {
                console.log("Error finding gooogle interest: ", error)
                localStorage.removeItem('interest_info')
            }
            // get-user-google-interest
          
        }

    
    }
       
        fetchInterest()
    }, [api_url,token, session?.user?.email, session])


    useEffect(() => {

        const fetchGoogleUserData = async () => {

        if (token) {

        try {
            const response_data = await axios.get(
              `${api_url}/get-user-profile/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
              }

            );

            console.log("Response regular : ", response_data.data)
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('profile_info', JSON.stringify(response_data.data));
            }

            // router.push('/dashboard')

            setRegularUser(response_data.data)

        } catch(error) {
            console.log("error : ", error )
            localStorage.removeItem('profile_info')
        }

    }

    if (session) {
        try {

      // User is logged in via 
            const Email = session?.user?.email
            const response_data =  await axios.get(`${api_url}/get-google-user-profile/${Email}`)

            // const response_data = await axios.get(
            //   `${api_url}/get-google-user-profile/${session?.user?.email}`
            // );
        
          
            // Set the Google user profile data
            console.log("Google profile info is here : ", response_data.data)
            setGoogleData(response_data.data);
            if (typeof window !== 'undefined') {
                localStorage.setItem('profile_info', JSON.stringify(response_data.data));
        
            }
          
           
           
          
          } catch (error) {
            console.error("Error fetching Google user profile :", error);
            localStorage.removeItem('profile_info')
            // Handle the error appropriately, e.g., show a notification
          }


          try{
            const name_data = await axios.get(`${api_url}/get_name/${session?.user?.email}`);
            // const new_name_data = await axios.get(`${api_url}/get-google-user-profile/${session?.user?.email}`);

            console.log('the name data is here : ', name_data.data)
            // console.log('the name google data is here : ', new_name_data.data)

            localStorage.setItem('google_name_data', JSON.stringify(name_data.data))
             // Set the full name from the name profile
             const nameProfile = name_data.data.name;
             setFullName(nameProfile);

          }catch(error) {
            console.log("error getting user name data : ", error)
          }
          
  
    }

   
    }
        fetchGoogleUserData();
        setIsMounted(true);
    }, [session, token, api_url, router]);


    const handleLogout = () => {
        if (session) {
            // User signed in with Google
            signOut();
            router.push('/login');
        } else {
            // User signed in with your form
            logout();
            router.push('/login');
        }
        closeDropdown(); // Ensure dropdown closes after logout

        if (typeof window !== 'undefined') {
            localStorage.removeItem('profile_info');
            localStorage.removeItem('interest_info');
            }
    };

    const closeDropdown = () => setIsOpen(false);

    const handleNavigation = (path: string) => {
        router.push(path);
        closeDropdown(); // Close dropdown after navigation
    };

    if (!isMounted) return null;

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3 ">
                {/* Other content */}
            </div>

            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="
                    p-4
                    md:py-1
                    md:px-2
                    border-[1px]
                    border-neutral-200
                    flex
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:shadow-md
                    transition
                    sm:mr-3
                "
            >
                <AiOutlineMenu />
                <div className="hidden md:block">Parcourir</div>
            </div>

            {isOpen && (
                <div
                    className="
                        mt-5
                        absolute
                        rounded-xl
                        shadow-md
                        w-[50vw]
                        md:w-[50vw]
                        lg:w-[20vw]
                        bg-white
                        overflow-hidden
                        right-0
                        top-12
                        text-sm
                        z-0
                    "
                >
                    <div className="flex flex-col cursor-pointer">
                        {/* <MenuItem
                            onClick={() => handleNavigation("/reservations")}
                            label="Maisons à vendre"
                        />
                        <MenuItem
                            onClick={() => handleNavigation("/dates")}
                            label="Maisons à louer"
                        />
                        <MenuItem
                            onClick={() => handleNavigation("/properties")}
                            label="Terrains à vendre"
                        />
                        <MenuItem
                            onClick={() => handleNavigation("/properties")}
                            label="Terrains à louer"
                        /> */}
                        <hr /><br />
                        {(session || token) ? (
                            <>
                           
                             <div className="flex items-center">    
                                <MenuItem
                                    onClick={() => router.push('/dashboard')}
                                    label={rName || newGName || regularUser.firstname || fullName}
                                />
                                {session && (  
                                    <Image 
                                    src={imageLink} 
                                    alt="User Image" 
                                    width={40} 
                                    height={40} 
                                    className=" mx-2 h-10 w-10 rounded-full"
                                />
                                )}
                                 {token && (  
                                    <Image 
                                    src={imageLink} 
                                    alt="User Image" 
                                    width={40} 
                                    height={40} 
                                    className=" mx-2 h-10 w-10 rounded-full"
                                />
                                )}
                            </div>


                             <MenuItem
                               onClick={() => handleNavigation("/dashboard")}
                                label="Dashboard"
                            />
                            
                            <MenuItem
                                onClick={handleLogout}
                                label="Se déconnecter"
                            />

</>
                        ) : (
                            <>
                                <MenuItem
                                    onClick={() => handleNavigation("/login")}
                                    label="Se connecter"
                                />
                                <MenuItem
                                    onClick={() => handleNavigation("/signup")}
                                    label="Créer un compte"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
