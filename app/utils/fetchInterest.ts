import axios from 'axios';

export const fetchUserData = async (
  session: any,
  token: string | null,
  setGoogleToken: (value: string) => void,
  setuserId: (value: string) => void,
  setGoogleInterest: (data: any) => void,
  setUserInterest: (data: any) => void
): Promise<{ hasInterest: boolean }> => {
  let hasInterest = false;

  try {
    if (session) {
      // Fetch Google user token
      const response_data = await axios.get(`http://localhost:8000/api/google-user-token/${session?.user?.email}`);
      const { token_id, google_users_data } = response_data.data;
      setGoogleToken(token_id);

      if (google_users_data.length > 0) {
        const firstUserId = google_users_data[0].id;
        setuserId(firstUserId);
      } else {
        console.log("No users found.");
      }

      // Fetch Google user interest
      try {
        const interest_data = await axios.get(`http://localhost:8000/api/get-user-google-interest/${session?.user?.email}`);
        setGoogleInterest(interest_data.data);

        // Check if user has any Google interests
        if (interest_data.data.length > 0) {
          hasInterest = true;
        }
      } catch (error) {
        console.error("Error fetching Google interest:", error);
      }
    }

    if (token) {
      // Fetch user interest
      try {
        const response_data = await axios.get('http://localhost:8000/api/get-user-interest/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserInterest(response_data.data);
        console.log("User profile data:", response_data.data);

        // Check if user has any interests
        if (response_data.data.length > 0) {
          hasInterest = true;
        }
      } catch (error) {
        console.error("Error fetching user interest:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  return { hasInterest };
};
