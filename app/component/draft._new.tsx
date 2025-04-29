// const likeProperty = async () => {

  //   if(token || session) {
     
  //     try {
  //       const response_data = await axios.get(
  //         `${api_url}/get-property/${property.property_id}`
  //       );
  
  //       const { user_property, google_user_property } = response_data.data;
  //       if (user_property) {
  //         // setPropertyState('regular')
  //         if (token) {
  //           const response = await axios.post(
  //             `${api_url}/like_property/${property.id}/regular/regular/`,
  //             {}, // Empty body, since data is passed in the URL
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`, // Pass the token in headers
  //                 "Content-Type": "application/json", // Set content type
  //               },
  //             }
  //           );
  
  //           if (response.status === 201 || response.status === 200) {
  //             setRegularProperties([]);
  //             setGoogleProperties([]);
  //           }
  //           console.log(
  //             "Data come from property that Like or Unlike : ",
  //             response.data
  //           );
  //           setLikeStatus(response.data.message);
  //           setLikeCount(response.data.like_count);
            
  //         } else {
  //           const google_data = await axios.get(
  //             `${api_url}/google-user-token/${session?.user?.email}`
  //           );
  
  //           const { token_id, google_users_data } = google_data.data;
  //           const firstUserId = google_users_data[0].id;
  //           console.log("First user's ID:", firstUserId);
  
  //           const response = await axios.post(
  //             `${api_url}/like_property/${property.id}/regular/google/`,
  //             {
  //               user_id: firstUserId,
  //             }, // Empty body, since data is passed in the URL
  //             {
  //               headers: {
  //                 "Content-Type": "application/json", // Set content type
  //               },
  //             }
  //           );
  
  //           if (response.status === 201 || response.status === 200) {
  //             setRegularProperties([]);
  //             setGoogleProperties([]);
  //           }
  
  //           console.log(
  //             "Data come from property that Like or Unlike : ",
  //             response.data
  //           );
  //           setLikeStatus(response.data.message);
  //           setLikeCount(response.data.like_count);
  //         }
  //       } else {
  //         if (token) {
  //           const response = await axios.post(
  //             `${api_url}/like_property/${property.id}/google/regular/`,
  //             {}, // Empty body, since data is passed in the URL
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`, // Pass the token in headers
  //                 "Content-Type": "application/json", // Set content type
  //               },
  //             }
  //           );
  
  //           if (response.status === 201 || response.status === 200) {
  //             setRegularProperties([]);
  //             setGoogleProperties([]);
  //           }
  //           console.log(
  //             "Data come from property that Like or Unlike : ",
  //             response.data
  //           );
  //           setLikeStatus(response.data.message);
  //           setLikeCount(response.data.like_count);
  //         } else {
  //           const google_data = await axios.get(
  //             `${api_url}/google-user-token/${session?.user?.email}`
  //           );
  
  //           const { token_id, google_users_data } = google_data.data;
  //           const firstUserId = google_users_data[0].id;
  //           console.log("First user's ID:", firstUserId);
  
  //           const response = await axios.post(
  //             `${api_url}/like_property/${property.id}/google/google/`,
  //             {
  //               user_id: firstUserId,
  //             }, // Empty body, since data is passed in the URL
  //             {
  //               headers: {
  //                 "Content-Type": "application/json", // Set content type
  //               },
  //             }
  //           );
  //           if (response.status === 201 || response.status === 200) {
  //             setRegularProperties([]);
  //             setGoogleProperties([]);
  //           }
  
  //           console.log(
  //             "Data come from property that Like or Unlike : ",
  //             response.data
  //           );
  //           setLikeStatus(response.data.message);
  //           setLikeCount(response.data.like_count);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error liking the property:", error);
  //     }
  //   }else{
  //      // router.push("/login")
  //     // Store the current URL before redirecting
  //     const currentUrl = window.location.pathname;
  //     // Redirect to the login page with the current URL as a query parameter
  //     router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
   
    
  // }
  


  // };




  
// useEffect(() => {
//   const fetchProperties = async () => {
//     try {
//       // Fetch properties and likes in parallel
//       const [propertiesRes, likesRes] = await Promise.all([
//         axios.get(`${api_url}/properties/`),
//         axios.get(`${api_url}/property_likes/`)
//       ]);

//       const { google_user_properties, user_properties } = propertiesRes.data;
//       const { google_properties, regular_properties } = likesRes.data;

//       // Map over properties to construct new like arrays
//       const newGoogleLike = google_properties.map((like) => ({
//         googlePropertyId: like.google_property,
//         likeCount: like.like_count
//       }));
//       const newRegularLike = regular_properties.map((like) => ({
//         regularPropertyId: like.property,
//         likeCount: like.like_count
//       }));

//       // Update likes state
//       setGoogleLikes(newGoogleLike);
//       setRegularLikes(newRegularLike);

//       // Fetch additional property data
//       const propertyRes = axios.get(`${api_url}/get-property/${property.property_id}`);
//       const isUserSession = session || token;

//       let userLikeData = [];
//       if (isUserSession) {
//         // If session is available, prioritize Google data
//         if (session) {
//           const googleUserTokenRes = await axios.get(
//             `${api_url}/google-user-token/${session.user.email}`
//           );
//           const googleUserId = googleUserTokenRes.data.google_users_data[0].id;
//           const likeDataRes = await axios.get(
//             `${api_url}/get_likes/${googleUserId}/google/`
//           );
//           userLikeData = likeDataRes.data.like_data;
//         } else if (token) {
//           const actualUserDataRes = await axios.get(
//             `${api_url}/actual_user_data`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           const userId = actualUserDataRes.data.actual_user_data[0].user;
//           const likeDataRes = await axios.get(
//             `${api_url}/get_likes/${userId}/regular/`
//           );
//           userLikeData = likeDataRes.data.like_data;
//         }

//         // Collect liked properties for regular and Google users
//         const regularLikedProperties = userLikeData
//           .filter((like) => like.property)
//           .map((like) => like.property);
//         const googleLikedProperties = userLikeData
//           .filter((like) => like.google_property)
//           .map((like) => like.google_property);

//         // Update state with liked properties
//         setRegularProperties(regularLikedProperties);
//         setGoogleProperties(googleLikedProperties);
//       }

//       // Shuffle images and set the first image
//       const images = Array.isArray(property.images) ? property.images : [];
//       if (images.length > 0) {
//         const shuffledImages = images.sort(() => Math.random() - 0.5);
//         setFirstImage(`${api_url}${shuffledImages[0].image}`);
//       }
//     } catch (error) {
//       console.error("Error fetching properties:", error);
//     }
//   };

//   fetchProperties();
// }, [property.images, session, property.property_id, token, api_url]);

