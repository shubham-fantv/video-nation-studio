import React from "react";

const AIAvatarSteps = () => {
  const uploadedPhotos = [
    "/images/headshot/photo1.png",
    "/images/headshot/photo2.png",
    "/images/headshot/photo3.png",
    "/images/headshot/photo4.png",
  ];

  const aiGeneratedImages = [
    "/images/headshot/ai1.png",
    "/images/headshot/ai2.png",
    "/images/headshot/ai3.png",
    "/images/headshot/ai4.png",
    "/images/headshot/ai5.png",
    "/images/headshot/ai6.png",
    "/images/headshot/ai7.png",
    "/images/headshot/ai8.png",
  ];

  return (
    <div className="w-full mx-auto  mt-8 ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Steps to Generate AI Avatar</h2>

      <div className="  bg-[#F6F4FF] rounded-xl p-6 border-2 border-[#E4DDFF]">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#1E1E1E] mb-1">Step 01</h3>
          <p className="text-sm text-[#1E1E1EB2] mb-3">Upload a few photos</p>
          <div className="flex gap-3">
            {uploadedPhotos.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Upload ${index + 1}`}
                className="w-16 h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#1E1E1E] mb-1">Step 02</h3>
          <p className="text-sm text-[#1E1E1EB2] mb-3">Our AI trains on your looks</p>
          <div className="flex flex-wrap gap-4">
            {aiGeneratedImages.slice(0, 4).map((src, index) => (
              <div key={index} className="relative ">
                <img
                  src={src}
                  alt={`AI Generated ${index + 1}`}
                  className="w-40 h-40 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-[#1E1E1E] mb-1">Step 03</h3>
          <p className="text-sm text-[#1E1E1EB2] mb-3">Headshot ready in 30 minutes</p>
          <div className="flex flex-wrap gap-4">
            {aiGeneratedImages.slice(4).map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`AI Generated ${index + 5}`}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <span
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.5) 100%)",
                    backdropFilter: "blur(34px)",
                    boxShadow: "0px 0px 4px 0px #00000073",
                    border: "1px solid #FFFFFF73",
                  }}
                  className="absolute left-4 right-4 ` bottom-2 transform   text-base text-white px-2 py-0.5 rounded-xl"
                >
                  AI generated
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAvatarSteps;
