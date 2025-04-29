
import axios from "axios";
import { getToken } from "../lib/auth";


 const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;



export const deleteUploadedImages = async (publicIds: string[]) => {
 try {
      for (const publicId of publicIds) {
        const timestamp = new Date().getTime();
  
        const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
        const crypto = require('crypto');
        const signature = crypto
          .createHash('sha1')
          .update(paramsToSign + "qHx31tOxkYY9cqR3kKwkSw98wJc")
          .digest('hex');
  
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('timestamp', timestamp);
        formData.append('api_key', '215394672534716');
        formData.append('signature', signature);
  
        await axios.post(
          `https://api.cloudinary.com/v1_1/dgytff1az/image/destroy`,
          formData
        );
        console.log(`Deleted image with public_id: ${publicId}`);
      }
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
    }
};




export const deleteUploadedSingleImage = async (publicId) => {
    try {
      const timestamp = new Date().getTime();

      const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
      const crypto = require('crypto');
      const signature = crypto
        .createHash('sha1')
        .update(paramsToSign + "qHx31tOxkYY9cqR3kKwkSw98wJc") // your cloudinary API secret
        .digest('hex');

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp);
      formData.append('api_key', '215394672534716'); // your cloudinary API key
      formData.append('signature', signature);

      await axios.post(
        `https://api.cloudinary.com/v1_1/dgytff1az/image/destroy`, // destroy endpoint
        formData
      );

      console.log(`Deleted image with public_id: ${publicId}`);

    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  };


export const getId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null; // Return null if window is not defined
  };
  

  export const getMembership = () => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("membershipPlan") || "{}")
    }
    return null; // Return null if window is not defined
  };
  
  export const capitalize = (str) => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
  }

  export const formatFrenchDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  export const getUserActualPlan = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("has_plan");
    }
    return null; // Return null if window is not defined
  };


  export const getPlanType = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("plan_name");
    }
    return null; // Return null if window is not defined
  };


  
  export const getTotal = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("total");
    }
    return null; // Return null if window is not defined
  };


 
  export const getTotalSales = async () => {
    const token = getToken()
    try {
      const response = await axios.get(`${api_url}/membership_plans/total-sales/`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data.total_sales;
    } catch (error) {
      console.log("Error fetching total sales:", error);
      return [];
    }
  };


  export const getMembershipPlans = async () => {
    const token = getToken()
    try {
      const response = await axios.get(`${api_url}/membership_plans/all-plans/`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching membership plans:", error);
      return [];
    }
  };


  export const getDailyTransactions = async () => {
    const token = getToken()
    try {
      const response = await axios.get(`${api_url}/daily_transactions/`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching daily_transactions :", error);
      return [];
    }
  };


  export const PlanTracking = async () => {
    try {
      const response = await axios.get(`${api_url}/plan_tracking/`,);
      return response.data;
    
    } catch (error) {
      console.error("Error fetching plan tracking:", error);
      throw error;
    }
  };
  



export const fetchProperties = async () => {
  try {
    const response = await axios.get(`${api_url}/create_property_user/`,);
    return response.data;
   
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};




export const getPropertyDetails = async () => {
  const propertyId = localStorage.getItem("propertyId")
  try {
    const response = await axios.get(`${api_url}/create_property_user/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching property :", error);
    throw error;
  }
};




export const getUserProperties = async () => {
  const userId = localStorage.getItem("userId")
  try {
    const response = await axios.get(`${api_url}/create_property_user/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching property :", error);
    throw error;
  }
};






export const getVirtualCard = async () => {
  const userId = localStorage.getItem("userId")
  const token = getToken()
  try {
    const response = await axios.get(`${api_url}/virtual-card/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching virtual card:", error.response?.data || error.message);
    throw error;
  }
};


export const getRevenue = async () => {
  
  const token = getToken()
  try {
    const response = await axios.get(`${api_url}/revenues/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching revenues:", error.response?.data || error.message);
    throw error;
  }
};




export const getPlan = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('plan');
  }
  return null; // Or handle it as needed for server-side
};

export const getAdmin = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin');
  }
  return null; // Or handle it as needed for server-side
};




export const getAllVirtualCard = async () => {
 
  const token = getToken()
  try {
    const response = await axios.get(`${api_url}/card/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching all virtual card data:", error.response?.data || error.message);
    throw error;
  }
};


export const getPlanData = async () => {
 
  const token = getToken()
  const user_id = getId()
  try {
    const response = await axios.get(`${api_url}/plan_data/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching all plan data:", error.response?.data || error.message);
    throw error;
  }
};


export const getUpdateProperty= async () => {
  const propertyId = localStorage.getItem("propertyId")
  try {
    const response = await axios.get(`${api_url}/create_property_user/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching property :", error);
    throw error;
  }
};

export const getPropertiesBasedOnUserLocation= async () => {
  const userId = localStorage.getItem("userId")
  try {
    const response = await axios.get(`${api_url}/create_property_user/filter-by-location?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties based on the user location :", error);
    throw error;
  }
};

export const getPropertiesBasedOnUserSubscription= async () => {
  const userId = localStorage.getItem("userId")
  try {
    const response = await axios.get(`${api_url}/subscriptions/list_subscribed_properties/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties based on the user subscriptions :", error);
    throw error;
  }
};


export const getNotification= async () => {
  const userId = localStorage.getItem("userId")
  try {
    const response = await axios.get(`${api_url}/notifications/count/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notification count :", error);
    throw error;
  }
};



export const getAllCountries= async () => {
  
  try {
    const response = await fetch('/allCountries.json');
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching countries :", error);
    throw error;
  }
};



export const getAllUserProfile= async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${api_url}/create_user_profile/`, 
      {
        headers: {
          Authorization: `Bearer ${token}` // Pass the Bearer token in the headers
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile :", error);
    throw error;
  }
};



export const getUserProfile= async () => {
  const userId = localStorage.getItem("userId")
  const token = getToken();
  try {
    const response = await axios.get(`${api_url}/create_user_profile/${userId}`, 
      {
        headers: {
          Authorization: `Bearer ${token}` // Pass the Bearer token in the headers
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile :", error);
    throw error;
  }
};







export const getUserInterest = async () => {
  const userId = localStorage.getItem("userId")
  const token = getToken()
  try {
    const response = await axios.get(`${api_url}/create_user_interests/${userId}`, 

      {
        headers: {
          Authorization: `Bearer ${token}` // Pass the Bearer token in the headers
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching property :", error);
    throw error;
  }
};






  