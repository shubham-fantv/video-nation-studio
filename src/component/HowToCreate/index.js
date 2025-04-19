import React from "react";

const HowToCreate = () => {
  return (
    <div>
      <h1 className="text-2xl text-black font-bold mb-2">Steps to create a video</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6  pt-6">
        {/* Step 1 */}
        <div className="bg-[#292929] rounded-lg px-6 pt-6 relative border border-[#FFFFFF26] ">
          <h2 className="text-base text-white font-semibold mb-4">Step 1</h2>

          <img src={"/images/step1.png"} />
        </div>

        {/* Step 2 */}
        <div className="bg-[#292929] rounded-lg px-6 pt-6  relative border-2 border-[#FFFFFF26]">
          <h2 className="text-base font-semibold mb-4 text-white ">Step 2</h2>

          <img src={"/images/step2.png"} />
        </div>

        {/* Step 3 */}
        <div className="bg-[#292929] rounded-lg px-6 pt-6  relative border-2 border-[#FFFFFF26]">
          <h2 className="text-base font-semibold mb-4 text-white ">Step 3</h2>

          <img src={"/images/step3.png"} />
        </div>
      </div>
    </div>
  );
};

export default HowToCreate;
