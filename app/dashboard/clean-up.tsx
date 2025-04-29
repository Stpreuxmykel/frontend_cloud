 //   try {
       
  
    //     const email = session?.user?.email;
    //     const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;
    //     const updateProgress = (type) => type === 'profile' ? setUpdatePercent(50) : setNewPercent(25);
  
    //     const fetchData = async (url, config, type) => {
    //       try {
    //         setLoading(true)
    //         const response = await axios.get(url, config);
    //         type === 'profile' ? setUserData(response.data) : setGoogleData(response.data);
    //         updateProgress(type);
    //       } catch (error) {
    //         console.error(`Error fetching ${type}: `, error);
    //       }
    //     };
  
    //     setPercentage(25);
  
    //     if (session) {
    //       setLoading(true)
    //       await fetchData(`${api_url}/get-google-user-profile/${email}`, undefined, 'profile');
    //       await fetchData(`${api_url}/get-user-google-interest/${email}`, undefined, 'interest');
    //     }
  
    //     if (token) {
    //       setLoading(true)
    //       await fetchData(`${api_url}/get-user-profile/`, { headers: authHeader }, 'profile');
    //       await fetchData(`${api_url}/get-user-interest/`, { headers: authHeader }, 'interest');
    //     }
        
    //   } catch (error) {
    //     console.error("An error occurred: ", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
  
    // fetchUserData();




     // useEffect(() => {
  //   const fetchData = async () => {
     
  
  
  //     // Fetch Google user data if session exists
    
  //     // Fetch country data
  //     try {
  //       const countryResponse = await axios.get(
  //         `${api_url}/country_city_region/`
  //       );
  //       setCountries(
  //         countryResponse.data.map((country: any) => ({
  //           id: country.id,
  //           name: country.name,
  //           isoCode: country.iso2,
  //           states: country.states.map((state:any) => ({
  //             ...state,
  //             cities: state.cities || [],
  //           })) || [],
  //         }))
  //       );
  //     } catch (error) {
  //       console.error("Error fetching countries data:", error);
  //     }
  //   };
  
  //   if (token) {
  //     fetchData(); // Only fetch data if token is available
  //   }
  // }, [session, id, router, token,api_url]); // Trigger when session, id, router, or token change