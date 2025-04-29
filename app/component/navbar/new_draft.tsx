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
import { getUserProfile } from "@/app/api/action";

const UserMenu = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    const [session, setSession] = useState("");

    const [userData, serUserData] = useState("");
 
    const defaultImage = '/images/np.webp'

    const [imageLink, setImageLink] =useState(defaultImage);

    const { data: testsession } = useSession();  
    const token = getToken();

    console.log("The regular name : ")
    console.log("User Data : ", userData)

  
    const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL

    const userId = localStorage.getItem("userId")
    console.log("user id: ", userId)


    useEffect(() => {
    const fetchData = async () => {
        try {
        const userData = await getUserProfile();
        serUserData(userData); 
        console.log("userData all: ",userData )
        } catch (error) {
        console.error("Error fetching properties:", error);
        }
    };
    fetchData();
    }, []);


    const handleLogout = () => {
        if (userData) {
            // User signed in with Google
            signOut();
            router.push('/login');
        } 
        closeDropdown(); // Ensure dropdown closes after logout

        if (typeof window !== 'undefined') {
            localStorage.removeItem('profile_info');
            localStorage.removeItem('userId');
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
                <div className="hidden md:block">Parcourir </div>
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
                     
                        <hr /><br />

                        {userData ? (
                            <>
                             <div className="flex items-center">    
                                <MenuItem
                                    onClick={() => router.push('/dashboard')}
                                    label={userData.firstname}
                                />

                                    <img 
                                        src={userData?.imageUrl ? userData.imageUrl : "/images/np.webp"}         
                                        alt="User image" 
                                        width={40} 
                                        height={40} 
                                        className=" mx-2 h-10 w-10 rounded-full"
                                    />
                             
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
