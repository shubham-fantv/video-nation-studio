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
import LoginAndSignup from "../../src/component/feature/Login";
const Index = ({ masterData }) => {
  const SLUG_CONFIG = {
    "enhance": {
        title: "Enhance Image Quality",
        description: "Instantly elevate your images with AI for professional clarity and vibrancy",
        prompt: "Enhance Image Quality",
        imageModel : 1,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "",
    },
    "background-remove": {
        title: "Remove the backgroud",
        description: "Get a clean, transparent background in seconds to perfectly isolate your subject",
        prompt: "Remove the backgroud",
        imageModel : 1,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "",
    },
    "change-outfit": {
        title: "Cloth Swap",
        description: "Virtually explore new fashion styles by swapping outfits",
        prompt: "Cloth Swap",
        imageModel : 2,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "Upload Cloth",
    },
    "ai-deblur": {
        title: "AI Deblur",
        description: "Rescue your blurry memories and achieve crystal-clear focus",
        prompt: "AI Deblur",
        imageModel : 1,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "",
    },
    "ai-face-swap": {
        title: "Face Swap",
        description: "Seamlessly integrate faces into new images with professional-grade precision",
        prompt: "Face Swap",
        imageModel : 2,
        fileCaption1 : "Upload Face 1",
        fileCaption2 : "Upload Face 2",
    },
    "cyberpunk": {
        title: "Cyberpunk Style Image",
        description: "Immerse your images in a neon-drenched, futuristic cyberpunk world",
        prompt: "Cyberpunk Style Image",
        imageModel : 1,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "",
    },
    "ghibli": {
        title: "Ghibli Art Photo",
        description: "Evoke the beloved, hand-crafted aesthetic of Ghibli art from any picture",
        prompt: "Ghibli Art Photo",
        imageModel : 1,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "",
    },
    "anime": {
        title: "Anime Style Art",
        description: "Effortlessly generate distinct anime-style visuals",
        prompt: "Anime Style Art",
        imageModel : 1,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "",
    },
    "cartoon": {
        title: "Cartoonize Your Image",
        description: "Instantly 'cartoonify' your photos for a playful and artistic new look",
        prompt: "Cartoonize Your Image",
        imageModel : 1,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "",
    },
    "product-ad": {
        title: "Product Placement Ad",
        description: "Generate stunning, professional AI product photos that captivate customers",
        prompt: "Product Placement Ad",
        imageModel : 2,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "Upload Product",
    },
    "album-art": {
        title: "Create Album Art",
        description: "Craft compelling album covers that capture your music's essence",
        prompt: "Create Album Art",
        imageModel : 1,
        fileCaption1 : "Upload Picture",
        fileCaption2 : "",
    },
    // Add more slug configs as needed...
    };
  const [template, setTemplate] = useState([]);
  const lastTrialAction = localStorage.getItem("lastTrialAction");
  const RATE_LIMIT_INTERVAL_MS = 1 * 1000; // 12 hours
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [tool, setTool] = useState("");
  const [avatar, setAvatar] = useState("");
  const [voice, setVoice] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [captionEnabled, setCaptionEnabled] = useState("");
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState("");
  
  const [imagePreview2, setImagePreview2] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [uploading, setUploading] = useState(false);

  const [imageModel, setImageModel] = useState(1);
  const [uploading2, setUploading2] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  
  const [image, setImage] = useState("");  
  const [newImage, setNewImage] = useState("");
  const [popUpTitle, setPopUpTitle] = useState("");
  const [popUpDescription, setPopUpDescription] = useState("");
  const [fileCaption1, setFileCaption1] = useState("");
  const [fileCaption2, setFileCaption2] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [swalProps, setSwalProps] = useState({});
  const { sendEvent } = useGTM();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const { isLoggedIn, userData } = useSelector((state) => state.user);
  
  const [showUploadPopup, setShowUploadPopup] = useState(true);
const fileInputRef = useRef(null);



  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    //console.log("Selected avatar:", avatar);
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

  const handleImageUpload2 = async (event, faceIndex) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    if (faceIndex === 1) setUploading(true);
    else setUploading2(true);
  
    try {
      const response = await axios.post("https://upload.artistfirst.in/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const imageUrl = response?.data?.data?.[0]?.url;
      const preview = URL.createObjectURL(file);
  
      if (faceIndex === 1) {
        setImagePreview(preview);
        setImageUrl(imageUrl);
        // store imageUrl1 if needed
      } else {
        setImagePreview2(preview);
        setImageUrl2(imageUrl);
        // store imageUrl2 if needed
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      if (faceIndex === 1) setUploading(false);
      else setUploading2(false);
    }
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

  const handleRemoveImage2 = (faceIndex) => {
    if (faceIndex === 1) {setImagePreview("");setImageUrl(null);}
    else {setImagePreview2("");setImageUrl2(null);}
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
        setImagePreview2(null);
        setImageUrl2(null);
        setPrompt("");
        setLoading(false);
        if (userData?.isTrialUser) {
            localStorage.setItem("lastTrialAction", Date.now().toString());
          }
        //console.log("I AM HERE", response?.data._id);
        router.replace(`/upgrade-image/${tool}?id=${response?.data._id}`,undefined, { scroll: false });
        //router.reload();
      },
      onError: (error) => {
        setLoading(false);
        const defaultMessage = "Something went wrong. Please try again later.";
      
        const message =
          error?.response?.data?.message ||
          error?.message ||
          defaultMessage;
      
        setSwalProps({
            key: Date.now(), // or use a counter
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
        });
      },
    }
  );



  const { mutate: generateImageApiNew } = useMutation(
    (obj) => fetcher.post(`${FANTV_API_URL}/api/v1/ai-image`, obj),
    {
      onSuccess: (response) => {
        //console.log("I AM HERE", response?.data);
        setImagePreview(null);
        setImageUrl(null);
        setImagePreview2(null);
        setImageUrl2(null);
        setPrompt("");
        setLoading(false);
        if (userData?.isTrialUser) {
            localStorage.setItem("lastTrialAction", Date.now().toString());
          }
        //console.log("I AM HERE", response?.data._id);
        router.replace(`/upgrade-image/${tool}?id=${response?.data._id}`,undefined, { scroll: false });
        //router.reload();
      },
      onError: (error) => {
        setLoading(false);
        const defaultMessage = "Something went wrong. Please try again later.";
      
        const message =
          error?.response?.data?.message ||
          error?.message ||
          defaultMessage;
      
        setSwalProps({
            key: Date.now(), // or use a counter
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
        });
      },
    }
  );


  const handleEdit = () => {
    alert("Coming Soon");
    //console.log(template);
    //router.push(`/edit-image/${slug}`);
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
    if (isLoggedIn) {
        if (!prompt.trim()) {
          alert("Please enter a prompt!");
          return;
        }
     
    if (userData.credits <= 0 || userData.credits < 1) {
        setSwalProps({
          key: Date.now(), // or use a counter  
          show: true,
          title: `⏳ You only have ${userData.credits} Credits Left!`,
          text: "Upgrade now to buy Credits, unlock HD, pro voices, and longer videos.",
          confirmButtonText: "View Plans",
          showCancelButton: true,
          icon: "warning",
          preConfirm: () => {
            router.push("/subscription");
          }
        });
        } else {
            if (userData?.isTrialUser) {
               
              const lastActionTime = parseInt(localStorage.getItem("lastTrialAction") || 0, 10);
              const now = Date.now();
            
              if (now - lastActionTime < RATE_LIMIT_INTERVAL_MS) {
                const waitTime = Math.ceil((RATE_LIMIT_INTERVAL_MS - (now - lastActionTime)) / 1000 / 60);
                setSwalProps({
                  key: Date.now(), // or use a counter  
                  show: true,
                  title: "⏳ Please wait",
                  text: `Free users can generate only one image every 12 hours. Try again in ${waitTime} mins. Upgrade now to unlock unlimited generation and HD quality`,
                  icon: "info",
                  confirmButtonText: "View Plans",
                  showCancelButton: true,
                  preConfirm: () => {
                    router.push("/subscription");
                  },
                  preDeny: () => {
                    router.push("/image-studio");
                  },
                });
                return;
              } else {
                sendEvent({
                    event: "Upgrade Image Slug",
                    slug: slug,
                    email: userData?.email,
                    name: userData?.name,
                    prompt: prompt,
                    aspectRatio: aspectRatio
                  });
              
                  const requestBody = {
                    prompt : prompt,
                    imageInput: imageUrl ? [encodeURI(decodeURI(imageUrl))] : [],
                    creditsUsed: 1,
                    aspectRatio: aspectRatio,
                    ...(imageUrl && { imageUrl: encodeURI(decodeURI(imageUrl)) }),  // ✅ encode URL with spaces
                    ...(imageUrl2 && { imageUrl2: encodeURI(decodeURI(imageUrl2)) }),  // ✅ encode URL with spaces
                    style : slug,
                  };
              
                  //console.log(requestBody);
                  setLoading(true)
                  //alert(JSON.stringify(requestBody, null, 2));
                  const animeSlugs = ["cyberpunk", "ghibli", "anime", "cartoon"];
                  const isAnimeSlug = animeSlugs.includes(slug);
                  if(isAnimeSlug){
                    // console.log("Calling new API for anime slug", requestBody);
                    generateImageApiNew(requestBody);
                  }
                  else{
                    requestBody.tool = slug;
                    generateImageApi(requestBody);
                  }
              }


      } else {

    sendEvent({
      event: "Upgrade Image Slug",
      slug: slug,
      email: userData?.email,
      name: userData?.name,
      prompt: prompt,
      aspectRatio: aspectRatio
    });

    const requestBody = {
      prompt : prompt,
      imageInput: imageUrl ? [encodeURI(decodeURI(imageUrl))] : [],
      creditsUsed: 1,
      aspectRatio: aspectRatio,
      ...(imageUrl && { imageUrl: encodeURI(decodeURI(imageUrl)) }),  // ✅ encode URL with spaces
      ...(imageUrl2 && { imageUrl2: encodeURI(decodeURI(imageUrl2)) }),  // ✅ encode URL with spaces
      tool : slug,
      style : slug,
    };

    //console.log(requestBody);
    setLoading(true)
    //alert(JSON.stringify(requestBody, null, 2));

    generateImageApi(requestBody);
 }}
} else {
    setIsPopupVisible(true);
  }
  };

  useEffect(() => {
    //console.log("I am in useEffect blank ",slug, "id=",id);
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
    //console.log("I AM inside useEffect", slug, "id=",id);
    if (!slug) return;

    const config = SLUG_CONFIG[slug];

    if (config) {
      setTool(slug);
      setPrompt(config.prompt);
      setPopUpTitle(config.title);
      setPopUpDescription(config.description);
      setFileCaption1(config.fileCaption1);
      setFileCaption2(config.fileCaption2);
      setImageModel(config.imageModel);
    } else {
      console.warn(`No config found for slug: ${slug}`);
    }

    if (id) {
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
        <h3 className="text-sm font-medium mb-2 text-center">New Image</h3>
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
{showUploadPopup && imageModel == 2 && (
  <div className="mt-30 fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
    <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">{popUpTitle}</h2>
        <button onClick={onCancel} className="text-black text-xl font-bold">&times;</button>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <p className="text-gray-600 mb-6">{popUpDescription}</p>

        {/* Dual Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Face 1 */}
          <div>
            <label className="border border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded-lg h-48 flex flex-col justify-center items-center text-center">
              {uploading ? (
                <div>Uploading...</div>
              ) : imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Picture 1" className="w-full h-[150px] object-cover rounded-md" />
                  <button
                    onClick={() => handleRemoveImage2(1)}
                    className="absolute top-0 right-0 bg-white text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <img src="/images/close.svg" />
                  </button>
                </div>
              ) : (
                <h3>{fileCaption1}</h3>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload2(e, 1)}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Face 2 */}
          <div>
            <label className="border border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded-lg h-48 flex flex-col justify-center items-center text-center">
              {uploading2 ? (
                <div>Uploading...</div>
              ) : imagePreview2 ? (
                <div className="relative">
                  <img src={imagePreview2} alt="Picture 2" className="w-full h-[150px] object-cover rounded-md" />
                  <button
                    onClick={() => handleRemoveImage2(2)}
                    className="absolute top-0 right-0 bg-white text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <img src="/images/close.svg" />
                  </button>
                </div>
              ) : (
                <h3>{fileCaption2}</h3>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload2(e, 2)}
                disabled={uploading2}
              />
            </label>
          </div>
        </div>

        {/* Continue Button */}
        {imagePreview && imagePreview2 && (
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

{showUploadPopup && imageModel == 1 && (
            <div className="mt-30 fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">{popUpTitle}</h2>
                <button onClick={onCancel} className="text-black text-xl font-bold">&times;</button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
                <h3 className="text-xl font-semibold mb-1">
                
                </h3>
                <p className="text-gray-600 mb-6">
                {popUpDescription}
                </p>

                <label className="border border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded-lg h-48 flex flex-col justify-center items-center text-center">
            
                {uploading ? (
                <div>Uploading...</div>
              ) : imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Face 1" className="w-full h-[150px] object-cover rounded-md" />
                  <button
                    onClick={() => handleRemoveImage()}
                    className="absolute top-0 right-0 bg-white text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <img src="/images/close.svg" />
                  </button>
                </div>
              ) : (
                <h3>{fileCaption1}</h3>
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

    {!isLoggedIn && (
        <LoginAndSignup
          callBackName={"uniqueCommunity"}
          open={!isLoggedIn}
          handleModalClose={() => router.replace("/")}
        />
      )}

    <SweetAlert2 {...swalProps} onConfirm={(handleConfirm) => setSwalProps({ show: false })} />
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
