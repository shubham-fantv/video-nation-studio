import React, { useEffect, useState, useRef } from "react";
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
import SweetAlert2 from "react-sweetalert2";

const Index = ({ masterData }) => {
  const [template, setTemplate] = useState([]);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [tool, setTool] = useState("");
  const [avatar, setAvatar] = useState("");
  const [voice, setVoice] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [captionEnabled, setCaptionEnabled] = useState("");
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  
  const [image, setImage] = useState("");  
  const [newImage, setNewImage] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [swalProps, setSwalProps] = useState({});
  const { userData } = useSelector((state) => state.user);
  const { sendEvent } = useGTM();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [showUploadPopup, setShowUploadPopup] = useState(true);
const fileInputRef = useRef(null);


  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    console.log("Selected avatar:", avatar);
  };


  const [subTitle, setSubTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const aspectRatioData = ["16:9", "9:16", "1:1"];
  const { slug, id } = router.query;
  
  const aspectRatioSizeMap = {
    "1:1": "w-4 h-4",
    "4:5": "w-10 h-12",
    "9:16": "w-3 h-4",
    "16:9": "w-4 h-3",
  };

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
      setImageUrl(response?.data?.data?.[0]?.url);
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
       setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImagePreview(null);
  };

  const { mutate: generateImageApi } = useMutation(
    (obj) => fetcher.post(`${FANTV_API_URL}/api/v1/ai-image/upgrade`, obj),
    {
      onSuccess: (response) => {
        //console.log("I AM HERE", response?.data);
        setImagePreview(null);
        setImageUrl(null);
        setPrompt("");
        setLoading(false);
        //console.log("I AM HERE", response?.data._id);
        router.replace(`/upgrade-image/enhance?id=${response?.data._id}`,undefined, { scroll: false });
        //router.reload();
      },
      onError: (error) => {
        setLoading(false);
        //alert("I AM HERE");
        alert(error.response.data.message);
      },
    }
  );

  const handleEdit = () => {
    //console.log(template);
    router.push(`/edit-image/${slug}`);
  };


  const handleConfirm = () => {
    //console.log(template);
  };

  const onClose = () => {
    setShowUploadPopup(false);
    handleUpgradeImage();
  };


  const onCancel = () => {
    setShowUploadPopup(false);
    router.back();
  };

  const handleUpgradeImage = () => {
  
    sendEvent({
      event: "Upgrade Image Slug",
      slug: slug,
      email: userData?.email,
      name: userData?.name,
      prompt: prompt,
      aspectRatio: aspectRatio
    });

    const requestBody = {
      prompt : "enhance this image",
      imageInput: imageUrl ? [encodeURI(decodeURI(imageUrl))] : [],
      creditsUsed: 1,
      aspectRatio: aspectRatio,
      ...(imageUrl && { imageUrl: encodeURI(decodeURI(imageUrl)) }),  // ✅ encode URL with spaces
      tool : slug,
    };

    //console.log(requestBody);
    setLoading(true)
    //alert(JSON.stringify(requestBody, null, 2));

    generateImageApi(requestBody);
  };

  useEffect(() => {
    console.log("I am in useEffect blank ",slug, "id=",id);
    if (id ? setShowUploadPopup(false) : setShowUploadPopup(true));

    const pickRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSubTitle(quotes[randomIndex]);
    };
    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);
  
    const cookies = parseCookies();
    setAuthToken(cookies.aToken); // or any key you're tracking

    
    
    return () => clearInterval(interval);
  }, []);

  
  // Fetch new data on ID change
  useEffect(() => {
    console.log("I AM inside useEffect", slug, "id=",id);
    setTool(slug);

    if (!slug) return;

    let updatedSlug = slug;
    if (slug == "enhance") updatedSlug = id;

    if (id) {
        console.log("I AM inside Image Id", id);
        const fetchData = async () => {
        setLoading(true);
        //setImageLoading(true);

        try {
        const res = await fetcher.get(
            `${FANTV_API_URL}/api/v1/image_templates/${id}`,
            {
            headers: {
                ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
            },
            },
            "default"
        );

        const data = res?.data;
        setImageUrl(data.imageUrl);
        setImagePreview(data.imageUrl);
        setImage(data.finalImageUrl);
        } catch (e) {
        console.error(e);
        } finally {
        //await sleep(2000); // Wait for 1 second
        setLoading(false);
        //setImageLoading(false);
        }
        };

        fetchData();
        }
  }, [slug,id]);

  const handleDownloadImage = async () => {
    if (!image) return;

    sendEvent({
      event: "Home --> Recreate --> Download",
      email: userData?.email,
      name: userData?.name,
      image: newImage,
      imageUrl: image,
    });

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${newImage || "image"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row text-black md:gap-4">
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
      
      
      <div className="flex-1 flex flex-col items-center">
  {/* Back Button */}
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

  {/* Side-by-side images */}
  <div className="w-full p-4 md:px-[30px] py-4 md:py-[30px] bg-[#F5F5F5]">
    <div className="bg-[#FFFFFF0D] rounded-lg flex flex-col md:flex-row items-center justify-center mb-4 max-h-[750px] overflow-hidden">
      {/* Old Image */}
      <div className="w-full md:w-1/2 p-4">
        <h3 className="text-sm font-medium mb-2 text-center">Old Image</h3>
        <div className="w-full h-[300px] md:h-[450px] flex items-center justify-center bg-white rounded-xl overflow-hidden">
          {uploading ? (
            <span className="text-sm text-gray-400">Uploading...</span>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Old"
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-sm text-gray-500"></p>
          )}
        </div>
      </div>

      {/* New Image */}
      <div className="w-full md:w-1/2 p-4">
        <h3 className="text-sm font-medium mb-2 text-center">Enhanced Image</h3>
        <div className="w-full h-[300px] md:h-[450px] flex items-center justify-center bg-white rounded-xl overflow-hidden relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <span className="text-sm text-gray-400">Loading image...</span>
            </div>
          )}
          <img
            src={image}
            key={image}
            alt={prompt}
            onLoad={() => setImageLoading(false)}
            className={`w-full h-full object-contain transition-opacity duration-500 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 mt-2">
      <button
        onClick={handleDownloadImage}
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
      {showUploadPopup && (
            <div className="mt-30 fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Enhance Image Quality</h2>
                <button onClick={onCancel} className="text-black text-xl font-bold">&times;</button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
                <h3 className="text-xl font-semibold mb-1">
                
                </h3>
                <p className="text-gray-600 mb-6">
                Select / Upload an image and use AI to enhance its resolution, quality, and clarity
                </p>

                <label className="border border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded-lg h-48 flex flex-col justify-center items-center text-center">
            
            {uploading ? (
               <div>Uploading...</div>
             ) : (
               <>
                 {imagePreview ? (
                   <div className="relative">
                     <img
                       src={imagePreview}
                       alt="Uploaded"
                       className="w-full h-[150px] object-fit rounded-md"
                     />
                     <button
                       onClick={handleRemoveImage}
                       className="absolute top-0 right-0 bg-white text-white rounded-full w-4 h-4 flex items-center justify-center"
                     >
                       <img src="/images/close.svg" />
                     </button>
                   </div>
                 ) : (
                   <h3>Click to Upload</h3>
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
                
             {/* Continue Button */}
          {imagePreview && (
            <div className="mt-6 text-center flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Continue
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
          )}   
            </div>
            </div>
            </div>
    )}
      <SweetAlert2 {...swalProps} onConfirm={handleConfirm} />
    </div>
  );
};

export default Index;

export async function getServerSideProps(ctx) {
  const cookie = parseCookies(ctx);

  const authToken = cookie["aToken"];

  try {
    const {
      params: { slug1 },
    } = ctx;

    var [masterData] = await Promise.all([
      fetcher.get(
        `${FANTV_API_URL}/api/v1/homefeed/metadata`,
        {
          headers: {
            ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
          },
        },
        "default"
      ),
    ]); 
    
    return {
      props: {
        masterData: masterData?.data || [],
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
