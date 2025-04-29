"use client"
import { useState, useEffect } from 'react';
import axios from "axios";

import { fetchProperties, getAllVirtualCard, getTotalSales, getRevenue, getUserProfile, getMembershipPlans, getDailyTransactions, getAllUserProfile } from "../api/action";
import { getToken } from '../lib/auth';


const NeonTable = () => {
  const [allUserProfile, setAllUserProfile] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = getToken();

  const fetchAllUserProfile = async () => {
    try {
      const all_users_profile = await getAllUserProfile();
      setAllUserProfile(all_users_profile);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    }
  };

  const handleActivation = async (id, active) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/toggle-activation/',
        {
          user_id: id,
          is_active: active,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Ensure token is correctly passed
          },
        }
      );
  
      console.log('Activation toggled:', res.data);
      fetchAllUserProfile();  // Re-fetch the updated list of user profiles
      return res.data;
    } catch (err) {
      console.error('Toggle user error:', err);
      throw err;
    }
  };
  

  useEffect(() => {
    fetchAllUserProfile();
  }, []);

  // Filter users based on search query
  const filteredUsers = allUserProfile.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.firstname.toLowerCase().includes(searchLower) ||
      user.lastname.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-4 min-h-screen bg-gray-900 overflow-y-auto">
    <div className="w-full mx-auto">
      {/* Search Input */}
      <div className="mb-8 group relative max-w-md mx-auto">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-3 bg-gray-900/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        />
      </div>
  
      {/* Table Container */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
        {/* Responsive Table */}
        <div className="overflow-x-auto h-screen sm:overflow-y-auto rounded-md">
          <table className="w-full hidden sm:table">
            <thead className="bg-gradient-to-r from-cyan-400/10 to-purple-600/10">
              <tr>
                {['Username', 'Status', 'Country', 'Phone', 'City', 'State', 'Address'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-cyan-400 border-b border-cyan-400/20"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
  
            <tbody className="divide-y divide-cyan-400/10">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-900/50 transition-colors duration-200 ${
                    !user.is_active ? 'border-l-4 border-red-500/50' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-cyan-300">
                    {user.firstname} {user.lastname}
                  </td>
  
                  <td className="px-6 py-4">
                    <span
                    onClick={()=>handleActivation(user.user, user.is_active)}
                      className={`inline-flex items-center px-2.5 py-0.5 cursor-pointer  rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-green-400/10 text-rose-500 '
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
  
                  <td className="px-6 py-4 text-sm text-cyan-300">{user.country}</td>
                  <td className="px-6 py-4 text-sm text-cyan-300 font-mono">{user.phone_number}</td>
                  <td className="px-6 py-4 text-sm text-cyan-300">{user.city}</td>
                  <td className="px-6 py-4 text-sm text-cyan-300">{user.state}</td>
                  <td className="px-6 py-4 text-sm text-cyan-300 max-w-xs truncate">{user.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {/* Mobile Version (Scrollable Key-Value Pairs) */}
          <div className="block sm:hidden overflow-x-auto  min-h-screen">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 mb-4 rounded-lg border border-cyan-400/20 bg-gray-900/50 text-left">
                <div className="flex flex-wrap">
                  <div className="w-1/2 text-cyan-400 font-semibold">Username:</div>
                  <div className="w-1/2 text-cyan-300">{user.firstname} {user.lastname}</div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-1/2 text-cyan-400 font-semibold">Status:</div>
                  <div    onClick={()=>handleActivation(user.user, user.is_active)} className="w-1/2">
                    <span
                 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-red-400/10 text-red-400 animate-pulse'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-1/2 text-cyan-400 font-semibold">Country:</div>
                  <div className="w-1/2 text-cyan-300">{user.country}</div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-1/2 text-cyan-400 font-semibold">Phone:</div>
                  <div className="w-1/2 text-cyan-300 font-mono">{user.phone_number}</div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-1/2 text-cyan-400 font-semibold">City:</div>
                  <div className="w-1/2 text-cyan-300">{user.city}</div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-1/2 text-cyan-400 font-semibold">State:</div>
                  <div className="w-1/2 text-cyan-300">{user.state}</div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-1/2 text-cyan-400 font-semibold">Address:</div>
                  <div className="w-1/2 text-cyan-300 max-w-xs truncate">{user.address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  
  );
};

export default NeonTable;