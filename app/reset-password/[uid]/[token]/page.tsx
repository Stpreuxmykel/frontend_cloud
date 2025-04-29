'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const [token, setToken] = useState('');
  const [uid, setUid] = useState('');


  const api_url= process.env.NEXT_PUBLIC_BACKEND_API_URL

  useEffect(() => {
    // Retrieve the token and uid from local storage
    const storedToken = localStorage.getItem('new_token');
    const storedUid = localStorage.getItem('uid');
    console.log("storedToken : ", storedToken)
    console.log("storedUid : ", storedUid)
    

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  // Handle form submission for password reset
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    try {
      // Make the API request to reset the password using the UID and token
      await axios.post(`${api_url}/password_reset_confirm/`, {
        uid,
        token,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success('Password has been reset. You can now log in.');
      router.push('/login');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };




  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="mb-4 text-xl font-bold">Reset Password</h1>
        
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 mb-4 border rounded-lg"
          required
        />
        <button type="submit" className="p-2 text-white bg-blue-500 rounded-lg">
          Reset Password
        </button>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
