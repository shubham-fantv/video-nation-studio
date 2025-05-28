import React from "react";

const BadPhotos = () => {
  return (
    <div className="w-full mx-auto bg-[#FFF8F8] rounded-xl p-6 mt-6 border-2 border-[#F0E4E4]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#1E1E1E] text-base font-semibold"> Bad Photos</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {`No group photos, hats, sunglasses, pets, heavy filters, low-resolution images, or
        screenshots. Avoid photos that are too old, overly edited, or don’t represent how you
        currently look.`}
      </p>
      <div className="flex gap-4 overflow-x-auto">
        <img
          key={1}
          src={`https://assets.artistfirst.in/uploads/1747915251733-Bad_Avatar_1.jpg`}
          className="w-[100px] h-30 rounded-md object-cover border border-red-500"
          alt="bad photo"
        />
        <img
          key={2}
          src={`https://assets.artistfirst.in/uploads/1747395752777-Bad_Avatar_2.jpg`}
          className="w-[100px] h-30 rounded-md object-cover border border-red-500"
          alt="bad photo"
        />
        <img
          key={3}
          src={`https://assets.artistfirst.in/uploads/1747395778037-Bad_Avatar_3.jpg`}
          className="w-[100px] h-30 rounded-md object-cover border border-red-500"
          alt="bad photo"
        />
        <img
          key={4}
          src={`https://assets.artistfirst.in/uploads/1747395795794-Bad_Avatar_4.webp`}
          className="w-[100px] h-30 rounded-md object-cover border border-red-500"
          alt="bad photo"
        />
        <img
          key={5}
          src={`https://assets.artistfirst.in/uploads/1747395814436-Bad_Avatar_5.webp`}
          className="w-[100px] h-28 rounded-md object-cover border border-red-500"
          alt="bad photo"
        />
      </div>
    </div>
  );
};

export default BadPhotos;
