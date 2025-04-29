"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import MenuItem from "./MenuItem";
import { getToken, logout } from "@/app/lib/auth";
import { useSession, signOut } from "next-auth/react";
import { getUserProfile } from "@/app/api/action";
import Image from "next/image";
import { motion } from "framer-motion";
import useSWR, { mutate } from "swr";

const UserMenu = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const token = getToken();

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const defaultImage = "/images/np.webp";

  const userId = localStorage.getItem("userId");


  const fetcherWithToken = (url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());

  const shouldFetch = userId && token;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? [`${api_url}/create_user_profile/${userId}`, token] : null,
    ([url]) => fetcherWithToken(url)
  );

  
  const Image_data = data?.imageUrl;
  const firstname_data = data?.firstname;

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserProfile();
        console.log("Fetching user data from the navbar usermenu :", user);
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [token]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userId");
    setIsOpen(false);
    setUserData(null);
    router.push("/login");
  };

  const closeDropdown = () => setIsOpen(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    closeDropdown();
  };

  const MenuButton = ({ onClick, label, icon }) => (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      whileHover={{
        x: 10,
        background:
          "linear-gradient(90deg, rgba(34,211,238,0.1) 0%, rgba(168,85,247,0.1) 100%)",
      }}
      whileTap={{ scale: 0.95 }}
      className="p-3 rounded-lg flex items-center font-medium text-gray-300 hover:text-cyan-400 transition-all"
      onClick={onClick}
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        {label}
      </span>
      <div className="ml-auto opacity-50">➔</div>
    </motion.div>
  );

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-4 md:py-2 md:px-4  
             border 
             
             flex items-center gap-3 
             rounded-full cursor-pointer 
            
             transition-all duration-300 ease-in-out sm:mr-3"
      >
        <AiOutlineMenu className="text-xl" />
        <div className="hidden md:block font-medium">Parcourir</div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mt-5 absolute rounded-xl border border-cyan-500/30 w-[50vw] md:w-[50vw] lg:w-[20vw] bg-gray-900/95 backdrop-blur-xl overflow-hidden right-0 top-12 text-sm z-50 shadow-2xl shadow-cyan-500/20"
        >
          <div className="flex flex-col cursor-pointer">
            {/* Animated divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="h-px bg-gradient-to-r from-cyan-500 to-purple-500"
            />

            <div className="p-2 space-y-2">
              {token ? (
                <>
                  {/* User Card with Hover Effect */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/20 hover:border-cyan-500/40"
                  >
                    <div className="flex items-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 rounded-full bg-cyan-500 blur-[12px] opacity-30" />
                        {data ? (
                          <img
                            src={Image_data || defaultImage}
                            alt="User image"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full border-2 border-cyan-500/50"
                          />
                        ) : (
                          <img
                            src={userData?.imageUrl || defaultImage}
                            alt="User image"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full border-2 border-cyan-500/50"
                          />
                        )}
                      </motion.div>

                      {data ? (
                           <motion.span
                           initial={{ x: -10 }}
                           animate={{ x: 0 }}
                           className="ml-3 font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                         >
                           {firstname_data || "UTILISATEUR"}
                         </motion.span>
                      ): (
                        <motion.span
                        initial={{ x: -10 }}
                        animate={{ x: 0 }}
                        className="ml-3 font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                      >
                        { userData?.firstname || "UTILISATEUR" }
                      </motion.span>
                      )}
                     
                    </div>
                  </motion.div>

                  {/* Menu Items with Glowing Hover */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } },
                    }}
                  >
                    <MenuButton
                      onClick={() => handleNavigation("/dashboard")}
                      label="DASHBOARD"
                      icon="🚀"
                    />
                    <MenuButton
                      onClick={handleLogout}
                      label="DÉCONNEXION"
                      icon="⚡"
                    />
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                >
                  <MenuButton
                    onClick={() => handleNavigation("/login")}
                    label="CONNEXION"
                    icon="🔑"
                  />
                  <MenuButton
                    onClick={() => handleNavigation("/signup")}
                    label="INSCRIPTION"
                    icon="✨"
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserMenu;
