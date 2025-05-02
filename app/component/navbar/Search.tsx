"use client";

import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import PropertyCard from "../PropertyCard";

const Search = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
  const [countries, setCountries] = useState<any[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]); // To store states for the selected country
  const [selectedState, setSelectedState] = useState(""); // To store the selected state
  const [cities, setCities] = useState([]); // To store cities for the selected state
  const [selectedCity, setSelectedCity] = useState("");
  const [propertyType, setPropertyType] = useState<string>("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchProperties, setSearchProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const router = useRouter();

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL


  console.log("searchProperties : ",searchProperties)



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


  const handleSearch = async (e) => {
    e.preventDefault();
  
    setLoading(true);
    try {
      const response = await axios.get(
        `${api_url}/create_property_user/?state=${selectedState}&country=${selectedCountry}&city=${selectedCity}&type=${propertyType}`
      );
    
      console.log("property search data : ", response.data);
    
      // 🧽 Remove duplicates based on 'id'
      const uniqueProperties = response.data.reduce((acc, current) => {
        const isDuplicate = acc.some(item => item.id === current.id);
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
    
      setSearchProperties(uniqueProperties); // Use the filtered version
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(true);
      setIsOpen(false);
    }
    
  };
  

  // Function to open the modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsOpen(false);
    setIsModalOpen(false);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
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

  if (!isMounted) return null;
  if(loading) return null;
  return (
    <div>
      <div
        onClick={openModal} // Open modal on click
        className="
          border-[1px]
          w-full
          md:w-auto
          py-2
          rounded-full
          shadow-sm
          text-neutral-800
          hover:shadow-md
          transition
          cursor-pointer
        "
      >
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-semibold px-6 flex">EspasLink</div>

          <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
            Tous les jours
          </div>

          <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
            <div className="hidden sm:block">Un seul endroit</div>

            <div className="p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full text-white">
              <BiSearch size={18} />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sélectionnez Vos Propriétés Idéales </DialogTitle>
            <DialogDescription>
              Découvrir les propriétés qui correspondent parfaitement à vos
              besoins.
            </DialogDescription>
          </DialogHeader>

            <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 items-center gap-4">
        {/* Country Field */}
        <div>
          <label htmlFor="country" className="block text-sm font-semibold mb-2">
            Pays
          </label>
          <input
            type="text"
            placeholder="Tapez le pays"
            className="w-full px-3 py-2 border rounded-md mb-2"
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
          />
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
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
            <>
              <input
                type="text"
                placeholder="Tapez le département"
                className="w-full px-3 py-2 border rounded-md mt-4 mb-2"
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
              />
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="w-full">
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
            </>
          )}
        </div>

        {/* City Field */}
        <div>
          {cities.length > 0 && (
            <>
              <input
                type="text"
                placeholder="Tapez la ville"
                className="w-full px-3 py-2 border rounded-md mt-4 mb-2"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full">
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
            </>
          )}
        </div>

        {/* Property Type Field */}
        <div>
          <label htmlFor="type" className="block text-sm font-semibold mb-2">
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
              <SelectItem value="Site Touristique">Site Touristique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
       
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Annuler
            </Button>{" "}
            {/* Button to close modal */}
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  text-white"
            >
              Rechercher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

     

      {/* Drawer Component */}
{/* <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
  <DrawerContent className="overflow-y-auto" style={{ height: '85vh' }}>
    <DrawerHeader>
      <DrawerTitle>Voici les résultats de votre recherche...</DrawerTitle>
      <DrawerDescription />
      <DrawerClose>
        <Button variant="outline" onClick={closeDrawer}>
          Cliquer ici pour fermer
        </Button>
      </DrawerClose>
    </DrawerHeader>
    
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.isArray(searchProperties.user_properties
) && searchProperties.user_properties
.length > 0 ? (
          searchProperties.user_properties
.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p>No properties available.</p>
        )}
      </div>
    </div>
  </DrawerContent>
</Drawer> */}

{isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white w-full h-screen p-6 overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Voici les résultats de votre recherche...
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                <IoIosCloseCircleOutline className="text-rose-500" size={26}/>
              </button>
            </div>

            {/* Modal Content */}
            {/* onClick={closeModal} */}
            <div className="container mx-auto p-4" >
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> */}
               
                {Array.isArray(searchProperties
          ) && searchProperties.length > 0 ? (
                 <PropertyCard properties={searchProperties}/>
                ) : (
                  <p>No properties available.</p>
                )}


                {/* {searchProperties.length > 0 ? (
                  searchProperties.map((property, index) => (
                    <PropertyCard key={property.id || index} property={property} />
                  ))
                ) : (
                  <p>Aucune propriété trouvée.</p>
                )} */}


              {/* </div> */}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Search;
