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
import Sidebar from "../component/Sidebar";
import { RiMenuFold3Fill } from "react-icons/ri";
import { getToken } from "../lib/auth";

import axios from "axios";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa6";
import  { getId, getUserInterest, getUserProfile, getUserProperties, getVirtualCard, getUserActualPlan, getTotal, getPlanType, deleteUploadedImages } from '../api/action';
import { CiMenuKebab } from "react-icons/ci";
import { MdAdd } from "react-icons/md";


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

export default function AddPropertyModal() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  // const [type, setType] = useState("");
  // const [country, setCountry] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]); // To store states for the selected country
  const [selectedState, setSelectedState] = useState(""); // To store the selected state
  const [cities, setCities] = useState([]); // To store cities for the selected state
  const [selectedCity, setSelectedCity] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [propertyType, setPropertyType] = useState<string>("");
  const [choiceType, setChoiceType] = useState<string>("non");
  const [currencyType, setCurrencytype] = useState<string>("");

  const [statusType, setStatusType] = useState<string>("open");
  const [decisionType, setDecisionType] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formError, setFormError] = useState("");

  const actualPlan = getUserActualPlan();
  const totalP = getTotal();
  const type = getPlanType();

  const property_count = Number(totalP)




  console.log("actual plan : ", actualPlan )
  console.log("total property update new : ", totalP )
  console.log("plan type : ", type )
  

  const router = useRouter();
  const token = getToken();

  const [userId, setUserId] = useState(null);

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  
      useEffect(()=> {
        if(!token) {
          router.push("/login")
         }
      
      }, [router, token])

  useEffect(() => {
    setUserId(getId()); // Fetch userId only on the client side

  }, []);

  const nextStep = () => {
    // Check if either title or description is empty
    if (step === 1) {
      if (!title || !description) {
        const er = "La description et le titre sont obligatoires";
        setFormError(er);
        toast.error(er); // Display the error immediately
      } else {
        // Clear any previous errors and proceed
        setFormError("");
        setStep((prev) => Math.min(prev + 1, 3));
      }
    }

    if (step === 2) {
      if (selectedCategories.length === 0 || images.length === 0) {
        const er =
          "Veuillez sélectionner au moins une catégorie et ajouter une image";
        setFormError(er);
        toast.error(er); // Display the error immediately
      } else {
        setFormError("");
        setStep((prev) => Math.min(prev + 1, 3));
      }
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleImageChange = (e) => {
    setImages([...images, ...e.target.files]);
  };


 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/allCountries.json");
        const data = await response.json();
        console.log("All countries json data: ", data);
        setCountries(data);
      } catch (error) {
        console.error("Error loading countries data:", error);
      }

      
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      const newSelectedCategories = prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((item) => item !== category)
        : [...prevSelectedCategories, category];
      return newSelectedCategories;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (step === 3) {
      if (!selectedCountry || !propertyType || !address) {
        if (propertyType !== "Hotel" && propertyType !== "Site Touristique") {
          if (!selectedCountry || !propertyType) {
            const er = "Veuillez sélectionner le type de propriéte et le pays";
            setFormError(er);
            toast.error(er); // Display the error immediately
          }
        } else {
          if (!selectedCountry) {
            const er = "Veuillez sélectionner le pays";
            setFormError(er);
            toast.error(er); // Display the error immediately
          }
        }

        if (!address) {
          const er = "Veuillez fournir l'adresse";
          setFormError(er);
          toast.error(er); // Display the error immediately
        }

        if (choiceType === "oui") {
          if (!price || !currencyType) {
            const er = "Veuillez ajouter le prix et la monaie";
            setFormError(er);
            toast.error(er); // Display the error immediately
          }
        }

        if (propertyType !== "Hotel" && propertyType !== "Site Touristique") {
          if (!decisionType) {
            const er = "Sélectionner si c'est à vendre ou à louer ";
            setFormError(er);
            toast.error(er); // Display the error immediately
          }
        }
      } else {
        setFormError("");
        setStep((prev) => Math.min(prev + 1, 3));

        setIsLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);

        // Convert price string to a number and format to match DecimalField
        // Convert price string to a number and format to match DecimalField
        if (propertyType !== "Site Touristique" && price) {
          const formattedPrice = parseFloat(price).toFixed(2);
          formData.append("price", formattedPrice);
        }

        if (!price) {
          const formattedPrice = parseFloat("0").toFixed(2);
          formData.append("price", formattedPrice);
        }

        if (!phoneNumber) {
          formData.append("new_phone_number", "");
        } else {
          formData.append("new_phone_number", phoneNumber);
        }


        // First, upload all images to Cloudinary
            const uploadedImageUrls = [];
            const uploadedImageIds = []; // Store Cloudinary public_ids

            for (let i = 0; i < images.length; i++) {
              const formDataImage = new FormData();
              formDataImage.append('file', images[i]);
              formDataImage.append('upload_preset', 'espaslink_unsigned');

              const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dgytff1az/image/upload`,
                formDataImage
              );
              uploadedImageIds.push(response.data.public_id); // Save public_id
              uploadedImageUrls.push(response.data.secure_url); // get the image URL from Cloudinary
            }


        formData.append("type", propertyType);
        formData.append("country", selectedCountry);
        formData.append("city", selectedCity);
        formData.append("address", address);
        formData.append("state", selectedState);
        formData.append( "currency", currencyType);
        formData.append("status", statusType);
        formData.append("decision", decisionType);
        formData.append("user", userId);

        // Now attach the Cloudinary URLs
          uploadedImageUrls.forEach((url, index) => {
            formData.append('uploaded_images', url); 
          });

     
       
        console.log("FormData contents:");
        formData.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });


    
      
        try {
          const response = await axios.post(
            `${api_url}/create_property_user/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
              },
            }
          );
          setIsModalOpen(false); // Close the modal after successful submission
          toast.success("Property created successfully");
          console.log("Property saved : ", response.data);
          localStorage.setItem("propertyId", response.data.id);
          localStorage.setItem("total", response.data.total_properties);
        

          router.push("/my_list");
        } catch (error) {
          console.log("error: ", error);
          deleteUploadedImages(uploadedImageIds);

          toast.error(error?.response?.data?.detail)

          const redirect = error?.response?.data?.redirect

          if(redirect) {
            router.push(`/${redirect}`)
          }

         
          
          
          const phone_err = error?.response?.data?.new_phone_number?.[0];
        
          if (phone_err) {
            toast.error(phone_err);
          }
        } finally {
          setIsLoading(false);
        }

        // session end
      }
    }
  };

  const handleCountryChange = (name: string) => {
    setSelectedCountry(name);

    // Find the selected country's states and set them in the state
    const country = countries.find((country) => country.name === name);
    setStates(country ? country.states : []);
    setSelectedState(""); // Reset the state when a new country is selected
  };

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);

    // Find the selected state's cities and set them in the state
    const state = states.find((state) => state.name === stateName);
    setCities(state ? state.cities || [] : []); // Default to empty array if cities are undefined
    setSelectedCity(""); // Reset selected city when state changes
  };

  // if(loading) {
  //   return (

  //     <div className="flex justify-center items-center mt-52">
  //     <div className="text-center">

  //         <div className="flex items-center">
  //           <FaSpinner className="animate-spin text-3xl mr-2 text-sky-500" /> {/* Icon with spin animation */}
  //           <span className="text-xl font-bold">Vérification...</span>
  //         </div>

  //     </div>
  //   </div>

  //   )
  // }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      

      <div
        className={`flex-1 p-10 text-gray-700 overflow-y-auto z-60 ${
          isSidebarOpen ? "" : "w-full"
        } md:ml-64`}
      >
              <button
                className="fixed top-20 left-2 mt-1 z-50 flex items-center space-x-2 rounded-lg   text-white transition-color md:hidden"
                onClick={toggleSidebar}
              >
                {/* <CiMenuKebab /> */}
                <CiMenuKebab className='text-2xl'  />
              </button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
  <div className="group relative mt-6 cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400/30 via-transparent to-purple-400/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
    
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-blue-900/60 to-blue-800/40 backdrop-blur-xl p-6 shadow-2xl shadow-blue-900/30">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl"></div>
    
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 p-2">
            <MdAdd className="text-2xl text-white" />
          </div>
          <h3 className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-xl font-bold text-transparent">
          Nouvelle propriété
          </h3>
        </div>
        
        <p className="mb-2 text-sm text-gray-300">Commencez votre annonce </p>
        <p className="text-xs text-gray-400">
        Soyez découvert par des acheteurs potentiels <br />
          Mettez en valeur les meilleurs atouts de votre propriété
        </p>
      </div>

      {/* Animated shine effect */}
      <div className="absolute inset-0 -left-[100%] w-[200%] -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </div>
  </div>
</DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
                Complete the steps to add a new property.
              </DialogDescription>
            </DialogHeader>

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
                <div className="space-y-6">
                  {/* Images Field */}
                  {/* <div className="mb-4">
                    <label
                      htmlFor="image"
                      className="block text-sm font-semibold mb-2"
                    >
                      Upload Images
                    </label>
                    <Input
                      id="image"
                      type="file"
                      className="w-full"
                      multiple
                      onChange={handleImageChange}
                    />
                  </div> */}

                  <div className="group relative cursor-pointer">
                    <input
                      type="file"
                      name="resume"
                      id="resume"
                      onChange={handleImageChange}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      multiple
                      // accept=".pdf,.doc,.docx"
                    />
                    <div className="flex items-center justify-center space-x-3 rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500">
                      <svg
                        className="h-8 w-8 text-indigo-500 transition-colors duration-200 group-hover:text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 transition-colors duration-200 group-hover:text-indigo-600">
                          <span className="underline decoration-indigo-500 decoration-2 underline-offset-2">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Uload house pictures here
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
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
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-4 py-4">
                <div className="max-h-96 overflow-y-auto p-4">
                  {/* Property Type Select */}
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-semibold mb-2"
                    >
                      Type
                    </label>
                    <Select
                      id="type"
                      value={propertyType}
                      onValueChange={(value) => setPropertyType(value)}
                      className="w-full"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maison">Maison</SelectItem>
                        <SelectItem value="Appartement">Appartement</SelectItem>
                        <SelectItem value="Building">Building</SelectItem>
                        <SelectItem value="Espace Publicitaire">
                          Espace Publicitaire
                        </SelectItem>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Terrain">Terrain</SelectItem>
                        <SelectItem value="Site Touristique">
                          Site Touristique
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Decision Field */}
                  {propertyType !== "Hotel" &&
                    propertyType !== "" &&
                    propertyType !== "Site Touristique" && (
                      <div className="mt-2">
                        <label
                          htmlFor="decision"
                          className="block text-sm font-semibold"
                        >
                          Votre décision
                        </label>
                        <Select
                          id="decision"
                          value={decisionType}
                          onValueChange={(value) => setDecisionType(value)}
                          className="w-full"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="À vendre ou à louer ?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="à vendre">À vendre</SelectItem>
                            <SelectItem value="à louer">À louer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                  {propertyType !== "Site Touristique" && (
                    <div className="mt-2">
                      <label
                        htmlFor="decision"
                        className="block text-sm font-semibold"
                      >
                        Voulez-vous ajouter le prix?
                      </label>
                      <Select
                        id="decision"
                        value={choiceType}
                        onValueChange={(value) => setChoiceType(value)}
                        className="w-full"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Voulez-vous ajouter le prix ?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oui">Oui</SelectItem>
                          <SelectItem value="non">Non</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {propertyType === "Hotel" && choiceType === "oui" && (
                    <>
                      <div className="mt-3">
                        <label
                          htmlFor="price"
                          className="block text-sm font-semibold mb-2"
                        >
                          Prix par nuit
                        </label>
                        <Input
                          id="price"
                          type="text"
                          className="w-full"
                          placeholder="Price"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                        />
                      </div>

                      <div className="mt-3">
                        <Select
                          id="currency"
                          value={currencyType}
                          onValueChange={(value) => setCurrencytype(value)}
                          className="w-full mt-4"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choisir la monnaie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HTG">HTG</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {propertyType !== "Hotel" &&
                    propertyType !== "" &&
                    propertyType !== "Site Touristique" &&
                    choiceType === "oui" && (
                      <>
                        <div className="mt-3">
                          <label
                            htmlFor="price"
                            className="block text-sm font-semibold mb-2"
                          >
                            Prix
                          </label>
                          <Input
                            id="price"
                            type="text"
                            className="w-full"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                          />
                        </div>

                        <div className="mt-3">
                          <Select
                            id="currency"
                            value={currencyType}
                            onValueChange={(value) => setCurrencytype(value)}
                            className="w-full mt-4"
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choisir la monnaie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HTG">HTG</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                  {/* Country Field */}
                  <div className="mt-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-semibold mb-2"
                    >
                      Country
                    </label>
                    <Select
                      value={selectedCountry}
                      onValueChange={handleCountryChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir le pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* State Field */}
                  <div>
                    {states.length > 0 && (
                      <Select
                        value={selectedState}
                        onValueChange={handleStateChange}
                      >
                        <SelectTrigger className="w-full mt-4">
                          <SelectValue placeholder="Choisir le departement" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.id} value={state.name}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* City Field */}
                  <div>
                    {cities.length > 0 && (
                      <Select
                        value={selectedCity}
                        onValueChange={setSelectedCity}
                      >
                        <SelectTrigger className="w-full mt-4">
                          <SelectValue placeholder="Choisir la ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Status Field */}
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-semibold mt-3"
                    >
                      Statut
                    </label>
                    <Select
                      id="status"
                      value={statusType}
                      onValueChange={(value) => setStatusType(value)}
                      className="w-full"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="close">Close</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address Field */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-semibold mt-3"
                    >
                      Addresse
                    </label>
                    <Input
                      id="address"
                      type="text"
                      className="w-full"
                      placeholder="Ex: Rue EspasLink #1"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold mt-3"
                    >
                      Associer un numéro de téléphone à cette publication
                    </label>
                    <Input
                      id="phone"
                      type="text"
                      className="w-full"
                      placeholder="Ex:+50942424242"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
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
                  className={`bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${
                    isLoading && "cursor-not-allowed"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-6 w-6 mx-1" />
                  ) : (
                    "Add Property"
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
