"use client";

import { Input } from "@/components/ui/input";
import Container from "../component/Container";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getToken, verifyInterest, verifyProfile } from "../lib/auth";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
import { fetchUserData } from "../utils/fetchInterest";
import { v4 as uuidv4 } from 'uuid';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";


import Link from "next/link";

const Login = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/');
  const [userInterest, setUserInterest] = useState('');

  const router = useRouter();
  const token = getToken();
  const {data:session} = useSession()

  const api_url= process.env.NEXT_PUBLIC_BACKEND_API_URL

   const interest = verifyInterest();
   const profile =  verifyProfile();


  console.log("redirectTo url : ", redirectTo)
  console.log("user session: ", session)

  const searchParams = useSearchParams();
  const new_redirect = searchParams?.get('redirect');  // Access the 'redirect' parameter

  useEffect(() => {
    if (new_redirect) {
      console.log('Redirect exists:', new_redirect);
      // Handle your logic for redirect, such as showing a message
    } else {
      console.log('No redirect parameter found');
    }
  }, [new_redirect]);



  useEffect(() => {

    // Read the redirect query parameter from the URL
    const url = new URL(window.location.href);
    const redirect = url.searchParams.get('redirect') || '/';
    setRedirectTo(redirect);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${api_url}/login/`, {
        username,
        password,
      });
      const { access } = response.data;

      // Optionally decode the token if needed
      localStorage.setItem("user", JSON.stringify({ token: access }));
      console.log("User info data : ", response.data)

      localStorage.setItem("token", access);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("gmail", response.data.email);
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("user_interest", response.data.interest);
      localStorage.setItem("user_profile", response.data.profile);
      localStorage.setItem("has_plan", response.data.has_plan);
      localStorage.setItem("plan_name", response.data.plan_name);
      localStorage.setItem("total", response.data.property_count);


      
      if (response.data.interest == true && response.data.profile == true) {
        router.push("/dashboard");
      }

      if (response.data.profile == true && response.data.interest == false) {
        router.push("/user_interest");
      }

      if (response.data.profile == false && response.data.interest == true) {
        router.push("/complete_profile");
      }

      if (response.data.profile == false && response.data.interest == false) {
        router.push("/user_interest");
      }
    

    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.detail) {
        
        if(error.response.status===401) {
          setError("L'utilisateur ou le mot de passe est incorrect!");
        }
       
        
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  
  const handleLoginFailure = () => {
    console.log("Google Login Failed");
  };



   // Handle Google Login
  
 const handleGoogleLoginSuccess = async (response: any) => {
    console.log("Google Login Success:", response);
    try {
      const userInfo = JSON.parse(atob(response.credential.split(".")[1]));
      console.log("User info : ", userInfo)
      const { name, email } = userInfo;

      const res = await axios.post(`${api_url}/google-signup/`, {
        token: response.credential,
        name,
        email,
      });

      console.log("Backend Response:", res.data);
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.access);
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("gmail", res.data.user.email);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("user_interest", res.data.user.interest);
        localStorage.setItem("user_profile", res.data.user.profile);
        localStorage.setItem("has_plan", res.data.user.has_plan);
        localStorage.setItem("plan_name", res.data.user.plan_name);
        localStorage.setItem("total", res.data.user.property_count);
        
      }

          
      if (res.data.user.interest == true && res.data.user.profile == true) {
        router.push("/dashboard");
      }

      if (res.data.user.profile == true && res.data.user.interest == false) {
        router.push("/user_interest");
      }

      if (res.data.user.profile == false && res.data.user.interest == true) {
        router.push("/complete_profile");
      }

      if (res.data.user.profile == false && res.data.user.interest == false) {
        router.push("/user_interest");
      }


      // router.push("/dashboard");
    } catch (error: any) {
      console.error("Google Login Failed:", error);
      setError(error.response?.data?.error || "Login failed.");
    }
  };


  useEffect(() => {
    setIsMounted(true);
  
  }, []);

  if (!isMounted) return null;
  return (
    <Container>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Welcome Section */}
        <div className="hidden md:flex flex-1 items-center bg-white justify-center p-6 text-white">
          <div className="text-center">
            <Image
              height="300"
              width="300"
              src="/images/account.png"
              alt="Logo"
              className="mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              EspasLink Connexion
            </h1>
            <h6 className="text-lg text-slate-400">
              Connectez-vous à votre compte pour continuer
            </h6>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-200">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <Image
              height="100"
              width="100"
              src="/images/lg.jpeg"
              alt="Logo"
              className="mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Veuillez vous connecter
            </h1>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-semibold mb-2"
              >
              Nom d&apos;utilisateur
              </label>
              <Input
                id="username"
                className="w-full"
                placeholder="Pierre"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
              >
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                className="w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Display error message */}
            {error && (
              <div className="mt-4 text-red-500 text-center">{error}</div>
            )}

            <button
              onClick={handleLogin}
              className={`w-full py-3 text-white rounded-lg transition-colors flex items-center justify-center ${
                isLoading
                  ? "bg-neutral-600 cursor-not-allowed"
                  : "bg-neutral-800 hover:bg-neutral-700"
              }`}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-6 w-6 mx-1" /> Connexion{" "}
                </>
              ) : (
                "Se Connecter"
              )}
            </button>

            

            {/* <div className="flex items-center justify-center mt-3">
              <button
                onClick={handleSignInAndRedirect}
                className="flex items-center space-x-2"
              >
                <FcGoogle size={28} />
                <span>Se connecter avec Google</span>
              </button>
            </div> */}

            <div className="flex items-center justify-center mt-3">
                <GoogleOAuthProvider clientId="510516255175-q4rdlmjjl7gnuve9tk2o0gpkt54tjq0d.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess }
                  // onError={handleLoginFailure}
                  onError={() => setError("Google login failed.")}
                />
              </GoogleOAuthProvider>
             </div>

            <div  className="flex items-center justify-center mt-3 text-blue-500">
              <Link
                href="/forgot_password"
              >
                Mot de passe oublié ?
              </Link>
            </div>

          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
