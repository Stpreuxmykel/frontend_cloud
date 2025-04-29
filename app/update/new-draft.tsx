"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { toast } from "react-hot-toast";
import ImageData from "@/app/component/ImageData";


import { VscRobot } from "react-icons/vsc";
import Image from "next/image";

const CategoryList = [
  "Maisons de luxe",
  "Propriétés en bord de mer",
  "Vie urbaine",
  "Vie rurale",
  "Maisons de montagne",
  "Maisons écologiques",
  "Maisons intelligentes",
  "Propriétés d'investissement",
  "Premier achat immobilier",
  "Maisons familiales",
  "Communautés de retraités",
  "Communautés sécurisées",
  "Propriétés historiques",
  "Architecture moderne",
  "Architecture traditionnelle",
  "Propriétés en bord de l'eau",
  "Résidences secondaires",
  "Propriétés à louer",
  "Condos",
  "Maisons de ville",
  "Maisons multifamiliales",
  "Maisons unifamiliales",
  "Propriétés commerciales",
  "Lofts",
  "Fermes",
  "Plans ouverts",
  "Espaces de bureaux à domicile",
  "Propriétés acceptant les animaux",
  "Maisons avec piscines",
  "Jardins",
  "Maisons économes en énergie",
  "Maisons neuves",
  "Propriétés à rénover",
  "Espaces verts",
  "Vues sur la ville",
  "Vie en banlieue",
  "Logements abordables",
  "Domaines campagnards",
  "Maisons Art déco",
  "Maisons du milieu du siècle",
  "Maisons minimalistes",
  "Locations de luxe",
  "Locations de vacances",
  "Espaces de cohabitation",
  "Tiny Houses (petites maisons)",
  "Maisons accessibles",
  "Maisons avec maisons d'amis",
  "Maisons avec sous-sols",
  "Maisons avec garages",
  "Appartements en hauteur",
];


interface ImageType {
  id: string;
  image: string;
}

export default function AddPropertyModal({
  params,
}: {
  params: { id: string };
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [userId, setuserId] = useState<string | undefined>();
  const [updateData, setUpdateData] = useState<any>({});
  const [propertyType, setPropertyType] = useState<string>("");
  const [currencyType, setCurrencytype] = useState<string>("");
  const [statusType, setStatusType] = useState<string>("open");
  const [decisionType, setDecisionType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myImages, setMyImages] = useState<File[]>([]);
  const [realTimeimage, setRealTimeImage] = useState<File | null>(null);
  const [realTimeImages, setRealTimeImages] = useState([]);
  // // const [realTimeImages, setRealTimeImages] = useState<{ [key: string]: string }>({});
  // const [realTimeImages, setRealTimeImages] = useState<Record<string, string>>({});

  
  const [realTimeImageIndex, setRealTimeImageIndex] = useState("");

  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]); // To store states for the selected country
  const [selectedState, setSelectedState] = useState(''); // To store the selected state
  const [cities, setCities] = useState([]); // To store cities for the selected state
  const [selectedCity, setSelectedCity] = useState('');
  const [address, setAddress] = useState('');
  const [actualUser, setActualUser] = useState(null)
  const [verifyUser, setVerifyUser] = useState(null)
  const [googleVerify, setGoogleVerify] = useState(null)
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [token, setToken] = useState("");
  const [bigCheck, setBigCheck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');

  const [choiceType, setChoiceType] = useState<string>("non");





  // const googleOwnwer = bigCheck.google_user_property?.user
  // const regularOwnwer = bigCheck.user_property?.user

  const googleOwnwer = (bigCheck as { google_user_property?: { user: any } }).google_user_property?.user;
  const regularOwnwer = (bigCheck as { user_property?: { user: any } }).user_property?.user;

  console.log("Checking...: ", bigCheck)

  console.log("Big check google : ", googleOwnwer)
  console.log("my user Id : ", userId)
  
  console.log("============================================")
  console.log("regular property: ", regularOwnwer)
  console.log("user id regular : ", actualUser)


  const api_url= process.env.NEXT_PUBLIC_BACKEND_API_URL

  const router = useRouter();
  const { id } = params;

  const { data: session } = useSession();

  const nextStep = () => {
    // Check if either title or description is empty
    if(step===1) {
      if (!title || !description) {
        const er = "La description et le titre sont obligatoires";
        setFormError(er);
        toast.error(er);  // Display the error immediately
      }else {
        // Clear any previous errors and proceed
        setFormError("");
        setStep((prev) => Math.min(prev + 1, 3));
      }
   
    }

    if(step===2) {
      if (selectedCategories.length === 0) {
        const er = "Veuillez sélectionner au moins une catégorie.";
        setFormError(er);
        toast.error(er); // Display the error immediately
      }else {
        setFormError("");
        setStep((prev) => Math.min(prev + 1, 3));
      }
    }


    
   
  

   
  };


  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = React.useState(null);

  // console.log("The user property images are : ",myImages)
  const newImages = Array.isArray(myImages) ? myImages : [];
  console.log("The  image list is : ", newImages);
  console.log("The image link is : ", realTimeImages.length);
  console.log("googleVerify", googleVerify)
  console.log("userid", userId)



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
          setMyImages(user_property?.images || google_user_property?.images);
          setGoogleVerify(google_user_property?.user);
           // Set the update data based on which property exists
          const propertyData = user_property || google_user_property;
          setUpdateData(propertyData);

          // Set the title from the available property data
          setTitle(propertyData.title);  // Assuming the title field is in both user_property and google_user_property
          setDescription(propertyData.description);
          setPrice(propertyData.price.toString());
          setCity(propertyData.city);
          setState(propertyData.state);
          setCountry(propertyData.country);
          setDecisionType(propertyData.decision);
          setStatusType(propertyData.status);
          setCurrencytype(propertyData.currency)
          setSelectedCategories(propertyData.category.split(","));
          setPropertyType(propertyData.type);
          setAddress(propertyData.address);
          setPhoneNumber(propertyData.new_phone_number)
          
                
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
        

  
      } catch (error:any) {
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
  if(session) {
  if (googleOwnwer !== userId || regularOwnwer ) {
    setIsModalOpen(false);
  } else {
    setIsModalOpen(true);
  }

}
}, [googleOwnwer, userId, regularOwnwer, session]);  // Trigger when googleOwner or userId changes
  




  // Add another useEffect to automatically handle modal state based on googleOwner and userId
  useEffect(() => {
    if(token) {
      if (actualUser !==regularOwnwer || googleOwnwer ) {
        setIsModalOpen(false);
      } else {
        setIsModalOpen(true);
      }
    }
 
  }, [regularOwnwer, actualUser, googleOwnwer, token]);  // Trigger when googleOwner or userId changes
    





useEffect(() => {
  if (loading) {
    setIsModalOpen(false);
  }else {
    setIsModalOpen(true);
  }
}, [loading]);


  useEffect(() => {
    const fetchToken = async () => {
      const mytoken = await getToken(); // Ensure token is fetched
      setToken(mytoken ? mytoken : "");
    };
  
    fetchToken();
  }, []); // Run only once when component mounts to get the token
  

  
  useEffect(() => {
    setLoading(true)
    const loadCountries = async () => {
      try {
        const response = await fetch('/allCountries.json');
        const data = await response.json();
        console.log("All countries json data: ",data )
        setCountries(data);
      } catch (error) {
        console.error("Error loading countries data:", error);
      }finally{
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setImages([...images, ...(e.target.files || [])]);
  // };

  const handleCategorySelect = (category: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      const newSelectedCategories = prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((item) => item !== category)
        : [...prevSelectedCategories, category];
      return newSelectedCategories;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(step===3) {
      if (  !propertyType ||!address) {
        if(propertyType !== "Hotel" && propertyType !== "Site Touristique") {
 
          if(!propertyType){
           const er = "Veuillez sélectionner le type de propriéte";
            setFormError(er);
            toast.error(er); // Display the error immediately
          }
         
        
          } 



          
        if(!address) {
          const er = "Veuillez fournir l'adresse";
          setFormError(er);
          toast.error(er); // Display the error immediately
        }

       

       if (propertyType !== "Hotel" && propertyType !== "Site Touristique") {
        if(!decisionType) {
          const er = "Sélectionner si c'est à vendre ou à louer ";
          setFormError(er);
          toast.error(er); // Display the error immediately
        }
       }

      }else {
        setFormError("");
        setStep((prev) => Math.min(prev + 1, 3));

        setIsLoading(true);

        const formData = new FormData();

        if(propertyType !=="Site Touristique") {
          const formattedPrice = parseFloat(price).toFixed(2);
          formData.append("price", formattedPrice);
         }

         if(!price) {
          const formattedPrice = parseFloat('0').toFixed(2);
          formData.append("price", formattedPrice);
         }

         if(!phoneNumber) {
          formData.append("new_phone_number", '');
         }else{
          formData.append("new_phone_number", phoneNumber);
         }


             // formData.append("price", parseFloat(price).toFixed(2));

        formData.append("title", title);
        formData.append("description", description);
    
        formData.append("city", selectedCity || city);
        formData.append("state", selectedState || state);
        formData.append("type", propertyType);
        formData.append("decision", decisionType);
        formData.append("status", statusType);
        formData.append("currency", currencyType);
        formData.append("country", selectedCountry);
        formData.append("address", address);
        formData.append("category", selectedCategories.join(","));
      


        

     try {
      const url = session
        ? `${api_url}/google_update_property_user/${updateData?.id}/`
        : `${api_url}/update_property_user/${updateData?.id}/`;

      await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      setIsModalOpen(false);
      toast.success("Property updated successfully");
      router.push("/my_list");
    } catch (error:any) {
      if (error.response && error.response.status === 404) {
        toast.error("Property not found.");
        router.push("/"); // Redirect to the 404 error page or any page you choose
      } else {
        console.error("Error updating property data:", error);
      }

      const phone_err = error.response.data.phone_number[0]
      if(phone_err) {
          toast.error(phone_err);
        }
    } finally {
      setLoading(false);
    }
    

      }

    }
  

   

  };

  // Function to handle file input change
  const handleFileChange = async (event:any, img:any) => {
    const file = event.target.files[0];

   
    if (file) {

      // Handle file upload
      const formData = new FormData();
      formData.append("image", file);
       // Token part
      if(token) {
      try {
  
        const update_images = await axios.put(
          `${api_url}/update_user_property_image/${img.id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

    

        const fullUrl = update_images.data.imageUrl;
        const mediaPath = update_images.data.imageUrl

        console.log(
          "Image  updated successfully  : ",
          update_images.data
        );
        console.log("Image  id  is : ", update_images.data.id);

        setRealTimeImageIndex(mediaPath);

        // Check if the response data contains the updated image URL
        const updatedImageUrl = mediaPath;

  

        // Update the specific image in the realTimeImages state using the image ID from the response
        setRealTimeImages((prevImages:any) => ({
          ...prevImages,
          [update_images.data.id]: updatedImageUrl || fullUrl, // Fallback to original image if no new URL
        }));
      } catch (error) {
        console.error(`Error updating image with ID ${img.id}:`, error);
      }

    }

    if(session) {
      try {
  
        const update_images = await axios.put(
          `${api_url}/update_google_user_property_image/${img.id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

    

        const fullUrl = update_images.data.imageUrl;
        const mediaPath = update_images.data.imageUrl;

        console.log(
          "Image  updated successfully data : ",
          update_images.data
        );
        console.log("Image  id  is : ", update_images.data.id);

        setRealTimeImageIndex(mediaPath);

        // Check if the response data contains the updated image URL
        const updatedImageUrl = mediaPath;

  

        // Update the specific image in the realTimeImages state using the image ID from the response
        setRealTimeImages((prevImages:any) => ({
          ...prevImages,
          [update_images.data.id]: updatedImageUrl || fullUrl, // Fallback to original image if no new URL
        }));
      } catch (error) {
        console.error(`Error updating image with ID ${img.id}:`, error);
      }

    }


    }

  
  };



  
  const handleCountryChange = (name: string) => {
    setSelectedCountry(name);

    // Find the selected country's states and set them in the state
    const country = countries.find((country) => country.name === name);
    setStates(country ? country.states : []);
    setSelectedState(''); // Reset the state when a new country is selected
  };


  const handleStateChange = (stateName:any) => {
    setSelectedState(stateName);

    // Find the selected state's cities and set them in the state
    const state = states.find((state:any) => state.name === stateName);
    setCities(state ? (state as any).cities || [] : []); // Default to empty array if cities are undefined
    setSelectedCity(''); // Reset selected city when state changes
  };

  // Function to open the file input dialog
  const openFileDialog = (img:any) => {
    setSelectedImage(img);
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).click();
    }
  };

  console.log("My token : ", token)

  const baseUrl = api_url;

  // console.log("verify user: ", verifyUser)
  console.log("actual user: ", actualUser)
  console.log("data to update: ", updateData)


  const handleOpenChange = () => {
    setIsModalOpen(false);
      // Add your routing logic here
      router.push(`/properties/${updateData.property_id}`); // Replace '/property' with your desired route
    
  };


  // if (isUnauthorized || updateData.user !== userId) {
  //   return <div>Unauthorized!</div>;
  // }

  console.log("google user id : ", userId)
  console.log("google owner : ", googleOwnwer)
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
       
      
        <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>

      
              {isModalOpen ? 
              
              <Button
              variant="outline"
              className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white"
              >

              Mettre à jour 
              </Button>
                  
              :"" 
              }
             
        
           
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Update Property</DialogTitle>
              <DialogDescription>
                Modify the details to update your property.
              </DialogDescription>
            </DialogHeader>
            <form>
              {step === 1 && (
                <div className="grid gap-4 py-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold mb-2"
                    >
                      Title
                    </label>
                    <Input
                      id="title"
                      type="text"
                      className="w-full"
                      placeholder="Property Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold mb-2"
                    >
                      Description
                    </label>
                    <Input
                      id="description"
                      type="text"
                      className="w-full"
                      placeholder="Property Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="grid gap-4 py-4">
                  {propertyType !=="Site Touristique" && (

                      <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-semibold mb-2"
                      >
                       {propertyType ==="Hotel" ? "Prix par nuit" : "Prix"} 
                      </label>
                      <Input
                        id="price"
                        type="text"
                        className="w-full"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      </div>

                  )}
                

                {propertyType !=="Site Touristique" && (
                  <div className="mt-3">
                    <label
                      htmlFor="type"
                      className="block text-sm font-semibold mb-2"
                    >
                      Modifier la monaie
                    </label>
                    <Select
                   
                      value={currencyType}
                      onValueChange={(value) => setCurrencytype(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={currencyType || "Mofier le statut"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HTG">HTG</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                )}

                  <div className="space-y-6">


                    <label className="block text-sm font-semibold mb-2">
                      Categories
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-48 overflow-y-auto">
                      {CategoryList.map((category) => (
                        <div
                          key={category}
                          className={`p-4 border rounded-lg ${
                            selectedCategories.includes(category)
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-800 hover:bg-blue-50"
                          } cursor-pointer transition-colors`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="grid gap-4 py-4">
                   <div
                  className="max-h-96 overflow-y-auto p-4"
                >
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-semibold mb-2"
                    >
                      Modifier le type
                    </label>
                    <Select
                    
                      value={propertyType}
                      onValueChange={(value) => setPropertyType(value)}
                    
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={propertyType || "Modifier le type"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="Maison">Maison</SelectItem>
                        <SelectItem value="Appartement">Appartement</SelectItem>
                        <SelectItem value="Building">Building</SelectItem>
                        <SelectItem value="Espace Publicitaire">Espace Publicitaire</SelectItem>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Terrain">Terrain</SelectItem>
                        <SelectItem value="Site Touristique">Site Touristique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-3">
                  <span className="text-slate-500 text-sm">Informations géographique : {country}, {state}, {city}</span>
                  </div>

                  <div className="mt-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-semibold mb-2"
                    >
                      Pays
                    </label>
                    <Select onValueChange={handleCountryChange} value={selectedCountry}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un nouveau pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-3">

                  {states.length > 0 && (
                        <Select value={selectedState} onValueChange={handleStateChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un nouveau departement" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={(state as { id: string}).id} 
                              value={(state as { name: string }).name}>
                                {(state as { name: string }).name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                  </div>

                  <div className="mt-3">

                  {cities.length > 0 && (
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une nouvelle ville" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={(city as {id:string}).id} value={(city as {name:string}).name}>
                                {(city as { name: string }).name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    
                  </div>


                  <div className="mt-3">
                    <label
                      htmlFor="type"
                      className="block text-sm font-semibold mb-2"
                    >
                      Modifier le statut
                    </label>
                    <Select
                    
                      value={statusType}
                      onValueChange={(value) => setStatusType(value)}
                   
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={statusType || "Mofier le statut"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="close">Close</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {propertyType !=="Site Touristique" && propertyType!=="Hotel" && (
                  <div className="mt-3">
                    <label
                      htmlFor="type"
                      className="block text-sm font-semibold mb-2"
                    >
                      Modifier Votre décision
                    </label>
                    <Select
                   
                      value={decisionType}
                      onValueChange={(value) => setDecisionType(value)}
                     
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={decisionType || "Mofier le statut"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="à vendre">À vendre</SelectItem>
                        <SelectItem value="à louer">À louer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  )}

                  <div className="mt-3">
                    <label
                      htmlFor="address"
                      className="block text-sm font-semibold mb-2"
                    >
                      Adrresse
                    </label>
                    <Input
                      id="address"
                      type="text"
                      className="w-full"
                      placeholder="Addresse"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  
                  <div className="mt-3">
                  <label htmlFor="phone" className="block text-sm font-semibold mt-3">
                     Editier le numéro de téléphone associé à cette publication
                    </label>
                    <Input
                      id="phone"
                      type="text"
                      className="w-full"
                      placeholder="Ex:+50942424242"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>



                  <div className="mb-4"></div>

             

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 h-48 overflow-y-auto ">
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(event) =>
                        selectedImage && handleFileChange(event, selectedImage)
                      }
                    />

     


                    {newImages.length > 0 ? (
                      newImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative cursor-pointer"
                          onClick={() => openFileDialog(img)}
                        >
                          <Image
                            src={
                              realTimeImages[img.id] // Check if a new image for this ID exists
                                ? `${realTimeImages[img.id]}` // Use the updated image URL
                                : `${baseUrl}${img.image}` // Otherwise, use the original image
                            }

                         
                            height={128} // Matches the Tailwind class h-32
                            width={256}  // Adjust width according to your layout needs

                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        </div>
                      ))
                    ) : (
                      <p>No additional images available.</p>
                    )}

                    

                  
                  </div>
                

                </div>
                </div>

              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                {step < 3 ? (
                  <Button
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    type="button"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    type="button"
                    className={`bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${
                      isLoading && "cursor-not-allowed"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin h-6 w-6 mx-1" />
                    ) : (
                      "Update Property"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
