"use client";
import { useState, useEffect } from "react";

import { RiMenuFold3Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";

import axios from "axios";
import { Console } from "console";
import { getToken } from "@/app/lib/auth";
import { useSession } from "next-auth/react";
import Sidebar from "@/app/component/Sidebar";
import { CiMenuKebab } from "react-icons/ci";
import useSWR, { mutate } from 'swr'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image } from "lucide-react";
import ImageData from "@/app/component/ImageData";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteUploadedSingleImage, getAllCountries, getUserProfile } from "@/app/api/action";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [googleData, setGoogleData] = useState("");
  const [userData, setUserData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [realTimeimage, setRealTimeImage] = useState<File | null>(null);
  const [countries, setCountries] = useState<any[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]); // To store states for the selected country
  const [selectedState, setSelectedState] = useState(""); // To store the selected state
  const [cities, setCities] = useState([]); // To store cities for the selected state
  const [selectedCity, setSelectedCity] = useState("");
  const [fullName, setFullName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [nameId, setNameId] = useState("");
  const [googleMore, setGoogleMore] = useState([]);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [UpdatedImage, setUpdatedImage] = useState("");

  const defaultImage = "/images/np.webp";

  const [mediaPath, setMediaPath] = useState("");
  const [verification, setVerification] = useState(false)

  const [theOldPicture, setTheOldPicture] = useState(null)



  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const router = useRouter();

  const token = getToken();
  const { data: session } = useSession();

  useEffect(() => {
    if (!token) {
      setVerification(true)
      router.push("/login")
    }

  }, [router, token])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const countryData = await getAllCountries();
        setCountries(countryData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const filenameWithExtension = parts[parts.length - 1]; // zminatno3gjj4jwho6pv.png
    const publicId = filenameWithExtension.split('.')[0];  // remove .png
    return publicId;
  }

  const fetchData = async () => {
    try {
      const dataProfile = await getUserProfile();

      console.log("dataProfile information : ", dataProfile);

      setTheOldPicture(dataProfile.profile_picture)

      setUserData(dataProfile);
      setFirstname(dataProfile.firstname);
      setLastName(dataProfile.lastname);
      setCountry(dataProfile.country);
      setAddress(dataProfile.address);
      setCity(dataProfile.city);
      setState(dataProfile.state);
      setImage(dataProfile.profile_picture);
      setPhoneNumber(dataProfile.phone_number);

      // Set the selected values for country, state, and city

      setSelectedState(dataProfile.state);
      setSelectedCity(dataProfile.city);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Store the file object in state
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!address) {
      const er = "Ajouter votre adresse";
      setFormError(er);
      toast.error(er);
      hasError = true;
    }


    if (token) {
      if (!firstname || !lastname) {
        const er = "Le nom  et le prénom ne doivent pas rester vide.";
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
    setIsLoading(true);

    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);

    formData.append("city", selectedCity);
    formData.append("state", selectedState);
    formData.append("address", address);

    if (!phoneNumber) {
      formData.append("phone_number", "");
    } else {
      formData.append("phone_number", phoneNumber);
    }

    if (!selectedCountry) {
      formData.append("country", country);
    } else {
      formData.append("country", selectedCountry);
    }


    // Upload the profile picture to Cloudinary first
    let uploadedImageUrl = ""; // It should be a single URL, not an array
    let uploadedPublicId = ""


    if (image) {
      const formDataImage = new FormData();
      formDataImage.append('file', image);
      formDataImage.append('upload_preset', 'espaslink_unsigned'); // move this BEFORE upload!

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dgytff1az/image/upload`,
        formDataImage
      );

      uploadedImageUrl = cloudinaryResponse.data.secure_url; // Get uploaded image URL
      uploadedPublicId = cloudinaryResponse.data.public_id;

      formData.append("profile_picture", uploadedImageUrl); // Attach Cloudinary URL to form
    }

    const userId = localStorage.getItem("userId");
    try {
      const url = `${api_url}/create_user_profile/${userId}/`;

      const response = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      toast.success("Profile updated!");
      if (theOldPicture) {
        const oldPublicId = getPublicIdFromUrl(theOldPicture);
        await deleteUploadedSingleImage(oldPublicId);
        console.log("Old picture deleted")
      }
      mutate(url)
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      if (uploadedPublicId) {
        try {
          await deleteUploadedSingleImage(uploadedPublicId);
          console.log("Uploaded image deleted because profile creation failed.");
        } catch (deleteError) {
          console.error("Failed to delete uploaded image:", deleteError);
        }
      }
      if (error.response && error.response.status === 404) {
        toast.error("Profile not found.");
      } else {
        console.error("Error updating profile data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const baseUrl = api_url;

  if (!isMounted) return null;

  if (verification) {
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
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 p-10 text-gray-700 overflow-y-auto z-60 ${isSidebarOpen ? "" : "w-full"
          } md:ml-64`}
      >
        <button
          className="fixed top-20 left-2 mt-1  z-50 flex items-center space-x-2 rounded-lg   text-white transition-color md:hidden"
          onClick={toggleSidebar}
        >
          {/* <CiMenuKebab /> */}
          <CiMenuKebab className="text-2xl" />
        </button>

        <div className="flex justify-center items-center">
          <Tabs defaultValue="account" className="w-[800px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Compte</TabsTrigger>
              <TabsTrigger value="password">Voir plus</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Votre profile</CardTitle>
                  <CardDescription>Vos informations</CardDescription>
                </CardHeader>
                <CardContent
                  className={`space-y-2 ${isLoading ? "animate-pulse" : ""}`}
                >
                  {isLoading ? (
                    <div className="space-y-1">
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <>
                        <div className="space-y-1">
                          <Label htmlFor="name">Prenom</Label>
                          <Input disabled value={userData.firstname} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="username">Nom</Label>
                          <Input disabled value={userData.lastname} />
                        </div>
                      </>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card className={`${isLoading ? "animate-pulse" : ""}`}>
                <CardHeader>
                  <CardTitle>Profile picture</CardTitle>
                  <CardDescription>
                    {isLoading ? (
                      <div className="w-20 h-20 bg-slate-200 rounded-full"></div>
                    ) : (
                      // <ImageData
                      //   src={mediaPath ? UpdatedImage : `${baseUrl}${userData.profile_picture}`}
                      //   alt={`${userData.firstname}'s profile`}
                      //   className="w-20 h-20 rounded-full object-cover mr-4"
                      // />

                      <ImageData
                        src={
                          userData.profile_picture
                            ? userData.imageUrl
                            : UpdatedImage
                        }
                        alt={`${userData.firstname}'s profile`}
                        className="w-20 h-20 rounded-full object-cover mr-4"
                      />
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isLoading ? (
                    <>
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="current">Pays</Label>
                        <Input id="current" disabled value={userData.country} />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="current">Ville</Label>
                        <Input id="current" disabled value={userData.city} />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="current">Addresse</Label>
                        <Input id="current" disabled value={userData.address} />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="current">Departement</Label>
                        <Input id="current" disabled value={userData.state} />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="current">Telephone</Label>
                        <Input
                          id="current"
                          disabled
                          value={userData.phone_number}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={isLoading}
                  className="mt-6 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900   hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        className="col-span-3"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Lastname
                      </Label>
                      <Input
                        className="col-span-3"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">
                      Pays
                    </Label>
                    <div className="col-span-3 w-full">
                      <Select
                        value={selectedCountry}
                        onValueChange={handleCountryChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un nouveau pays" />
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
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="state" className="text-right">
                      Departement
                    </Label>
                    <div className="col-span-3 w-full">
                      {states.length > 0 && (
                        <Select
                          value={selectedState}
                          onValueChange={handleStateChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un nouveau departement" />
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
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="city" className="text-right">
                      Ville
                    </Label>
                    <div className="col-span-3 w-full">
                      {cities.length > 0 && (
                        <Select
                          value={selectedCity}
                          onValueChange={setSelectedCity}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une nouvelle ville" />
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
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      className="col-span-3"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Telephone
                    </Label>
                    <Input
                      className="col-span-3"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">
                      Image
                    </Label>
                    <Input
                      type="file"
                      className="col-span-3"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className="mt-6 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900   hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30 transition-all"
                  >
                    Update Profile
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
