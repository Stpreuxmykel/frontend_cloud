import React from 'react';

const Card = ({ name, number, cvv, amount }) => {
    return (
        <div className="relative bg-gradient-to-r from-black via-purple-800 to-black text-white w-80 h-44 rounded-lg shadow-lg p-6 flex flex-col justify-between overflow-hidden">
          
          {/* Diagonal DHCard */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 text-gray-400 text-6xl font-bold opacity-20">
            DHCard
          </div>
          
          {/* Card Header */}
          <div className="absolute top-4 right-4 text-sm text-white">
          <span className="bg-gradient-to-r font-bold from-yellow-400 via-[#FFD700] to-yellow-600 px-2 py-1 rounded-lg">HTG</span>

          </div>
    
          {/* Card Number */}
          <div className="text-xl font-bold mt-4">
            {number}
          </div>
    
          {/* Card Name and CVV */}
          <div className="flex justify-between items-center mt-1">
            <div className="text-sm font-medium">
              {name}
            </div>
            <div className="text-sm bg-gray-600 px-2 py-1 rounded-lg">
              CVV: {cvv}
            </div>
          </div>
    
          {/* Amount */}
          <div className="text-3xl font-bold">
            {amount}
          </div>
    
          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-gray-300 via-silver-100 to-transparent bg-opacity-80"></div>
        </div>
      );
    
    
};

export default Card;