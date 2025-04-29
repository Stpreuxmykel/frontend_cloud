"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const VerifyEmail = () => {
    const [code, setCode] = useState(Array(6).fill(''));
    const [message, setMessage] = useState('');
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const api_url= process.env.NEXT_PUBLIC_BACKEND_API_URL
    const handleVerifyCode = async () => {
        setIsLoading(true);
        try {
            const verificationCode = code.join(''); // Combine the six inputs into a single string
            const response = await axios.post(`${api_url}/verify-code/`, { code: verificationCode });
            setMessage(response.data.message);
            router.push('/login'); // Redirect to login or another page after successful verification
        } catch (error) {
            setMessage('Error verifying code.');
        }
    };

    const handleChange = (e, index) => {
        const newCode = [...code];
        newCode[index] = e.target.value;
        setCode(newCode);

        // Automatically move to the next input box if a digit is entered
        if (e.target.value.length === 1 && index < 5) {
            document.getElementById(`code-${index + 1}`).focus();
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <p className=" mb-4">Un code de vérification a été envoyé à votre adresse e-mail. <br /> Veuillez vérifier votre messagerie pour obtenir le code.</p>
            <div className="flex space-x-2 mb-4">
                {[...Array(6)].map((_, index) => (
                    <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        maxLength="1"
                        className="w-12 h-12 text-center shadow border rounded-md text-xl font-semibold focus:outline-none focus:border-blue-500"
                        value={code[index] || ''}
                        onChange={(e) => handleChange(e, index)}
                    />
                ))}
            </div>
            {/* <button
                onClick={handleVerifyCode}
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
                Verify Code
            </button> */}
            <button
              onClick={handleVerifyCode}
              className={` py-2 px-4 bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center ${
                isLoading ? "bg-blue-300 cursor-not-allowed" : "hover:bg-blue-600 "
              }`}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <>
                <Loader2 className="animate-spin h-6 w-6 mx-1" /> Verification... </>
              ) : (
                "Verifier"
              )}
            </button>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
};

export default VerifyEmail;
