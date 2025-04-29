"use client";
import { useState, useEffect } from "react";

import { RiMenuFold3Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";

import axios from "axios";
import { Console } from "console";
import { getToken } from "@/app/lib/auth";
import { useSession } from "next-auth/react";
import Sidebar from "@/app/component/Sidebar";

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
import { getAllCountries, getUserProfile } from "@/app/api/action";

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
  const [tokenId, setTokenId] = useState("")
  const [image, setImage] = useState<File | null>(null);

  const [realTimeimage, setRealTimeImage] = useState<File | null>(null);
  const [countries, setCountries] = useState<any[]>([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]); // To store states for the selected country
  const [selectedState, setSelectedState] = useState(''); // To store the selected state
  const [cities, setCities] = useState([]); // To store cities for the selected state
  const [selectedCity, setSelectedCity] = useState('');
  const [fullName, setFullName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [nameId, setNameId] = useState('');
  const [googleMore, setGoogleMore]= useState([]);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [UpdatedImage, setUpdatedImage] = useState("")

  const defaultImage = '/images/np.webp'

  const [mediaPath, setMediaPath] =useState("");

  const api_url= process.env.NEXT_PUBLIC_BACKEND_API_URL
  const router = useRouter();




  const token = getToken();
  const { data: session } = useSession();


 
  console.log("The actual user profile: ", userData.profile_picture);
  console.log('updatedData real time is is: ', realTimeimage);

  console.log("actual user id is for google: ", userData.user)


  const fullUrl = realTimeimage


  console.log("the media path from realtime image  is ", mediaPath);  // Output: "media/profile_pictures/Screenshot_2023-08-24_140139.png"



  useEffect(()=>{

    if(userData.profile_picture){
      const fullUrl = realTimeimage
      const new_mediaPath = fullUrl?.replace("https://pierresheulder.com/espaslink-api/", "/");
      setMediaPath(new_mediaPath)
      setUpdatedImage(userData.imageUrl)

    }else {
      setUpdatedImage(defaultImage)
    }

  },[realTimeimage,userData.profile_picture, userData.imageUrl ])



    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true)
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


      useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true)
          try {
            const dataProfile = await getUserProfile();

            setUserData(dataProfile);
            setFirstname(dataProfile.firstname);
            setLastName(dataProfile.lastname);
            setCountry(dataProfile.country);
            setAddress(dataProfile.address);
            setCity(dataProfile.city);
            setState(dataProfile.state);
            setImage(dataProfile.profile_image);
            setPhoneNumber(dataProfile.phone_number);

            // Set the selected values for country, state, and city

            setSelectedState(dataProfile.state);
            setSelectedCity(dataProfile.city);
           
          } catch (error) {
            console.error("Error fetching properties:", error);
          } finally {
            setIsLoading(true)
          }
        };
        fetchData();
      }, []);
    

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);  // Store the file object in state
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

    if(session) {
      if (!fullName) {
        const er = "Le nom  ne doit pas rester vide.";
        setFormError(er);
        toast.error(er);
        hasError = true;
      }
    
    }

    if(token) {
      if(!firstname || !lastname) {

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

    if(!phoneNumber) {
      formData.append("phone_number", '')
    }else {
      formData.append("phone_number", phoneNumber)
    }
   
    if (session) {
      formData.append("token_id", tokenId)
      if(!selectedCountry) {
        formData.append("country", country);
      }else{
        formData.append("country", selectedCountry);
      }
    }

    if (token) {
      if(!selectedCountry) {
        formData.append("country", country);
      }else{
        formData.append("country", selectedCountry);
      }
    }



    if (image) {
      formData.append("profile_picture", image);

    }

    try {
      const url = `${api_url}/create_user_profile/${userData?.id}/`
       
      const response = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("The update data : ",response.data )

      if(session) {
        localStorage.setItem('google_info', JSON.stringify(response.data));
      }

      if(token) {
        localStorage.setItem('regular_info', JSON.stringify(response.data));
      }
     

      if (session) {
        const NewData = new FormData();
        NewData.append("name", fullName);
        NewData.append("token_id", tokenId);
        NewData.append("email", googleEmail);
        const my_url = `${api_url}/update_google_name/${nameId}/`
        const reponse_new = await axios.put(my_url, NewData, {
          headers: {
            "Content-Type": "application/json",
           
          },
        })
        setGoogleMore(reponse_new.data.name)

        console.log("new data updated : ", reponse_new.data.name)

        localStorage.setItem('gName', JSON.stringify(reponse_new.data.name));
        
       


      
      }




      toast.success("Profile updated!");
      setIsModalOpen(false);



      // Update the userData state to reflect the new changes on the page
      const updatedData = response.data;

      setRealTimeImage(updatedData.profile_picture)

      setUserData({
        ...userData,
        firstname: updatedData.firstname,
        lastname: updatedData.lastname,
        country: updatedData.country,
        city: updatedData.city,
        address: updatedData.address,
        state: updatedData.state,
        profile_picture: updatedData.profile_picture,
        imageUrl :updatedData.imageUrl,
        phone_number: updatedData.phone_number,

    

      


      });

    
      


    } catch (error) {
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
    setSelectedState(''); // Reset the state when a new country is selected
  };


  const handleStateChange = (stateName) => {
    setSelectedState(stateName);

    // Find the selected state's cities and set them in the state
    const state = states.find((state) => state.name === stateName);
    setCities(state ? state.cities || [] : []); // Default to empty array if cities are undefined
    setSelectedCity(''); // Reset selected city when state changes
  };


  useEffect(() => {
    setIsMounted(true);
  }, []);






  const baseUrl =api_url;

  if (!isMounted) return null;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 md:block">
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
                <CardContent className={`space-y-2 ${isLoading ? 'animate-pulse' : ''}`}>
                  {isLoading ? (
                    <div className="space-y-1">
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      {token ? (
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
                      ) : (
                        <div className="space-y-1">
                        <Label htmlFor="full name">Nom complet</Label>
                        {isLoading ? (
                          <div className="h-8 bg-slate-200 rounded w-full animate-pulse"></div>
                        ) : (
                          <Input disabled value={fullName || googleMore} />
                        )}
                      </div>
                      
                      )}
                    </>
                  )}
                </CardContent>


              </Card>
            </TabsContent>
            <TabsContent value="password">
            <Card className={`${isLoading ? 'animate-pulse' : ''}`}>
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
          src={userData.profile_picture ? userData.imageUrl : UpdatedImage}
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
          <Input id="current" disabled value={userData.phone_number} />
        </div>
      </>
    )}
  </CardContent>
  <CardFooter></CardFooter>
</Card>

            </TabsContent>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                
                <Button disabled={isLoading} variant="outline" className="mt-5">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">


                  {token ?
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
                    :
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Votre nom
                      </Label>
                      <Input
                        className="col-span-3"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>


                  }





                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">
                      Pays
                    </Label>
                    <div className="col-span-3 w-full">
                      <Select value={selectedCountry} onValueChange={handleCountryChange}>
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
                        <Select value={selectedState} onValueChange={handleStateChange}>
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
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
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
                  <Button onClick={handleSubmit}>Update Profile</Button>
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
