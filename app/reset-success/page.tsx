"use client";

import { useEffect, useState } from 'react';

const AnotherPage = () => {
  const [token, setToken] = useState('');
  const [uid, setUid] = useState('');

  useEffect(() => {
    // Retrieve the token and uid from local storage
    const storedToken = localStorage.getItem('token');
    const storedUid = localStorage.getItem('uid');

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  return (
    <div>
      <h1>Password Reset Page</h1>
      <p>Token: {token}</p>
      <p>UID: {uid}</p>
    </div>
  );
};

export default AnotherPage;
