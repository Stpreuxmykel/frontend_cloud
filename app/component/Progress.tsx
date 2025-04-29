// components/CircularProgressBar.js
import React from 'react';
import { FaTrophy } from "react-icons/fa";

interface CircularProgressBarProps {
  percentage: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ percentage }) => {
  const circleRadius = 50; // Radius of the circle
  const circumference = 2 * Math.PI * circleRadius; // Circumference of the circle
  const progress = (percentage / 100) * circumference; // Progress based on percentage


  return (
  

    <div className="flex mx-10 relative top-5 mt-5">
  <svg
    className="transform rotate-[-90deg] w-16 h-16"
    width="120"
    height="120"
    viewBox="0 0 120 120"
  >
    {/* Define Gradient */}
    <defs>
      <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6366F1" /> {/* indigo-500 */}
        <stop offset="50%" stopColor="#A855F7" /> {/* purple-500 */}
        <stop offset="100%" stopColor="#EC4899" /> {/* pink-500 */}
      </linearGradient>
    </defs>

    {/* Background circle */}
    <circle
      cx="60"
      cy="60"
      r={circleRadius}
      stroke="#e5e7eb" // Gray background
      strokeWidth="10"
      fill="none"
    />

    {/* Progress circle */}
    <circle
      cx="60"
      cy="60"
      r={circleRadius}
      stroke="url(#gradientStroke)" // Use the gradient
      strokeWidth="10"
      fill="none"
      strokeDasharray={circumference}
      strokeDashoffset={circumference - progress}
      className="transition-all duration-500"
    />
  </svg>

  {/* Display percentage inside the circle */}
  <div className="absolute top-5 left-4 text-sm font-semibold text-white">
    {percentage}%
  </div>
</div>


  );
  
};

export default CircularProgressBar;
