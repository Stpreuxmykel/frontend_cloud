"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const api_url = process.env.NEXT_PUBLIC_API_URL; // Ensure this is set in your env

  // Handle Normal Login
  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${api_url}/login/`, {
        username,
        password,
      });
      const { access } = response.data;

      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify({ token: access }));

      // Fetch user interest and profile
      const [interestResponse, profileResponse] = await Promise.all([
        axios.get(`${api_url}/get-user-interest/`, {
          headers: { Authorization: `Bearer ${access}` },
        }),
        axios.get(`${api_url}/get-user-profile/`, {
          headers: { Authorization: `Bearer ${access}` },
        }),
      ]);

      localStorage.setItem("interest_info", JSON.stringify(interestResponse.data));
      localStorage.setItem("profile_info", JSON.stringify(profileResponse.data));

      // Redirect based on fetched data
      if (interestResponse && profileResponse) {
        router.push("/dashboard");
      } else {
        router.push("/user_interest");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("L'utilisateur ou le mot de passe est incorrect!");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLoginSuccess = async (response: any) => {
    console.log("Google Login Success:", response);
    try {
      const tokenPayload = JSON.parse(atob(response.credential.split(".")[1]));
      const { name, email } = tokenPayload;

      const res = await axios.post(`${api_url}/google-signup/`, {
        token: response.credential,
        name,
        email,
      });

      console.log("Backend Response:", res.data);
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("gmail", res.data.user.email);
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google Login Failed:", error);
      setError(error.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {/* Normal Login Button (Example) */}
      <button
        onClick={() => handleLogin("testuser", "password123")}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {isLoading ? "Logging in..." : "Login with Email"}
      </button>

      {/* Google Login Button */}
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => setError("Google login failed.")} />
      </GoogleOAuthProvider>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default Login;
