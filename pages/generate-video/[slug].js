import React, { useState } from "react";
import AvatarDropdown from "../../src/component/common/AvatarDropdown";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { FANTV_API_URL } from "../../src/constant/constants";
import fetcher from "../../src/dataProvider";
import axios from "axios";

const Index = ({ masterData, template }) => {
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [avatar, setAvatar] = useState("Luke");
  const [voice, setVoice] = useState("Default");
  const [visibility, setVisibility] = useState("Public");
  const [captionEnabled, setCaptionEnabled] = useState(true);
  const [prompt, setPrompt] = useState("A girl sipping coffee on the train");
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://upload.artistfirst.in/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImage(response?.data?.data?.[0]?.url);
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const { mutate: generateVideoApi } = useMutation(
    (obj) => fetcher.post(`${FANTV_API_URL}/api/v1/ai-video`, obj),
    {
      onSuccess: (response) => {
        setImagePreview(null);
        setPrompt("");
        alert(" Success => video generation started");
      },
      onError: (error) => {
        alert(error.response.data.message);
      },
    }
  );

  const handleGenerateVideo = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    const requestBody = {
      userId: "67e634cd3712275c56272853",
      prompt,
      imageInput: image ? [image] : [],
      creditsUsed: 20,
      aspectRatio: "16:9",
      caption: captionEnabled,
    };
    generateVideoApi(requestBody);
  };

  return (
    <div className="flex text-white gap-8">
      <div className="w-64 bg-[#FFFFFF0D] p-4">
        <div className="">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm mb-6 text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>

          <h2 className="text-lg font-medium mb-4">Settings</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Prompt</h3>
            <div className="bg-[#343434] rounded-lg p-3 flex justify-between items-start">
              <textarea
                className="w-full rounded-md bg-transparent  text-sm text-[#D2D2D2] text-normal placeholder-gray-500 focus:outline-none"
                placeholder="Enter your prompt..."
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
              {/* <p className="text-sm text-gray-300">{prompt}</p> */}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Caption</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={captionEnabled}
                onChange={() => setCaptionEnabled(!captionEnabled)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Add Image</h3>
            <label className="bg-[#343434] rounded-lg w-full h-[120px] flex items-center justify-center cursor-pointer">
              {uploading ? (
                <div>Uploading...</div>
              ) : (
                <>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded"
                        className="w-full h-[120px] object-fit rounded-md"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ✖
                      </button>
                    </div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Aspect Ratio</h3>
            <div className="relative">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className=" h-[48px] block w-full rounded-md bg-[#343434] border-0 py-2 pl-3 pr-10 text-white focus:ring-0 sm:text-sm appearance-none" // Add appearance-none
              >
                {masterData?.aspectRatios?.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <AvatarDropdown data={masterData?.avatars} />
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">AI Voice</h3>
            <div className="relative ">
              <select
                value={voice}
                onChange={(e) => setVoice(e.target._id)}
                className=" h-[48px] block w-full rounded-md bg-[#343434] border-0 py-2 pl-10 pr-10 text-white focus:ring-0 sm:text-sm appearance-none"
              >
                {masterData?.voices?.map((item) => (
                  <option key={item._id}>{item?.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Visibility</h3>
            <div className="relative">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className=" h-[48px] block w-full rounded-md bg-[#343434] border-0 py-2 pl-10 pr-10 text-white focus:ring-0 sm:text-sm appearance-none"
              >
                {masterData?.visibilityOptions?.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 flex items-center mt-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            All rights reserved
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-8 bg-[#292929] px-[150px] py-[120px] ">
        <div className="w-full">
          {/* Video Preview */}
          <div className="bg-[#FFFFFF0D] rounded-lg aspect-video flex items-center justify-center mb-4">
            <div className="text-gray-500">
              <video
                src={template?.videoUrl}
                muted
                autoPlay
                poster={template?.imageUrl}
                // loop
                playsInline
                controls
                // onMouseEnter={(e) => e.target.play()}
                // onMouseLeave={(e) => e.target.pause()}
                // onEnded={(e) => e.target.play()}
                className="w-full h-full object-cover rounded-xl"
              />
              {/* <img src="/images/video-play.png " className="h-[150px] w-[150px]" /> */}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center  gap-4 mt-2">
            <button
              onClick={handleGenerateVideo}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white shadow-md transition-all hover:brightness-110"
            >
              ✨ Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

// export async function getServerSideProps(context) {
//   const masterData = await fetcher.get(`${FANTV_API_URL}/api/v1/homefeed/metadata`);

//   if (!masterData.success) {
//     return { notFound: true };
//   }

//   return {
//     props: {
//       masterData: masterData.data,
//       withSideBar: false,
//     },
//   };
// }

export async function getServerSideProps(context) {
  try {
    const {
      params: { slug },
    } = context;

    var [masterData, template] = await Promise.all([
      fetcher.get(`${FANTV_API_URL}/api/v1/homefeed/metadata`),
      fetcher.get(`${FANTV_API_URL}/api/v1/templates/${slug}`),
    ]);
    return {
      props: {
        masterData: masterData || [],
        template: template?.data || [],
        withSideBar: false,
        slug,
      },
    };
  } catch (err) {
    console.log("error occures in while getting data==>", err);
    return {
      props: {},
    };
  }
}
