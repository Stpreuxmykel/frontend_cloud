  // useEffect(() => {
  //   setLoading(true);
  //   const fetchGoogleUserData = async () => {
  //     try {
  //       if (token || session) {
  //         setPercentage(25);
  //         if (session) {
  //           try {
  //             const response_data = await axios.get(
  //               `${api_url}/get-google-user-profile/${session?.user?.email}`
  //             );
  //             setGoogleData(response_data.data);
  //             setUpdatePercent(50);
  //           } catch (error) {
  //             console.error("Error fetching Google user profile: ", error);
  //           }

  //           try {
  //             const interest_data = await axios.get(
  //               `${api_url}/get-user-google-interest/${session?.user?.email}`
  //             );
  //             if (interest_data.data) {
  //               setNewPercent(25);
  //             }
  //           } catch (error) {
  //             console.error("Error fetching Google user interest: ", error);
  //           }
  //         }

  //         if (token) {
  //           setPercentage(25);
  //           try {
  //             const response_data = await axios.get(`${api_url}/get-user-profile/`, {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             });
  //             setUserData(response_data.data);
  //             setUpdatePercent(50);
  //           } catch (error) {
  //             console.error("Error fetching user profile: ", error);
  //           }

  //           try {
  //             const interst_r_data = await axios.get(
  //               `${api_url}/get-user-interest/`,
  //               {
  //                 headers: {
  //                   Authorization: `Bearer ${token}`,
  //                 },
  //               }
  //             );
  //             if (interst_r_data.data) {
  //               setNewPercent(25);
  //             }
  //           } catch (error) {
  //             console.error("Error fetching user interest: ", error);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("An error occurred: ", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchGoogleUserData();
  // }, [session, token, router, api_url]);
