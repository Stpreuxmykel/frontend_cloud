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
import { getPropertyUser, getToken } from "@/app/lib/auth";
import { toast } from "react-hot-toast";
import { VscRobot } from "react-icons/vsc";
import { deleteUploadedImages, getId, getPropertyDetails } from "@/app/api/action";

export default function AddPropertyModal({
  params,
}: {
  params: { id: string };
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  const [deleteData, setDeleteData] = useState<any>({});
  const [propertyType, setPropertyType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  const token = getToken();


  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted ] = useState(false)
  const [imageList, setImageList] = useState([])

  console.log("Image list data : ", imageList)

  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const userId = getId();
  const pUserId = getPropertyUser();
  
    const id1 = Number(userId)
    const id2 = Number(pUserId)


    useEffect(()=> {
      if(!token) {
        router.push("/login")
       }
    
    }, [router, token])
      

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

 
    
  const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const filenameWithExtension = parts[parts.length - 1]; // zminatno3gjj4jwho6pv.png
    const publicId = filenameWithExtension.split('.')[0];  // remove .png
    return publicId;
  }

  useEffect(()=> {
    const fetchPropertyDetails = async()=> {
      const result = await getPropertyDetails()
      console.log("here is the resut of this property : ", result.images)
      setImageList(result.images)
    }
    fetchPropertyDetails()
  }, [])


  const handleDelete = async () => {
    const propertyId = localStorage.getItem("propertyId");
    setIsLoading(true);

    try {
      const response = await axios.delete(
        `${api_url}/create_property_user/${propertyId}/`
      );

      toast.success("Property deleted successfully");
       // 🧨🔥 Now delete the images from Cloudinary
    const publicIds = imageList.map((img) => getPublicIdFromUrl(img.image));
    await deleteUploadedImages(publicIds);
      router.push("/my_list"); // Redirect to the properties list page after deletion
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Property not found.");
        router.push("/"); // Redirect to the 404 error page or any page you choose
      } else {
        console.error("Error updating property data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

    useEffect(()=> {
      setIsMounted(true)
  
    }, [])
  
    if(!isMounted) return null;
  
    if(id1!=id2) {
      return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold">
      Unauthorized!
    </div>
    )
    }

  return (
    <div className="flex h-screen">
      <div
        className={`fixed inset-y-0 left-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}
        {isModalOpen ? (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        ) : (
          ""
        )}
      </div>

      <div
        className={`flex-1 p-10 text-gray-700 overflow-y-auto ${
          isSidebarOpen ? "" : "w-full"
        } md:ml-64`}
      >
        {isModalOpen ? (
          <div
            className="md:hidden flex items-center space-x-2 p-2 mb-4 w-10 text-blue-800 border border-blue-800 rounded-md cursor-pointer hover:bg-blue-800 hover:text-white transition-colors duration-300"
            onClick={toggleSidebar}
          >
            <RiMenuFold3Fill className="text-xl" />
          </div>
        ) : (
          ""
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            {isModalOpen ? (
              <Button
                variant="outline"
                className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white"
              >
                Supprimer
              </Button>
            ) : (
              ""
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Suprimer cette publication</DialogTitle>
              <DialogDescription>{title}</DialogDescription>
            </DialogHeader>

            <div>Etes vous sur de vouloir supprimer cette publication?</div>
            <div>
              <Button onClick={handleDelete} variant="destructive">
                Suprimer
              </Button>
              <Button
                onClick={() => router.push("/my_list")}
                variant="secondary"
                className="mx-10"
              >
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
