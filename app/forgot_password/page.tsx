"use client";

import { useState } from 'react';
import axios from 'axios';
import {useRouter} from "next/navigation";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  const api_url= process.env.NEXT_PUBLIC_BACKEND_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const response = await axios.post(`${api_url}/password_reset/`, { email });
      setMessage('Password reset link has been sent to your email.');

      // Log the token and uid to the console
      console.log('Message:', response.data.message);
      console.log('Token:', response.data.token);
      console.log('UID:', response.data.uid);
       // Redirect to another page with token and uid as query parameters
// Construct the URL with query parameters
          const new_token = response.data.token;
          const uid = response.data.uid;

           // Store the token and uid in local storage
          localStorage.setItem('new_token', new_token);
          localStorage.setItem('uid', uid);
   
    } catch (error) {
      console.log("Here is the error : ", error)
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="mb-4 text-xl font-bold">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 mb-4 border rounded-lg"
          required
        />
        <button type="submit" className="p-2 text-white bg-blue-500 rounded-lg">
          Send Reset Link
        </button>
        {message && <p className="mt-4 text-center text-emerald-500">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
