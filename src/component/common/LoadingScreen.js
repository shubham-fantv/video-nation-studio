import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../../public/images/lottie/background-animation.json";
const LoadingScreen = ({
  progress = 20,
  mainText = "Analyzing your prompt and imagining the scenes",
  subText = "20% completed",
  autoProgress = false,
  duration = 5000,
}) => {
  const [currentProgress, setCurrentProgress] = useState(progress);

  useEffect(() => {
    if (autoProgress) {
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, duration / 100);

      return () => clearInterval(interval);
    }
  }, [autoProgress, duration]);

  useEffect(() => {
    setCurrentProgress(progress);
  }, [progress]);

  // Calculate the stroke dash array for the progress circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;

  return (
    <div className=" fixed top-[72px] left-0 w-full h-full min-h-screen bg-gray-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white relative rounded-2xl shadow-sm p-12 w-[800px] text-center">
        <div className="absolute inset-0 z-0 w-[800px]  w-full h-full overflow-hidden">
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        {/* Progress Circle */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r={radius} stroke="#e5e7eb" strokeWidth="10" fill="none" />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="10"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e879f9" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Progress percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-blue-600">
              {Math.round(currentProgress)}%
            </span>
          </div>
        </div>
        {/* Main text */}
        <h2 className="text-lg font-medium text-gray-900 mb-2">{mainText}</h2>
        {/* Sub text */}
        <p className="text-sm text-gray-500">
          {autoProgress ? `${Math.round(currentProgress)}% completed` : subText}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
