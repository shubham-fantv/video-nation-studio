import React from "react";

const GoodPhotos = () => {
  return (
    <div className="w-full mx-auto bg-[#F5FFF8] rounded-xl p-6 mt-6 border-2 border-[#CFE9D8]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#1E1E1E] text-base font-semibold"> Good Photos</span>
      </div>
      <p className="text-sm text-[#1E1E1EB2] mb-3">
        Recent photos of yourself (just you), showing a mix of close-ups and full-body shots, with
        different angles, expressions (smiling, neutral, serious), and a variety of outfits. Make
        sure they are high-resolution and reflect your current appearance.
      </p>
      <div className="flex gap-4 overflow-x-auto">
        <img
          key={1}
          src={`https://assets.artistfirst.in/uploads/1747396154317-Good_Avatar_1.webp`}
          className="w-[100px] h-30 rounded-md object-cover border border-green-500"
          alt="good photo"
        />
        <img
          key={2}
          src={`https://assets.artistfirst.in/uploads/1747396178612-Good_Avatar_2.webp`}
          className="w-[100px] h-30 rounded-md object-cover border border-green-500"
          alt="good photo"
        />
        <img
          key={3}
          src={`https://assets.artistfirst.in/uploads/1747396196125-Good_Avatar_3.webp`}
          className="w-[100px] h-30 rounded-md object-cover border border-green-500"
          alt="good photo"
        />
        <img
          key={4}
          src={`https://assets.artistfirst.in/uploads/1747396217107-Good_Avatar_4.webp`}
          className="w-[100px] h-30 rounded-md object-cover border border-green-500"
          alt="good photo"
        />
        <img
          key={5}
          src={`https://assets.artistfirst.in/uploads/1747396229542-Good_Avatar_5.webp`}
          className="w-[100px] h-30 rounded-md object-cover border border-green-500"
          alt="good photo"
        />
      </div>
    </div>
  );
};

export default GoodPhotos;
