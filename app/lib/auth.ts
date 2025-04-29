
interface User {
    id: string;
    name: string;
    email: string;
    // Add other properties as needed
}

// lib/auth.js

/**
 * Retrieve the token from localStorage.
 * @returns {string | null} The token if it exists, otherwise null.
 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null; // Or handle it as needed for server-side
};


export const verifyInterest = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_interest');
  }
  return null; // Or handle it as needed for server-side
};

export const getPropertyId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("propertyId")

  }
  return null; // Or handle it as needed for server-side
};

export const getPropertyUser = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("propertyUser")

  }
  return null; // Or handle it as needed for server-side
};




export const verifyProfile = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_profile');
  }
  return null; // Or handle it as needed for server-side
};


/**
 * Retrieve the user data from localStorage.
 * @returns {object | null} The parsed user object if it exists, otherwise null.
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Save the token to localStorage.
 * @param {string} token - The token to store.
 */
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

/**
 * Save the user data to localStorage.
 * @param {object} user - The user object to store.
 */
export const setUser = (user:User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Remove the token and user data from localStorage.
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
