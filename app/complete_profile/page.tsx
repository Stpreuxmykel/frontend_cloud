"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { RiMenuFold3Fill } from "react-icons/ri";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getToken, verifyInterest, verifyProfile } from "../lib/auth";
import { toast } from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { fetchCountries } from "../actions/FetchCountry";
import { BiLoader } from "react-icons/bi";
import { deleteUploadedSingleImage, getAllCountries, getId } from "../api/action";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [googleToken, setGoogleToken] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  // const [country, setCountry] = useState('');
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]); // To store states for the selected country
  const [selectedState, setSelectedState] = useState(""); // To store the selected state
  const [cities, setCities] = useState([]); // To store cities for the selected state
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const token = getToken();
  const router = useRouter();
  const [formError, setFormError] = useState("");

  const userId = getId();

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const interest = verifyInterest();
  const profile = verifyProfile();

  console.log("interest state: ", interest);
  console.log("profile state: ", profile);

  if (interest == "true" && profile == "true" && interest != null) {
    router.push("/dashboard");
  }

  if (profile == "true" && interest == "false") {
    router.push("/user_interest");
  }

 

  useEffect(() => {
    setLoading(true);
    const loadCountries = async () => {
      try {
        const data = await getAllCountries();
        console.log("All countries json data: ", data);
        setCountries(data);
      } catch (error) {
        console.error("Error loading countries data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let hasError = false;

    if (!selectedCountry) {
      const er = "Sélectionner votre Pays";
      setFormError(er);
      toast.error(er);
      hasError = true;
    }

    if (!address) {
      const er = "Ajouter votre adresse";
      setFormError(er);
      toast.error(er);
      hasError = true;
    }

    if (token) {
      if (!firstname || !lastname) {
        const er = "Le nom et le prénom ne doivent pas rester vide.";
        setFormError(er);
        toast.error(er);
        hasError = true;
      }
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    setFormError(""); // Réinitialiser les erreurs si tout est correct

    // Si l'utilisateur n'est pas connecté (session inactive)

    // Upload the profile picture to Cloudinary first
    let uploadedImageUrl = ""; // It should be a single URL, not an array
    let uploadedPublicId = ""
    try {
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("country", selectedCountry);
      formData.append("city", selectedCity);
      formData.append("state", selectedState);
      formData.append("address", address);
      formData.append("user", userId);


      if (!phoneNumber) {
        formData.append("phone_number", "");
      } else {
        formData.append("phone_number", phoneNumber);
      }

      if (profilePicture) {
        const formDataImage = new FormData();
        formDataImage.append('file', profilePicture);
        formDataImage.append('upload_preset', 'espaslink_unsigned'); // move this BEFORE upload!

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/dgytff1az/image/upload`,
          formDataImage
        );

        uploadedImageUrl = cloudinaryResponse.data.secure_url; // Get uploaded image URL
        uploadedPublicId = cloudinaryResponse.data.public_id;

        formData.append("profile_picture", uploadedImageUrl); // Attach Cloudinary URL to form
      }

      const response = await axios.post(
        `${api_url}/create_user_profile/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log("profile created: ", response.data);

      if (typeof window !== "undefined") {
        localStorage.setItem("regular_info", JSON.stringify(response.data));
        localStorage.setItem("profile_info", JSON.stringify(response.data));
        localStorage.setItem("user_profile", "true");
      }

      toast.success("Profile saved successfully");
      router.push("/dashboard");
    } catch (error) {
      // 🌪️ If uploading succeeded but profile creation failed, delete the image!
      if (uploadedPublicId) {
        try {
          await deleteUploadedSingleImage(uploadedPublicId);
          console.log("Uploaded image deleted because profile creation failed.");
        } catch (deleteError) {
          console.error("Failed to delete uploaded image:", deleteError);
        }
      }
      console.error("Error saving profile:", error);
      console.error("Verifying :", error.code);
      const phone_err = error.response.data.phone_number[0];
      if (phone_err) {
        toast.error(phone_err);
      }
    } finally {
      setIsLoading(false);
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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center">
          {/* Pulsing dot animation */}
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse mb-2"></div>
          {/* Optional text */}
          <span className="text-gray-600">Vérification...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div
        className={`fixed inset-y-0 left-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-10 text-gray-700 overflow-y-auto ${isSidebarOpen ? "" : "w-full"
          } md:ml-64`}
      >
        <div
          className="md:hidden flex items-center space-x-2 p-2 mb-4 w-10 text-blue-800 border border-blue-800 rounded-md cursor-pointer hover:bg-blue-800 hover:text-white transition-colors duration-300"
          onClick={toggleSidebar}
        >
          <RiMenuFold3Fill className="text-xl" />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-blue-800  ">
            Compléter votre profile
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Conditional Rendering Based on Session */}
            {userId ? (
              <>
                <div className="md:grid grid-cols-2 gap-2">
                  <div className="mb-4">
                    <label
                      htmlFor="nom"
                      className="block text-sm font-semibold mb-2"
                    >
                      Votre nom
                    </label>
                    <Input
                      id="nom"
                      className="w-full"
                      placeholder="Pierre"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="prenom"
                      className="block text-sm font-semibold mb-2"
                    >
                      Votre prénom
                    </label>
                    <Input
                      id="prenom"
                      type="text"
                      className="w-full"
                      placeholder="Lee"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="country"
                      className="block text-sm font-semibold mb-2"
                    >
                      Choisir le pays
                    </label>
                    {/* Country Select */}
                    <Select
                      value={selectedCountry}
                      onValueChange={handleCountryChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Country" />
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

                  <div className="mt-7">
                    {states.length > 0 && (
                      <Select
                        value={selectedState}
                        onValueChange={handleStateChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select State" />
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

                  <div className="mt-7">
                    {/* City Select */}
                    {cities.length > 0 && (
                      <Select
                        value={selectedCity}
                        onValueChange={setSelectedCity}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select City" />
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

                  <div className="mb-4">
                    <label
                      htmlFor="adresse"
                      className="block text-sm font-semibold mb-2"
                    >
                      Votre adresse
                    </label>
                    <Input
                      id="adresse"
                      type="text"
                      className="w-full"
                      placeholder="123 Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-semibold mb-2"
                    >
                      Ajouter une photo
                    </label>
                    <Input
                      id="photo"
                      type="file"
                      className="w-full"
                      onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-semibold mb-2"
                    >
                      Ajouter votre numero de telephone
                    </label>
                    <Input
                      id="phone"
                      type="text"
                      className="w-full"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            <button
              type="submit"
              className={`w-full py-3 text-white rounded-lg transition-colors flex items-center justify-center ${isLoading
                  ? "bg-neutral-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900   hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30 transition-all"
                }`}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-6 w-6 mx-1" /> Inscription
                  en cours
                </>
              ) : (
                "Sauvegarder"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
