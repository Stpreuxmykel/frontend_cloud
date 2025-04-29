"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Container from "../component/Container";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import Image from 'next/image';
import { useSession, signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { getToken } from "../lib/auth";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast'

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";



const Signup = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [conf_password, setConfPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession(); // Access session data
  const token = getToken();
  const [formerror , setFormError] = useState('');
  const [error, setError ] = useState("")


  const api_url= process.env.NEXT_PUBLIC_BACKEND_API_URL

  const handleSignUp = async (e:any) => {
    e.preventDefault();
    setIsLoading(true); // Start loading before making the API call


    let hasError = false

    if(!username) {
      const er = "L'utilisateur ne doit pas être vide "
      setFormError(er)
      toast.error(er)
      hasError = true
    }
    if(!email) {
      const er = "L'email ne doit pas être vide "
      setFormError(er)
      toast.error(er)
      hasError = true
    }
    if(!password) {
      const er = "Le mot de passe ne doit pas être vide "
      setFormError(er)
      toast.error(er)
      hasError = true
    }

    if(password != conf_password){
      const er = "Le mot de passe et la confirmation du mot de passe doivent être identiques"
      setFormError(er)
      toast.error(er)
      hasError = true
    }


    if (hasError) {
      setIsLoading(false);
      return;
    }
  
    setFormError(""); 


    try {
      await axios.post(`${api_url}/signup/`, { username, email, password });
      router.push('/verify-email'); // Redirect after successful signup
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.error || "Login failed.");

    } finally {
      setIsLoading(false); // Stop loading after API call is complete
    }

  };

  const handleGoogleSignIn = async () => {
    signIn("google");
  };

  useEffect(() => {
    setIsMounted(true);

    // Handle saving Google sign-in information
    if (session?.user) {
      const { name, email} = session.user;

      const userUUID = uuidv4(); // Generate a UUID

  // Assuming the id is stored in session.user.id
      console.log("name:", name, "email:", email, "id:", userUUID);
   

      // Send user information to your backend
      axios.post(`${api_url}/google-signin/`, { name, email, token_id: userUUID})
        .then(response => {
          console.log("User data saved successfully:", response.data);
        })
        .catch(error => {
          console.error("Error saving user data:", error);
        });

      // Redirect after saving user data
      router.push('/user_interest');
    }
  }, [session, router, token, api_url]);



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


    } catch (error: any) {
      console.error("Google Login Failed:", error);
      setError(error.response?.data?.error || "Login failed.");
    }
  };


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
              Bienvenue sur EspasLink
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Créez un compte pour rejoindre notre communauté !
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-200">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Créer un compte
            </h1>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold mb-2">
                Nom d&apos;utilisateur
              </label>
              <Input
                id="username"
                className="w-full"
                placeholder="Pierre"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                className="w-full"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                className="w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirm-password" className="block text-sm font-semibold mb-2">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirm-password"
                type="password"
                className="w-full"
                placeholder="••••••••"
                value={conf_password}
                onChange={(e) => setConfPassword(e.target.value)}
                required
              />
            </div>

            <button
              onClick={handleSignUp}
              className={`w-full py-3 text-white rounded-lg transition-colors flex items-center justify-center ${
                isLoading ? "bg-neutral-600 cursor-not-allowed" : "bg-neutral-800 hover:bg-neutral-700"
              }`}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-6 w-6 mx-1" /> Inscription en cours 
                </>
              ) : (
                "S'inscrire"
              )}
            </button>

              {/* Display error message */}
              {error && (
                <div className="mt-4 text-red-500 text-center">{error}</div>
              )}


            {/* <div className="flex items-center justify-center mt-3">
              <button
                onClick={handleGoogleSignIn}
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

          </div>
        </div>
      </div>
    </Container>
  );
};

export default Signup;
