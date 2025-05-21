import React from "react";

const ShimmerCard = () => (
  <div className="w-[250px] sm:w-[270px] md:w-[290px] h-[360px] bg-white rounded-xl shadow-md p-4 animate-pulse">
    <div className="w-full h-40 bg-gray-200 rounded-md mb-4"></div>
    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
    <div className="h-4 w-5/6 bg-gray-200 rounded mb-4"></div>
    <div className="h-10 w-32 bg-gray-300 rounded-full mt-auto"></div>
  </div>
);

const ShimmerCategories = () => {
  return (
    <div className="">
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default ShimmerCategories;
