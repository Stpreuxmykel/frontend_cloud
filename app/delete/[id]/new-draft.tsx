"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { RiMenuFold3Fill } from "react-icons/ri";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/app/component/Sidebar";
import { getToken } from "@/app/lib/auth";
import { toast } from 'react-hot-toast';
import { VscRobot } from "react-icons/vsc";



export default function AddPropertyModal({ params }: { params: { id: string } }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [userId, setuserId] = useState<string | undefined>();
  const [deleteData, setDeleteData] = useState<any>({});
  const [propertyType, setPropertyType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();
  const { id } = params;
  const token = getToken();
  const { data: session } = useSession();
  const [newtoken, setToken] = useState("");

  const [loading, setLoading] = useState(true);
  const [bigCheck, setBigCheck] = useState([]);
  const [actualUser, setActualUser] = useState(null)

  const googleOwnwer = bigCheck.google_user_property?.user
  const regularOwnwer = bigCheck.user_property?.user

  const [googleVerify, setGoogleVerify] = useState(null)
  const [isUnauthorized, setIsUnauthorized] = useState(false);


  console.log("Checking...: ", bigCheck)

  console.log("Big check google : ", googleOwnwer)
  console.log("my user Id : ", userId)
  
  console.log("============================================")
  console.log("regular property: ", regularOwnwer)
  console.log("user id regular : ", actualUser)


  console.log("googleVerify", googleVerify)
  console.log(" Checking the specific delete data here  : ", deleteData?.id);


//  USE EFFECT 

const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL


useEffect(() => {

  const fetchPropertyAndGoogleData = async () => {
  
  
    try {
      // Create an array of promises for concurrent execution
      const propertyPromise = axios.get(`${api_url}/get-property/${id}`);
      setLoading(true); // Start loading

      let googlePromise;
      let regularPromise;

      if (session) {
        googlePromise = axios.get(`${api_url}/google-user-token/${session?.user?.email}`);
      } else {
        googlePromise = Promise.resolve({ data: { google_users_data: [] } }); // Fallback in case session is missing
      }

      if(token) {
        regularPromise =  axios.get(
          `${api_url}/actual_user_data/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
      }else {
        regularPromise = Promise.resolve({data: {regular_users_data: []}  });
      }

      // Wait for both promises to resolve
      const [propertyResponse, googleResponse, regularResponse] = await Promise.all([propertyPromise, googlePromise, regularPromise]);
     

      // Process property data
      const { user_property, google_user_property } = propertyResponse.data;
      console.log("The property data: ", propertyResponse.data);
      setBigCheck(propertyResponse.data);

      if (!user_property && !google_user_property) {
        toast.error("Property not found.");
        router.push("/"); // Redirect to home page if no property found
      } else {
        // setMyImages(user_property?.images || google_user_property?.images);
        setGoogleVerify(google_user_property?.user);
         // Set the update data based on which property exists
        const propertyData = user_property || google_user_property;
        setDeleteData(propertyData);

        // Set the title from the available property data
        setTitle(propertyData.title);
        setDescription(propertyData.description);
        setPrice(propertyData.price.toString());
        setLocation(propertyData.location);
        setCountry(propertyData.country);
        setSelectedCategories(propertyData.category.split(","));
        setPropertyType(propertyData.type);
              
      }


      // Process Google user data
      const { google_users_data } = googleResponse.data;
      
      if (google_users_data.length > 0) {
        setuserId(google_users_data[0].id);
      }

   

      console.log("regularResponse", regularResponse.data)
      const regularId = regularResponse.data.actual_user_data[0].user

      if(regularId) {
        setActualUser(regularId)
      }
      


    } catch (error) {
      console.log("Error when fetching data: ", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.error.includes("not a valid UUID")
      ) {
        toast.error("Property not found...");
        router.push("/"); // Redirect to home if invalid UUID
      }
    } finally {
      setLoading(false); // Stop loading after all requests are resolved
    }
  };

  fetchPropertyAndGoogleData();
}, [id, router, session, googleOwnwer, userId, token, api_url]);


  // Add another useEffect to automatically handle modal state based on googleOwner and userId
  useEffect(() => {
    if (googleOwnwer !== userId || regularOwnwer ) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  }, [googleOwnwer, userId, regularOwnwer]);  // Trigger when googleOwner or userId changes
    
  
    // Add another useEffect to automatically handle modal state based on googleOwner and userId
    useEffect(() => {
      if (actualUser !==regularOwnwer || googleOwnwer ) {
        setIsModalOpen(false);
      } else {
        setIsModalOpen(true);
      }
    }, [regularOwnwer, actualUser, googleOwnwer]);  // Trigger when googleOwner or userId changes
      
  
    console.log("Check modal state : ", isModalOpen )

    useEffect(() => {
      if (loading) {
        setIsModalOpen(false);
      }else{
        setIsModalOpen(true);
      }
    }, [loading]);
    
    useEffect(() => {
      const fetchToken = async () => {
        const mytoken = await getToken(); // Ensure token is fetched
        setToken(mytoken);
      };
    
      fetchToken();
    }, []); // Run only once when component mounts to get the token
    
  

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  



  const handleDelete = async () => {
    setIsLoading(true);

    if(token) {
    try {
    
        const response = await axios.delete(
            `${api_url}/delete_property_user/${deleteData?.id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            }
        );
        
        toast.success('Property deleted successfully');
        router.push("/my_list");  // Redirect to the properties list page after deletion
    } 
    // catch (error) {
    //   console.error("Error deleting property data:", error);
    // }

    catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Property not found.");
        router.push("/"); // Redirect to the 404 error page or any page you choose
      } else {
        console.error("Error updating property data:", error);
      }
    } finally {
      setLoading(false);
    }

  }




  if(session) {

    try {
      const response = await axios.delete(`${api_url}/delete_property_google_user/${deleteData?.id}/`)

      setIsModalOpen(false);
      toast.success('Property deleted successfully');
      router.push("/my_list");  // Redirect to the properties list page after deletion

    }catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Property not found.");
        router.push("/"); // Redirect to the 404 error page or any page you choose
      } else {
        console.error("Error updating property data:", error);
      }
    } finally {
      setLoading(false);
    }
    
  }

};




if(session) {
  if (userId !==googleOwnwer || regularOwnwer) {
    return (
      <div className="flex justify-center items-center mt-52">
        <div className="text-center">
          {loading ? (
            <div className="flex items-center">
              <VscRobot className="animate-spin text-3xl mr-2 text-sky-500" /> {/* Icon with spin animation */}
              <span className="text-xl font-bold">Checking...</span>
            </div>
          ) : (
            <span className="text-xl font-bold">Unauthorized!</span>
          )}
        </div>
      </div>
    );
  }
}


if (token) {
  if (actualUser !== regularOwnwer || googleOwnwer) {
    return (
      <div className="flex justify-center items-center mt-52">
        <div className="text-center">
          {loading ? (
            <div className="flex items-center">
              <VscRobot className="animate-spin text-3xl mr-2 text-sky-500" /> {/* Icon with spin animation */}
              <span className="text-xl font-bold">Checking...</span>
            </div>
          ) : (
            <span className="text-xl font-bold">Unauthorized!</span>
          )}
        </div>
      </div>
    );
  }
}




  return (
    <div className="flex h-screen">
      <div
        className={`fixed inset-y-0 left-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}
        {isModalOpen ?
             <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        : ""}
      </div>

      <div
        className={`flex-1 p-10 text-gray-700 overflow-y-auto ${
          isSidebarOpen ? "" : "w-full"
        } md:ml-64`}
      >
        {isModalOpen ? 
          <div
            className="md:hidden flex items-center space-x-2 p-2 mb-4 w-10 text-blue-800 border border-blue-800 rounded-md cursor-pointer hover:bg-blue-800 hover:text-white transition-colors duration-300"
            onClick={toggleSidebar}
          >
            <RiMenuFold3Fill className="text-xl" />
          </div>
        :""}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>

          {isModalOpen ? 
            <Button
              variant="outline"
              className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white"
            >
              Supprimer
            </Button>
             :"" 
            }

          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Suprimer cette publication</DialogTitle>
              <DialogDescription>
                {title}
              </DialogDescription>
            </DialogHeader>

            <div>
              Etes vous sur de vouloir supprimer cette publication?
            </div>
            <div>
              <Button 
                onClick={handleDelete} 
                variant="destructive">
                  Suprimer
              </Button>
              <Button onClick={()=>router.push('/my_list')} variant="secondary" className="mx-10" >Annuler</Button>
            </div>
           
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
