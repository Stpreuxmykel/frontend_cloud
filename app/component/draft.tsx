const [regularProperties, setRegularProperties] = useState([]);
const [googleProperties, setGoogleProperties] = useState([]);

const fetchLikes = async () => {
  const like_data = await axios.get(`http://127.0.0.1:8000/api/get_likes/${firstUserId}/google/`);
  console.log("Response data for like here:", like_data.data.like_data);

  const my_data = like_data.data.like_data;

  // Arrays to store liked properties
  const regularLikedProperties = [];
  const googleLikedProperties = [];

  // Map over likeData and collect properties
  my_data.map((like, index) => {
    console.log(`Like new here ${index + 1}:`, like.google_property);
    
    if (like.property) {
      regularLikedProperties.push(like.property);
    }

    if (like.google_property) {
      googleLikedProperties.push(like.google_property);
    }
  });

  // Update state with all liked properties
  setRegularProperties(regularLikedProperties);
  setGoogleProperties(googleLikedProperties);
};

// Call fetchLikes inside useEffect or on some event (like button click)
useEffect(() => {
  fetchLikes();
}, []);

// Rendering the liked properties
return (
  <div>
    <h3>Regular Liked Properties:</h3>
    {regularProperties.map((property, index) => (
      <p key={index}>This property is liked: {property}</p>
    ))}

    <h3>Google Liked Properties:</h3>
    {googleProperties.map((property, index) => (
      <p key={index}>This property is liked: {property}</p>
    ))}
  </div>
);






const [likes, setLikes] = useState<{ [key: number]: number }>({});

const handleLike = async (property_id: number) => {
  try {
    const response = await axios.post(
      `${api_url}/likes/`,
      {
        user: Number(userId),
        property: property_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Get the updated like count from the response
    const updatedLikeCount = response.data.property.like_count;

    // Update state for the specific property
    setLikes((prevLikes) => ({
      ...prevLikes,
      [property_id]: updatedLikeCount,
    }));

    console.log("Liked:", response.data);
  } catch (error) {
    console.error("Error liking property:", error);
  }
};





import { useState, useEffect } from 'react';

const PropertyList = ({ properties, userId }) => {
  // 1. Initialize state from server data
  const [likedState, setLikedState] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    // Initialize when properties load
    const initialLikedState = {};
    const initialLikeCounts = {};
    
    properties.forEach(property => {
      initialLikedState[property.id] = property.liked_by_users.includes(Number(userId));
      initialLikeCounts[property.id] = property.like_count;
    });

    setLikedState(initialLikedState);
    setLikeCounts(initialLikeCounts);
  }, [properties, userId]);

  // 2. Handle like/unlike actions
  const handleLike = async (propertyId) => {
    try {
      // Optimistic UI update first
      setLikedState(prev => ({
        ...prev,
        [propertyId]: !prev[propertyId]
      }));
      
      setLikeCounts(prev => ({
        ...prev,
        [propertyId]: prev[propertyId] 
          ? prev[propertyId] - 1 
          : prev[propertyId] + 1
      }));

      // Then make API call
      const response = await fetch(`/api/properties/${propertyId}/like/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();

      // Sync with actual server response
      setLikedState(prev => ({
        ...prev,
        [propertyId]: data.message.includes("liked")
      }));
      
      setLikeCounts(prev => ({
        ...prev,
        [propertyId]: data.like_count
      }));

    } catch (error) {
      console.error("Error:", error);
      // Revert on error
      setLikedState(prev => ({
        ...prev,
        [propertyId]: !prev[propertyId]
      }));
    }
  };

  // 3. Render with guaranteed state
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6 m-2">
      {properties.map((property) => (
        <div key={property.id} className="relative group overflow-hidden rounded-2xl">
          {/* Your property card content */}
          
          <div 
            onClick={() => handleLike(property.id)} 
            className="absolute cursor-pointer top-4 right-4 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full"
          >
            {likedState[property.id] ? (
              <IoMdHeart className="text-2xl text-rose-500" />
            ) : (
              <CiHeart className="text-2xl text-white" />
            )}
            <span className="text-white text-sm font-semibold">
              {likeCounts[property.id] || 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};