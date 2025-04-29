"use client";

import { Orbitron } from "next/font/google";
import Sidebar from "../component/Sidebar";
import Image from "next/image";

import { useState, useEffect } from "react";
import { getVirtualCard, getId } from "../api/action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent,DialogFooter,DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { getToken } from "../lib/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function FuturisticCard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [secret_code, setSecretCode] = useState("");
  const [error, setError] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [oldCode, setoldCode] = useState("");
  const [newCode, setnewCode] = useState("");

  const router = useRouter();
  const token = getToken()

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;


  const openUpdateModal=()=> {
    setIsUpdating(true)
  }
  

const handleUpdateClick=()=> {
  setIsUpdating(true)
}

useEffect(()=> {
  if(!token) {
    setLoading(true)
    router.push("/login")
   }

}, [router, token])



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchCardDataInf = async () => {
    try {
      const card = await getVirtualCard();
      console.log("Fetched Card Data:", card); // Debugging log

      if (!card) {
        console.error("No card data received.");
        return;
      }

      setCard(card.card_info); // Store card details
      setShowSecret(card.password_set); // Show password section only if it's set

      if (!card.password_set) {
        console.log("Password not set");
      } else {
        console.log("Password set");
      }

    } catch (error) {
      console.error("Error fetching virtual card data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCardDataInf();
  }, []);
  

  const handleSubmit = async () => {
 
  
    setLoading(true);

      try {
        const token = getToken();
        const userId = getId();
    
        const response = await axios.post(
          `${api_url}/virtual-card/${userId}/`,  // Use the correct API endpoint
          { secret_code: password },  // Ensure the correct key is sent
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        toast.success(response.data.message);
        console.log("Password saved: ", response.data);
        fetchCardDataInf();
        setPassword("");
        if(response.data.message=="authenticated") {
          setEnabled(true);
          setoldCode("");
          setnewCode("");
          setError("");
          setPassword("");

        }

        setIsModalOpen(false);
      } catch (error) {
        console.log("Error setting password:", error.response?.data || error);
        setError(error.response?.data?.error || "Network error. Please try again.");
        setoldCode("");
        setnewCode("");
        setPassword("");
      } finally {
        setLoading(false);
      }

    
  
  
  };


  const updateSecretCode = async () => {
    const token = getToken();
    const userId = getId();
    setLoading(true);
    try {
 

      const response = await axios.put(
        `${api_url}/virtual-card/${userId}/`, // Adjust URL if needed
        {
          old_secret_code: oldCode,
          new_secret_code: newCode
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // if you're using JWT
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log(response.data); // Success message
      toast.success(response.data.message);
      setIsUpdating(false);
      setIsModalOpen(false);
      setEnabled(false);
      setError("");
      setoldCode("");
      setnewCode("");
      setPassword("");
    } catch (error) {
      console.error(error.response.data); // Error message
      setoldCode("");
      setnewCode("");
      setPassword("");
    }finally{
      setLoading(false)
    }
  };
  
  

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-xl">
        {/* Animated ring */}
        <div className="absolute h-32 w-32 rounded-full border-8 border-green-400/20 animate-pulse" />
        
        {/* Floating text */}
        <div className="relative flex flex-col items-center">
          {/* Glowing text */}
          <div className="text-4xl font-bold cyber-font">
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-glow">
              LOADING
            </span>
            <span className="text-cyan-400 animate-[blink_1.5s_infinite]">...</span>
          </div>
          
          {/* Animated particles */}
          <div className="mt-4 flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('/circuit-pattern.svg')] bg-repeat animate-[move_20s_linear_infinite]" />
      </div>
    );
  }
  
  return (
    <div className="bg-black p-4 min-h-screen">
      
      <div className="relative group perspective-1000 hover:scale-[1.02] transition-all duration-300 mt-14 mx-auto flex items-center justify-center">
        {/* Floating holographic effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-green-400/30 to-blue-500/30 rounded-xl blur-xl animate-pulse" />

        {/* Main display panel */}
        <div className="relative  bg-black/50 backdrop-blur-lg border-2 border-green-400/30 rounded-xl p-6 overflow-hidden transform-style-preserve-3d">
          {/* Matrix-like falling dots overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIxIiBmaWxsPSIjZmZmIi8+PC9zdmc+')]" />

          {/* Neon text container */}
          <div className="relative space-y-3 z-10">
            <div className="text-sm font-light text-cyan-300/80 tracking-widest">
              TOTAL DIGITAL ASSETS
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-300 to-rose-400 bg-clip-text text-transparent drop-shadow-glow">
              {card?.amount}
              <span className="ml-2 text-xl text-cyan-400/80 font-mono">
                HTG
              </span>
            </h2>
          </div>

          {/* Animated border elements */}
          <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-transparent to-green-400" />
          <div className="absolute bottom-0 right-0 w-12 h-px bg-gradient-to-l from-transparent to-blue-400" />

          {/* Holographic reflection */}
          <div className="absolute inset-0 rounded-xl animate-shine shadow-[inset_0_0_30px_rgba(34,197,94,0.1)]" />
        </div>
      </div>

      <div className="relative  flex items-center justify-center mt-5">

        {/* Main Card Container */}
        <div
          className={`relative w-96 h-56 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 ${orbitron.className}`}
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-blue-600/20 to-rose-500/20 backdrop-blur-xl" />

          {/* Circuit Pattern */}
          <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-20 animate-pulse" />

          {/* Holographic Edge Effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/10" />
          <div className="absolute inset-0 rounded-2xl animate-shine shadow-[inset_0_0_10px_rgba(34,197,94,0.5)]" />

          {/* Card Content */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            {/* Card Header */}
            <div className="flex justify-between items-center">
              <Image
                src="/images/espaslink.png"
                alt="Logo"
                width={55}
                height={55}
                className="rounded-md"
              />
              <span className="text-green-400 text-sm">Espaslink Card</span>
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <div className="flex gap-4 text-2xl text-green-400 drop-shadow-glow">
                <span>
                  {`${card?.card_number.slice(
                    0,
                    1
                  )}...${card?.card_number.slice(
                    4,
                    5
                  )}...${card?.card_number.slice(
                    8,
                    9
                  )}...${card?.card_number.slice(
                    10,
                    12
                  )}...${card?.card_number.slice(-2)}`}
                </span>
              </div>
              <div className="flex justify-between text-green-300/80 text-sm">
                <span>
                  {card?.firstname} {card?.lastname}
                </span>
                <span>EXP: {card?.expiry_date}</span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-center text-green-300/80 text-sm">
              <span>CVV: ***</span>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full" />
                <span>{card?.is_active ? "Active" : "Blocked"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>






      {/* Secure Details Modal */}
     


<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
{error && (
            <span className="text-red-400 flex items-center justify-center text-center w-full">
            {error}
          </span>
          
          )}
  <DialogTrigger asChild>


  <div className="flex justify-center mt-6">
   
        <button 
          onClick={() => setIsModalOpen(true)}
          className=" px-6 py-2 bg-gradient-to-r from-green-400/20 to-cyan-400/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
        >
          SEE CARD DETAILS
        </button>

      <button
        onClick={() => router.push('/recharge')}
       className=" px-6 py-2 mx-3 bg-gradient-to-r from-green-400/20 to-cyan-400/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl cyber-font">⚡</span>
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent text-lg font-semibold">
            RECHARGE CARD
          </span>
          <span className="text-xl cyber-font animate-pulse">➔</span>
        </div>
      </button>


    </div> 
  </DialogTrigger>

  <DialogContent className="bg-gray-900/95 backdrop-blur-2xl border-0 max-w-md rounded-2xl overflow-hidden">
    {/* Animated background elements */}
   
    <DialogHeader>
      <DialogTitle className="text-3xl cyber-font bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
        SECURE ENCRYPTION PORTAL
      </DialogTitle>
      <DialogDescription className="text-cyan-400/80 mt-2">
        Initiate biometric verification sequence
      </DialogDescription>
    </DialogHeader>

    {showSecret==false ? (
       <div className="space-y-6 relative z-10">
       {/* Password Input */}
       <div className="group relative">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
         <div className="relative space-y-1">
           <label className="block text-sm text-cyan-400 ml-1">SECURITY PASSPHRASE</label>
           <Input
             id="password"
             type="password"
             className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg p-3 text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-400/50"
             placeholder="••••••••"
             name="secret_code"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
           />
         </div>
       </div>
 
       {/* Confirm Password */}
       <div className="group relative">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
         <div className="relative space-y-1">
           <label className="block text-sm text-cyan-400 ml-1">CONFIRM PASSPHRASE</label>
           <Input
             id="confirmPassword"
             type="password"
             className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg p-3 text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-400/50"
             placeholder="••••••••"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
           />
         </div>
       </div>
 
       {error && (
         <div className="text-red-400 flex items-center gap-2 animate-pulse">
           <div className="h-2 w-2 bg-red-400 rounded-full" />
           {error}
         </div>
       )}
     </div>
    ): (
      <div className="space-y-6 relative z-10">
      {/* Password Input */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
        <div className="relative space-y-1">
          <label className="block text-sm text-cyan-400 ml-1">SECURITY PASSPHRASE</label>
          <Input
            id="password"
            type="password"
            className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg p-3 text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-400/50"
            placeholder="••••••••"
            name="secret_code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

   

      {error && (
        <div className="text-red-400 flex items-center gap-2 animate-pulse">
          <div className="h-2 w-2 bg-red-400 rounded-full" />
          {error}
        </div>
      )}
    </div>
    )}

  

    <DialogFooter>
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-cyan-400 to-green-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-all"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            <span>INITIALIZING ENCRYPTION...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>ACTIVATE SECURITY PROTOCOL</span>
            <span className="text-xl">⚡</span>
          </div>
        )}
      </Button>
    </DialogFooter>

    <DialogClose className="absolute top-4 right-4 p-1 text-cyan-400 hover:text-cyan-300 transition-colors">
      <span className="text-2xl">⨉</span>
    </DialogClose>
  </DialogContent>
</Dialog>



{/* CARD DETAILS DIALOG */}


<Dialog open={enabled} onOpenChange={setEnabled}>


  <DialogContent className="bg-gray-900/95 backdrop-blur-2xl border-0 max-w-md rounded-2xl overflow-hidden">
    {/* Animated background elements */}
   
    <DialogHeader>
      <DialogTitle className="text-3xl cyber-font bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
        SECURE ENCRYPTION PORTAL
      </DialogTitle>
      <DialogDescription className="text-cyan-400/80 mt-2">
        Initiate biometric verification sequence
      </DialogDescription>
    </DialogHeader>

  
    <div className="space-y-6 neon-details">
           <div className="grid grid-cols-2 gap-4">
             <div>
               <p className="text-cyan-400">Full Card Number</p>
               <p className="font-mono text-green-300">{card?.card_number}</p>
             </div>
             <div>
               <p className="text-cyan-400">CVV</p>
               <p className="font-mono text-green-300">{card?.cvv}</p>
             </div>
             <div>
               <p className="text-cyan-400">Expiration date</p>
               <p className="font-mono text-green-300">{card?.expiry_date}</p>
             </div>
             <div>
               <p className="text-cyan-400">Creation Date</p>
               <p className="font-mono text-green-300">
                 {new Date(card?.created_at).toLocaleDateString()}
               </p>
             </div>
           </div>
           <div className="border-t border-cyan-400/20 pt-4">
  <p className="text-cyan-400">Security Status</p>

  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-green-400">
      <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
      ENCRYPTION ACTIVE
    </div>

    <button
      onClick={openUpdateModal} // Define this function to open a modal or route
      className="text-sm text-cyan-500 hover:text-cyan-300 border border-cyan-500 px-3 py-1 rounded-md transition duration-300"
    >
      Update Secret Code
    </button>
  </div>
</div>

         </div>
  


    <DialogClose className="absolute top-4 right-4 p-1 text-cyan-400 hover:text-cyan-300 transition-colors">
      <span className="text-2xl">⨉</span>
    </DialogClose>
  </DialogContent>
</Dialog>

{/* UPDATING SECRET CODE DIALOG */}

<Dialog open={isUpdating} onOpenChange={setIsUpdating}>


  <DialogContent className="bg-gray-900/95 backdrop-blur-2xl border-0 max-w-md rounded-2xl overflow-hidden">
    {/* Animated background elements */}
   
    <DialogHeader>
      <DialogTitle className="text-3xl cyber-font bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
        UPDATE SECRET CODE 
      </DialogTitle>
      <DialogDescription className="text-cyan-400/80 mt-2">
        Initiate biometric verification sequence
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-6 relative z-10">
       {/* Password Input */}
       <div className="group relative">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
         <div className="relative space-y-1">
           <label className="block text-sm text-cyan-400 ml-1">Old password</label>
           <Input
             id="password"
             type="password"
             className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg p-3 text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-400/50"
             placeholder="••••••••"
             name="secret_code"
             value={oldCode}
             onChange={(e) => setoldCode(e.target.value)}
           />
         </div>
       </div>
 
       {/* Confirm Password */}
       <div className="group relative">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
         <div className="relative space-y-1">
           <label className="block text-sm text-cyan-400 ml-1">New Password</label>
           <Input
             id="confirmPassword"
             type="password"
             className="w-full bg-gray-900/50 border border-cyan-400/30 rounded-lg p-3 text-cyan-300 font-mono focus:ring-2 focus:ring-cyan-400/50"
             placeholder="••••••••"
             value={newCode}
             onChange={(e) => setnewCode(e.target.value)}
           />
         </div>
       </div>
 
       {error && (
         <div className="text-red-400 flex items-center gap-2 animate-pulse">
           <div className="h-2 w-2 bg-red-400 rounded-full" />
           {error}
         </div>
       )}
     </div>

     <DialogFooter>
      <Button
        onClick={updateSecretCode}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-cyan-400 to-green-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-all"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            <span>INITIALIZING ENCRYPTION...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>ACTIVATE SECURITY PROTOCOL</span>
            <span className="text-xl">⚡</span>
          </div>
        )}
      </Button>
    </DialogFooter>
  


    <DialogClose className="absolute top-4 right-4 p-1 text-cyan-400 hover:text-cyan-300 transition-colors">
      <span className="text-2xl">⨉</span>
    </DialogClose>
  </DialogContent>
</Dialog>


          
  </div>

  );
}
