// import React, { useEffect, useState } from "react";
// import AvatarDropdown from "../../src/component/common/AvatarDropdown";
// import { useRouter } from "next/router";
// import { useMutation, useQuery } from "react-query";
// import { FANTV_API_URL } from "../../src/constant/constants";
// import fetcher from "../../src/dataProvider";
// import axios from "axios";
// import Loading from "../../src/component/common/Loading/loading";
// import { quotes } from "../../src/utils/common";
// import { parseCookies } from "nookies";

// const Index = ({ masterData, template }) => {
//   const [aspectRatio, setAspectRatio] = useState("16:9");
//   const [avatar, setAvatar] = useState("Luke");
//   const [voice, setVoice] = useState("Default");
//   const [visibility, setVisibility] = useState("Public");
//   const [captionEnabled, setCaptionEnabled] = useState(true);
//   const [prompt, setPrompt] = useState(template?.prompt);
//   const router = useRouter();
//   const [imagePreview, setImagePreview] = useState(template?.imageUrl);
//   const [uploading, setUploading] = useState(false);
//   const [image, setImage] = useState(template?.imageUrl);

//   const [subTitle, setSubTitle] = useState("");
//   const [isLoading, setLoading] = useState(false);

//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post("https://upload.artistfirst.in/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setImage(response?.data?.data?.[0]?.url);
//       setImagePreview(URL.createObjectURL(file));
//     } catch (error) {
//       console.error("Upload failed", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImagePreview(null);
//   };

//   const { mutate: generateVideoApi } = useMutation(
//     (obj) => fetcher.post(`${FANTV_API_URL}/api/v1/ai-video`, obj),
//     {
//       onSuccess: (response) => {
//         setImagePreview(null);
//         setPrompt("");
//         alert(" Success => video generation started");
//         setLoading(false);
//       },
//       onError: (error) => {
//         setLoading(false);
//         alert(error.response.data.message);
//       },
//     }
//   );

//   const handleEdit = () => {
//     console.log(template);
//     router.push(`/edit-video/${template?._id}`);
//   };

//   const handleGenerateVideo = () => {
//     if (!prompt.trim()) {
//       alert("Please enter a prompt!");
//       return;
//     }

//     const requestBody = {
//       prompt,
//       imageInput: image ? [image] : [],
//       creditsUsed: 20,
//       aspectRatio: aspectRatio,
//       caption: captionEnabled,
//     };
//     setLoading(true);
//     generateVideoApi(requestBody);
//   };

//   useEffect(() => {
//     const pickRandomQuote = () => {
//       const randomIndex = Math.floor(Math.random() * quotes.length);
//       setSubTitle(quotes[randomIndex]);
//     };
//     pickRandomQuote();
//     const interval = setInterval(pickRandomQuote, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleDownloadVideo = async () => {
//     if (!template?.videoUrl) return;

//     try {
//       const response = await fetch(template.videoUrl);
//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "video.mp4";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Failed to download video:", error);
//     }
//   };
//   return (
//     <div className="flex text-black gap-8">
//       {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
//       <div className="w-64 bg-[#FFFFFF0D] p-4">
//         <div className="">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-sm mb-4 text-black"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Back
//           </button>

//           {/* <h2 className="text-lg font-medium mb-4">Settings</h2> */}

//           <div className="mb-6">
//             <div className="flex justify-between">
//               <h3 className="text-sm font-medium mb-2">Prompt</h3>
//               <div className="flex items-center justify-between mb-4">
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={captionEnabled}
//                     onChange={() => setCaptionEnabled(!captionEnabled)}
//                     className="sr-only peer"
//                   />
//                   <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
//                 </label>
//                 <span className="text-sm font-medium pl-2">Caption</span>
//               </div>
//             </div>

//             <div className="bg-[#F5F5F5] rounded-lg p-3 flex justify-between items-start">
//               <textarea
//                 className="w-full rounded-md bg-transparent  text-sm text-[#1E1E1EB2] text-normal placeholder-gray-500 focus:outline-none"
//                 placeholder="Enter your prompt..."
//                 rows={5}
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//               ></textarea>
//               {/* <p className="text-sm text-gray-300">{prompt}</p> */}
//             </div>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-sm font-medium mb-2">Add Image</h3>
//             <label className="bg-[#F5F5F5] rounded-lg w-[72px] h-[50px] flex items-center justify-center cursor-pointer">
//               {uploading ? (
//                 <div>Uploading...</div>
//               ) : (
//                 <>
//                   {imagePreview ? (
//                     <div className="relative">
//                       <img
//                         src={imagePreview}
//                         alt="Uploaded"
//                         className="w-full h-[50px] object-fit rounded-md"
//                       />
//                       <button
//                         onClick={handleRemoveImage}
//                         className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
//                       >
//                         ✖
//                       </button>
//                     </div>
//                   ) : (
//                     <img src="/images/icons/plus.svg" />
//                   )}
//                 </>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageUpload}
//                 disabled={uploading}
//               />
//             </label>
//           </div>

//           <div className="mb-4">
//             <h3 className="text-sm font-medium mb-2">Aspect Ratio</h3>
//             <div className="relative">
//               <select
//                 value={aspectRatio}
//                 onChange={(e) => setAspectRatio(e.target.value)}
//                 className=" h-[48px] block w-full rounded-md bg-[#F5F5F5] border-0 py-2 pl-3 pr-10 text-[#1E1E1EB2] focus:ring-0 sm:text-sm appearance-none" // Add appearance-none
//               >
//                 {masterData?.aspectRatios?.map((item) => (
//                   <option key={item}>{item}</option>
//                 ))}
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 text-gray-400"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//           {template?.avatar && (
//             <div className="mb-4">
//               <AvatarDropdown data={masterData?.avatars} />
//             </div>
//           )}

//           {template?.voice && (
//             <div className="mb-4">
//               <h3 className="text-sm font-medium mb-2">AI Voice</h3>
//               <div className="relative ">
//                 <select
//                   value={voice}
//                   onChange={(e) => setVoice(e.target._id)}
//                   className=" h-[48px] block w-full rounded-md bg-[#343434] border-0 py-2 pl-10 pr-10 text-white focus:ring-0 sm:text-sm appearance-none"
//                 >
//                   {masterData?.voices?.map((item) => (
//                     <option key={item._id}>{item?.name}</option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 text-white"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-gray-400"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           )}

//           {template?.visibility && (
//             <div className="mb-4">
//               <h3 className="text-sm font-medium mb-2">Visibility</h3>
//               <div className="relative">
//                 <select
//                   value={visibility}
//                   onChange={(e) => setVisibility(e.target.value)}
//                   className=" h-[48px] block w-full rounded-md bg-[#343434] border-0 py-2 pl-10 pr-10 text-white focus:ring-0 sm:text-sm appearance-none"
//                 >
//                   {masterData?.visibilityOptions?.map((item) => (
//                     <option key={item}>{item}</option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 text-white"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 text-gray-400"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex items-center justify-center  gap-4 mt-2 ">
//             <button
//               onClick={handleGenerateVideo}
//               className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white shadow-md transition-all hover:brightness-110"
//             >
//               ✨ Generate
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col items-center p-8 bg-[#F5F5F5] px-[80px] py-[80px] ">
//         <div className="w-full">
//           <div className="bg-[#FFFFFF0D] rounded-lg aspect-video flex items-center justify-center mb-4 m-auto max-h-[450px]">
//             <div className="text-gray-500 ">
//               <video
//                 src={template?.videoUrl}
//                 muted
//                 autoPlay
//                 poster={template?.imageUrl}
//                 playsInline
//                 controls
//                 // onMouseEnter={(e) => e.target.play()}
//                 // onMouseLeave={(e) => e.target.pause()}
//                 // onEnded={(e) => e.target.play()}
//                 className="w-full h-full object-contain rounded-xl max-h-[450px]"
//               />
//               {/* <img src="/images/video-play.png " className="h-[150px] w-[150px]" /> */}
//             </div>
//           </div>

//           <div className="flex items-center justify-center  gap-4 mt-2">
//             <button
//               onClick={handleDownloadVideo}
//               className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white shadow-md transition-all hover:brightness-110"
//             >
//               ✨ Download
//             </button>
//             <button
//               onClick={handleEdit}
//               className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white shadow-md transition-all hover:brightness-110"
//             >
//               Edit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;

// export async function getServerSideProps(ctx) {
//   const cookie = parseCookies(ctx);

//   const authToken = cookie["aToken"];

//   try {
//     const {
//       params: { slug },
//     } = ctx;

//     var [masterData, template] = await Promise.all([
//       fetcher.get(
//         `${FANTV_API_URL}/api/v1/homefeed/metadata`,
//         {
//           headers: {
//             ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
//           },
//         },
//         "default"
//       ),
//       fetcher.get(
//         `${FANTV_API_URL}/api/v1/templates/${slug}`,
//         {
//           headers: {
//             ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
//           },
//         },
//         "default"
//       ),
//     ]);
//     return {
//       props: {
//         masterData: masterData?.data || [],
//         template: template?.data || [],
//         slug,
//         withSideBar: false,
//       },
//     };
//   } catch (err) {
//     console.log("error occures in while getting data==>", err);
//     return {
//       props: {
//         withSideBar: false,
//       },
//     };
//   }
// }

import React, { useEffect, useState } from "react";
import AvatarDropdown from "../../src/component/common/AvatarDropdown";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { FANTV_API_URL } from "../../src/constant/constants";
import fetcher from "../../src/dataProvider";
import axios from "axios";
import Loading from "../../src/component/common/Loading/loading";
import { quotes } from "../../src/utils/common";
import { parseCookies } from "nookies";
import { useSelector } from "react-redux";
import useGTM from "../../src/hooks/useGTM";

const Index = ({ masterData, template, slug }) => {
  const [aspectRatio, setAspectRatio] = useState(template?.aspectRatio);
  const [avatar, setAvatar] = useState(template?.avatarId);
  const [voice, setVoice] = useState(template?.voiceId || "Default");
  const [visibility, setVisibility] = useState("Public");
  const [captionEnabled, setCaptionEnabled] = useState(template?.caption);
  const [prompt, setPrompt] = useState(template?.prompt);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(template?.imageUrl);
  
  const { userData } = useSelector((state) => state.user);
  const { sendEvent } = useGTM();

  const [subTitle, setSubTitle] = useState("");
  const [isLoading, setLoading] = useState(false);

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
        setLoading(false);
      },
      onError: (error) => {
        setLoading(false);
        alert(error.response.data.message);
      },
    }
  );

  const handleEdit = () => {
    console.log(template);
    router.push(`/edit-video/${template?._id}`);
  };

  const handleGenerateVideo = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }
    sendEvent({
      event: "Generate Video Slug",
      slug: slug,
      email: userData?.email,
      name: userData?.name,
      prompt: prompt,
      aspectRatio: aspectRatio,
      caption: captionEnabled,
    });

    const requestBody = {
      prompt,
      imageInput: image ? [image] : [],
      imageUrl: image ? image : "",
      creditsUsed: 20,
      aspectRatio: aspectRatio,
      caption: captionEnabled,
    };
    console.log(requestBody);
    setLoading(true);
    generateVideoApi(requestBody);
  };

  useEffect(() => {
    
    const pickRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSubTitle(quotes[randomIndex]);
    };
    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);
  
    return () => clearInterval(interval);
  }, []);

  const handleDownloadVideo = async () => {
    if (!template?.videoUrl) return;

    sendEvent({
      event: "Home --> Recreate --> Download",
      email: userData?.email,
      name: userData?.name,
      video: video?._id,
      videoUrl: template?.videoUrl,
      category: activeSlug,
    });

    try {
      const response = await fetch(template.videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download video:", error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row text-black md:gap-4">
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
      <div className="w-full md:w-64 bg-[#FFFFFF0D] p-4">
        <div className="">
          <div className="mb-4">
            <div className="flex justify-between flex-wrap">
              <h3 className="text-sm font-medium mb-2">Prompt</h3>
              <div className="flex items-center justify-between mb-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={captionEnabled}
                    onChange={() => setCaptionEnabled(!captionEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <span className="text-sm font-medium pl-2">Caption</span>
              </div>
            </div>

            <div className="bg-[#F5F5F5] rounded-lg p-3 flex justify-between items-start">
              <textarea
                className="w-full rounded-md bg-transparent text-sm text-[#1E1E1EB2] text-normal placeholder-gray-500 focus:outline-none"
                placeholder="Enter your prompt..."
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Add Image</h3>
            <label className="bg-[#F5F5F5] text-xs rounded-lg w-[72px] h-[50px] flex items-center justify-center cursor-pointer">
              {uploading ? (
                <div>Uploading...</div>
              ) : (
                <>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded"
                        className="w-full h-[50px] object-fit rounded-md"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-white text-white rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        <img src="/images/close.svg" />
                      </button>
                    </div>
                  ) : (
                    <img src="/images/icons/plus.svg" />
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
                className="h-[48px] block w-full rounded-md bg-[#F5F5F5] border-0 py-2 pl-3 pr-10 text-[#1E1E1EB2] focus:ring-0 sm:text-sm appearance-none"
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
          {(
            <div className="mb-4">
              <AvatarDropdown data={masterData?.avatars} />
            </div>
          )}

          {(
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">AI Voice</h3>
              <div className="relative ">
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target._id)}
                  className="h-[48px] block w-full rounded-md bg-[#F5F5F5] border-0 py-2 pl-10 pr-10 text-[#1E1E1EB2] focus:ring-0 sm:text-sm appearance-none"
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
          )}

          {template?.visibility && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Visibility</h3>
              <div className="relative">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="h-[48px] block w-full rounded-md bg-[#F5F5F5] border-0 py-2 pl-10 pr-10 text-[#1E1E1EB2]  focus:ring-0 sm:text-sm appearance-none"
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
          )}

          <div className="flex items-center justify-center gap-4 mt-2 mb-4">
            <button
              onClick={handleGenerateVideo}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all hover:brightness-110 text-sm md:text-base"
            >
              ✨ Generate
            </button>
          </div>
          <h3 className="text-sm text-[#1E1E1EB2] text-normal">Credits : 20</h3>

        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center ">
      <div className="w-full md:p-4 bg-[#F5F5F5]">
                  <button
                      onClick={() => router.back()}
                      className="flex items-center text-sm mb-1 text-black"
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
          </div>
          <div className="w-full p-4 md:p-4 bg-[#F5F5F5] px-4 md:px-[30px] py-4 md:py-[30px]">
            
          <div className="bg-[#FFFFFF0D] rounded-lg aspect-video flex items-center justify-center mb-4 m-auto max-h-[300px] md:max-h-[450px]">
            <div className="text-gray-500 w-full h-full">
              <video
                src={template?.videoUrl}
                muted
                autoPlay
                poster={template?.imageUrl}
                playsInline
                controls
                className="w-full h-full object-contain rounded-xl max-h-[300px] md:max-h-[450px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 mt-2">
            <button
              onClick={handleDownloadVideo}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all hover:brightness-110 text-sm md:text-base"
            >
              ✨ Download
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all hover:brightness-110 text-sm md:text-base"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

export async function getServerSideProps(ctx) {
  const cookie = parseCookies(ctx);

  const authToken = cookie["aToken"];

  try {
    const {
      params: { slug },
    } = ctx;

    var [masterData, template] = await Promise.all([
      fetcher.get(
        `${FANTV_API_URL}/api/v1/homefeed/metadata`,
        {
          headers: {
            ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
          },
        },
        "default"
      ),
      fetcher.get(
        `${FANTV_API_URL}/api/v1/templates/${slug}`,
        {
          headers: {
            ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
          },
        },
        "default"
      ),
    ]);
    console.log("template",template?.data)
    return {
      props: {
        masterData: masterData?.data || [],
        template: template?.data || [],
        slug,
        withSideBar: false,
      },
    };
  } catch (err) {
    console.log("error occures in while getting data==>", err);
    return {
      props: {
        withSideBar: false,
      },
    };
  }
}
