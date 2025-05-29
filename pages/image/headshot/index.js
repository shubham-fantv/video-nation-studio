import React, { useEffect, useState } from "react";
import AvatarDropdown from "../../../src/component/common/AvatarDropdown";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { API_BASE_URL, FANTV_API_URL } from "../../../src/constant/constants";
import fetcher from "../../../src/dataProvider";
import axios from "axios";
import Loading from "../../../src/component/common/Loading/loading";
import { quotes } from "../../../src/utils/common";
import { parseCookies } from "nookies";
import { useSelector } from "react-redux";
import useGTM from "../../../src/hooks/useGTM";
import SweetAlert2 from "react-sweetalert2";

import GoodPhotos from "../../../src/component/HeadShot/GoodPhotos";
import BadPhotos from "../../../src/component/HeadShot/BadPhotos";
import { useRef } from "react";
import AIAvatarSteps from "../../../src/component/HeadShot/AIAvatarSteps";

const allHeadshots = [
  "https://assets.artistfirst.in/uploads/1747722518107-Urban_Sleek_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722596046-Sunlit_Lane_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722626136-Ocean_Luxe_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722644121-Coastal_Edge._Headshot_A1jpg.jpg",
  "https://assets.artistfirst.in/uploads/1747722665915-Corp_Park_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722685634-Cruise_Deck_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722710694-Golden_Lane_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722731444-Modern_Office_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722749897-Cafe_Vibe_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722773986-Suburban_Sun_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722793576-Tree_Canopy_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722813916-Green_Belt_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722829388-Leafy_Tunnel_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722853393-Sunset_Sea_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722901407-City_Canopy_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722813916-Green_Belt_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722871243-Dappled_Walk_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747723002925-Prime_Suburb_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722934391-Grand_Avenue_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722952743-Biz_District_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747730179106-Bright_Lane_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722731444-Modern_Office_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722749897-Cafe_Vibe_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722934391-Grand_Avenue_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722934391-Grand_Avenue_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722952743-Biz_District_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747730179106-Bright_Lane_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722731444-Modern_Office_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722749897-Cafe_Vibe_Headshot_A1.jpg",
  "https://assets.artistfirst.in/uploads/1747722934391-Grand_Avenue_Headshot_A1.jpg",
].map((url, index) => ({ id: index + 1, url }));

const Index = () => {
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [image, setImage] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [swalProps, setSwalProps] = useState({});
  const { isLoggedIn, userData } = useSelector((state) => state.user);

  const [subTitle, setSubTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { slug } = router.query;

  const [selectedImages, setSelectedImages] = useState([]);

  const toggleImageSelection = (imgUrl) => {
    setSelectedImages((prev) =>
      prev.includes(imgUrl) ? prev.filter((url) => url !== imgUrl) : [...prev, imgUrl]
    );
  };

  const { mutate: generateImageApi } = useMutation(
    (obj) => fetcher.post(`${FANTV_API_URL}/api/v1/ai-image`, obj),
    {
      onSuccess: (response) => {
        setImagePreview(null);
        setImageUrl(null);
        setPrompt("");
        setLoading(false);

        router.replace(`/generate-image/${response?.data._id}`, undefined, { scroll: false });
      },
      onError: (error) => {
        setLoading(false);
        const defaultMessage = "Something went wrong. Please try again later.";
        const message = error?.response?.data?.message || error?.message || defaultMessage;
        setSwalProps({
          key: Date.now(),
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
        });
      },
    }
  );

  const handleGenerateImage = () => {
    setLoading(true);
    handleGeneratePhotoAvatar();
  };

  useEffect(() => {
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
    //console.log("IAM HERE", slug);
    if (!slug) return;

    let updatedSlug = slug;
    if (slug == "new") updatedSlug = "681c60acd91d98841219f837";

    const fetchData = async () => {
      setLoading(true);
      setImageLoading(true);

      try {
        const res = await fetcher.get(
          `${FANTV_API_URL}/api/v1/image_templates/${updatedSlug}`,
          {
            headers: {
              ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
            },
          },
          "default"
        );

        const data = res?.data;
        setPrompt(data.prompt);
        setImageUrl(data.imageUrl);
        setImagePreview(data.imageUrl);
        setImage(data.finalImageUrl);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const [imagePreviews, setImagePreviews] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const MAX_IMAGES = 12;
  const MAX_SIZE_MB = 5;
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (!files.length) return;
    // Combine with existing and check total
    const totalFiles = imagePreviews.length + files.length;
    if (totalFiles > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          alert(`"${file.name}" exceeds 2MB limit and was skipped.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("https://upload.artistfirst.in/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploadedUrl = response?.data?.data?.[0]?.url;

        if (uploadedUrl) {
          setImagePreviews((prev) => [
            ...prev,
            {
              file,
              url: uploadedUrl,
              localPreview: URL.createObjectURL(file), // for display until uploaded image loads
            },
          ]);
          setFiles((prev) => [...prev, uploadedUrl]); // ✅ Store uploaded URLs separately
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (url) => {
    setImagePreviews((prev) => prev.filter((img) => img.url !== url));
    setFiles((prev) => prev.filter((f) => f !== url)); // ✅ Also remove from files
  };

  const handleImageChange = (e) => {
    handleImageUpload(e);
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  const mainImages = allHeadshots.slice(0, 6);
  const relatedImages = allHeadshots.slice(selectedIndex * 4, selectedIndex * 4 + 5);

  const { mutate: generatePhotoAvatarApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-avatar/photo-avatar`, obj),
    {
      onSuccess: (response) => {
        setPrompt("");
        const requestBody = {
          avatarId: response?.data?._id,
          imageInput: selectedImages,
          creditsUsed: 1,
          aspectRatio: aspectRatio,
        };
        setLoading(true);
        generateImageApi(requestBody);
      },
      onError: (error) => {
        setLoading(false);
        const defaultMessage = "Something went wrong. Please try again later.";
        const message = error?.response?.data?.message || error?.message || defaultMessage;
        setSwalProps({
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
        });
      },
    }
  );

  const handleGeneratePhotoAvatar = () => {
    if (isLoggedIn) {
      let nameInput = name;

      if (!nameInput.trim()) {
        nameInput = typeof window !== "undefined" ? window.prompt("Enter avatar name:") : null;
        if (!nameInput || !nameInput.trim()) {
          alert("Upload cancelled. Name is required.");
          return;
        }
      }

      if (userData.credits <= 0) {
        router.push("/subscription");
        return;
      }

      const requestBody = {
        prompt: "Give a upper body image of the person",
        name: nameInput,
        gender: "female",
        creditsUsed: 10,
        aspectRatio: "1:1",
        ...(image && { imageUrl: image }),
        imageInput: files ? files : [],
      };
      setLoading(true);
      generatePhotoAvatarApi(requestBody);
    } else {
      setIsPopupVisible(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row text-black md:gap-4">
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
      <div className="w-full md:w-[30%] bg-[#FFFFFF0D] p-4 border-2 ml-8  rounded-xl">
        <div>
          <div>
            <div className=" text-center cursor-pointer transition mb-2">
              <div className="flex flex-col items-center">
                {imagePreviews?.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
                    {imagePreviews.map(({ url, localPreview }, idx) => (
                      <div key={idx} className="relative  mt-3">
                        <img
                          src={localPreview || url}
                          className="w-full h-16 object-cover rounded-md "
                          alt="preview"
                        />
                        <button
                          onClick={() => handleRemoveImage(url)}
                          className="absolute top-[-8px] right-[-8px] bg-[#EBEBEB] text-black rounded-full w-5 h-5   flex items-center justify-center"
                        >
                          <img className="h-2" src="/images/headshot/close.png" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleImageChange}
                  disabled={uploading}
                />
                <div className="bg-[#F5F5F5] p-6 rounded-xl w-full">
                  <div className="flex m-auto justify-center">
                    <img src="/images/headshot/gallery-add.svg" />
                  </div>
                  <p className="text-sm text-[#1E1E1E]">Select upto 12 photos to upload</p>
                  <p className="text-xs text-[#626262] mb-2 mt-4">
                    Upload PNG, JPG, HEIC, or WebP file up to 5MB each
                  </p>

                  <button
                    onClick={() => {
                      if (imagePreviews.length >= MAX_IMAGES) {
                        alert("Maximum 12 images allowed.");
                        return;
                      }
                      inputRef.current.click();
                    }}
                    disabled={uploading}
                    className="mt-3 text-[#1E1E1E] px-4 py-2 rounded-full border border-[#1E1E1E] text-base "
                  >
                    {uploading ? "Uploading..." : "Browse"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="max-w-xl mx-auto pt-3">
              <h2 className="text-sm font-medium mb-3">Select Headshot Style</h2>
              <div className="flex gap-1 overflow-x-auto mb-4">
                {mainImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`flex flex-col items-center cursor-pointer border-2 rounded-xl  ${
                      selectedIndex === idx ? "border-purple-500" : "border-transparent"
                    }`}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    <img
                      src={img.url}
                      alt={`Style ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <span className="text-xs text-[#626262] mt-1">Urban</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl mb-6">
                {relatedImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition ${
                      selectedImages.includes(img.url) ? "border-purple-500" : "border-transparent"
                    }`}
                    onClick={() => toggleImageSelection(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={`Headshot ${img.id}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <h3 className="mb-6 text-sm text-[#1E1E1EB2] text-normal">Credits : 1</h3>

          {Math.floor(userData?.credits) < 6 && (
            <div className="text-center">
              <small
                className={
                  Math.floor(userData.credits) < 2 ? "text-red-600 font-semibold" : "text-black"
                }
              >
                {Math.max(1, Math.floor(userData.credits))} image
                {Math.floor(userData.credits) === 1 ? "" : "s"} left
              </small>
            </div>
          )}

          <div className="flex w-full items-center justify-center gap-4 mt-2 mb-6">
            <button
              onClick={handleGenerateImage}
              className="flex w-full items-center text-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all hover:brightness-110 text-sm md:text-base"
            >
              ✨ Generate
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col pr-8 pl-4 items-center ">
        <h2 className="text-2xl font-semibold">Create an Avatar</h2>
        <h3 className="pt-2">Upload photos to create multiple looks for your avatar</h3>
        <div></div>
        <AIAvatarSteps />
        <GoodPhotos />
        <BadPhotos />
      </div>
      <SweetAlert2 {...swalProps} onConfirm={(handleConfirm) => setSwalProps({ show: false })} />
    </div>
  );
};

export default Index;

export async function getServerSideProps(ctx) {
  return {
    props: {
      withSideBar: false,
    },
  };
}
