 // useEffect(() => {
  //   const fetchCountriesAndProfiles = async () => {
      
  
  //     try {
  //       // Fetch countries
  //       const countryResponse = await axios.get(`${api_url}/country_city_region/`);
  //       console.log("Countries data:", countryResponse.data);
  
  //       setCountries(
  //         countryResponse.data.map((country) => ({
  //           id: country.id,
  //           name: country.name,
  //           isoCode: country.iso2,
  //           states: country.states?.map((state) => ({
  //             ...state,
  //             cities: state.cities || [],
  //           })) || [],
  //         }))
  //       );
  
      
  //     } catch (error) {
  //       console.error("Error fetching data:", error);

  //     }
      
  //   };
  
  //   fetchCountriesAndProfiles();
  // }, [session, token, router, api_url]);


  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     try {
  //       const response = await axios.get('/api/fetchCountries');
  //       console.log("Countries data here : ", response.data)
  //       setCountries(response.data);
  //     } catch (error) {
  //       console.error("Error fetching countries data:", error);
  //     }
  //   };

  //   fetchCountries();
  // }, []);


  // if(loading) {
//   return (
//     <div className="flex justify-center items-center mt-52">
//       <div className="text-center">
//         {loading ? (
//           <div className="flex items-center">
//             <FaSpinner className="animate-spin text-3xl mr-2 text-sky-500" /> {/* Icon with spin animation */}
//             <span className="text-xl font-bold">Checking...</span>
//           </div>
//         ) : (
//           <span className="text-xl font-bold">Unauthorized!</span>
//         )}
//       </div>
//     </div>
//   );
// }





  // try {
    //   const fetchData = async () => {
    //     const countryResponse = await axios.get(
    //       `${api_url}/country_city_region/`
    //     );
  
    //     console.log("checking countries data inside : ", countryResponse.data);
  
    //     setCountries(
    //       countryResponse.data.map((country: any) => ({
    //         id: country.id,
    //         name: country.name,
    //         isoCode: country.iso2, // Example: You can choose which property to use as value
    //         // states: country.states || [], // Default to an empty array if states are undefined
    //         states:
    //           country.states.map((state) => ({
    //             ...state,
    //             cities: state.cities || [], // Include cities in the state object
    //           })) || [], // Default to an empty array if states are undefined
    //       }))
    //     );
    //   };
  
    //   fetchData();

    // }catch(error) {
    //   console.log("error fetching countries: ", error)
    // }finally{
    //   setLoading(false)
    // }


    
      useEffect(() => {
        setUserId(getId()); // Fetch userId only on the client side
      }, []);
    
      console.log("Getting the id : ", userId);
    
      useEffect(()=>{
        if (typeof window !== "undefined") {
          if(token) {
            localStorage.removeItem('google_name_data')
          }
        }
      },[token])
 
      
      
        useEffect(() => {
          if (typeof window !== "undefined") {
            const profile_info = localStorage.getItem("profile_info");
            const new_name_data = localStorage.getItem("google_name_data");
      
            const new_profile = JSON.parse(profile_info);
            const name_data = JSON.parse(new_name_data);
            console.log('Profile info data : ', new_profile );
      
            // console.log(' NEW NAME DATA  : ', name_data )
      
            if (name_data) {
              setuserId(name_data.id);
              setGoogleToken(name_data.token);
            }
      
            
      
            if (new_profile) {
              if (new_profile.user) {
               
                router.push("/dashboard");
              }
            } else {
              setLoading(false);
            }
      
           
          }
        }, [router]);
      