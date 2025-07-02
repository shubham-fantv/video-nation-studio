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
import { usePlanModal } from "../../src/context/PlanModalContext";
import { useDispatch } from "react-redux";
import { setUserData } from "../../src/redux/slices/user";
import useIsMobile from "../../src/hooks/useIsMobile";

const Index = ({ masterData }) => {
  const [template, setTemplate] = useState([]);
  const CREDIT_AI_IMAGE = process.env.NEXT_PUBLIC_CREDIT_IMAGE_VALUE;

  const lastTrialAction = localStorage.getItem("lastTrialAction");
  const RATE_LIMIT_INTERVAL_MS = 1 * 1000; // 12 hours
  const [aspectRatio, setAspectRatio] = useState("16:9");
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
  const dispatch = useDispatch();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const quoteIndexRef = useRef(0);
  const isMobile = useIsMobile();
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [swalProps, setSwalProps] = useState({});
  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const { sendEvent, sendGTM } = useGTM();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useQuery(
    `${FANTV_API_URL}/api/v1/users/${userData?._id || userData?.id}`,
    () =>
      fetcher.get(
        `${FANTV_API_URL}/api/v1/users/${userData?._id || userData?.id}`
      ),
    {
      enabled: !!(userData?._id || userData?.id),
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        dispatch(setUserData(data));
      },
    }
  );

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    console.log("Selected avatar:", avatar);
  };

  const {
    isShowFreeTrialBanner,
    openUpgradeModal,
    openTrialModal,
    openNoCreditModal,
    refetchUserData,
  } = usePlanModal();
  const [subTitle, setSubTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const aspectRatioData = ["16:9", "9:16", "1:1"];
  const { slug } = router.query;

  const [selectedImages, setSelectedImages] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);

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
    "https://assets.artistfirst.in/uploads/1747722871243-Dappled_Walk_Headshot_A1.jpg",
    "https://assets.artistfirst.in/uploads/1747723002925-Prime_Suburb_Headshot_A1.jpg",
    "https://assets.artistfirst.in/uploads/1747722934391-Grand_Avenue_Headshot_A1.jpg",
    "https://assets.artistfirst.in/uploads/1747722952743-Biz_District_Headshot_A1.jpg",
    "https://assets.artistfirst.in/uploads/1747730179106-Bright_Lane_Headshot_A1.jpg",
  ].map((url, index) => ({ id: index + 1, url }));

  const toggleImageSelection = (imgUrl) => {
    setSelectedImages((prev) =>
      prev.includes(imgUrl)
        ? prev.filter((url) => url !== imgUrl)
        : [...prev, imgUrl]
    );
  };

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
      const response = await axios.post(
        "https://upload.artistfirst.in/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
    (obj) => fetcher.post(`${FANTV_API_URL}/api/v1/ai-image`, obj),
    {
      onSuccess: (response) => {
        //console.log("I AM HERE", response?.data);
        sendGTM({
          event: "imageGeneratedVN",
        });
        sendEvent({
          event: "asset_generated",
          aspectRatio: aspectRatio,
          credits_used: 1,
          caption: captionEnabled,
          button_text: "Generate",
          page_name: "Generate Image",
          interaction_type: "Standard Button",
          type: "Image",
          url: response?.data?.finalImageUrl,
          prompt: prompt,
          section: "Sidebar",
        });
        setImagePreview(null);
        setImageUrl(null);
        setPrompt("");
        setLoading(false);
        // if (userData?.isTrialUser) {
        //   localStorage.setItem("lastTrialAction", Date.now().toString());
        // }
        //console.log("I AM HERE", response?.data._id);
        //router.push("/my-library?tab=image");
        router.replace(`/generate-image/${response?.data._id}`, undefined, {
          scroll: false,
        });
        refetchUserData();
      },
      onError: (error) => {
        setLoading(false);
        const defaultMessage = "Something went wrong. Please try again later.";

        const message =
          error?.response?.data?.message || error?.message || defaultMessage;

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

  const handleGenerateImage = () => {
    if (isLoggedIn) {
      // if (!prompt.trim()) {
      //   alert("Please enter a prompt!");
      //   return;
      // }
      if (userData.credits < CREDIT_AI_IMAGE) {
        if (isShowFreeTrialBanner) {
          openTrialModal();
        } else if (!userData.isFreeTrial && userData.isFreeTrialUsed) {
          openUpgradeModal();
        } else {
          openNoCreditModal();
        }
      } else {
        sendEvent({
          event: "button_clicked",
          type: "Image",
          aspect_ratio: aspectRatio,
          url: window.location.pathname,
          prompt: prompt,
          credits_used: 1,
          button_id: "rect_img_btn",
          section: "Sidebar",
          app_id: "Videonation",
        });
        sendEvent({
          event: "Generate Image Slug",
          slug: slug,
          email: userData?.email,
          name: userData?.name,
          prompt: prompt,
          aspectRatio: aspectRatio,
        });

        const requestBody = {
          prompt,
          imageInput: imageUrl ? [encodeURI(decodeURI(imageUrl))] : [],
          creditsUsed: 1,
          aspectRatio: aspectRatio,
          ...(imageUrl && { imageUrl: encodeURI(decodeURI(imageUrl)) }), // ✅ encode URL with spaces
        };
        setLoading(true);
        generateImageApi(requestBody);
      }
    } else {
      setIsPopupVisible(true);
    }
  };

  useEffect(() => {
    if (!isLoading) return;

    let quoteInterval;
    let progressInterval;

    const pickRandomQuote = () => {
      setSubTitle(quotes[quoteIndexRef.current]);
      quoteIndexRef.current = (quoteIndexRef.current + 1) % quotes.length; // cycle

      // const randomIndex = Math.floor(Math.random() * quotes.length);
      // setSubTitle(quotes[randomIndex]);
    };

    // Initial call
    pickRandomQuote();
    setProgressPercentage(0);

    // Change quote every 15 seconds
    quoteInterval = setInterval(() => {
      pickRandomQuote();
    }, 15000);

    // Simulate progress over ~3 minutes
    const totalDuration = 10000; // 10 seconds
    const updateInterval = 200; // update every 200ms
    let elapsed = 0;

    progressInterval = setInterval(() => {
      elapsed += updateInterval;
      const progressRatio = elapsed / totalDuration;

      const easedProgress = Math.min(
        Math.floor(100 * Math.pow(progressRatio, 2.5)), // exponent controls acceleration
        99
      );

      const progress = Math.min(
        Math.floor((elapsed / totalDuration) * 100),
        99
      ); // max 99%
      setProgressPercentage(easedProgress);
    }, updateInterval);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

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
        //console.log("IAM HERE", data);
        setTemplate(data);
        setAvatar(data.avatarId);
        setVoice(data.voiceId || "Default");
        setCaptionEnabled(data.caption);
        setAspectRatio(data.aspectRatio);
        setPrompt(data.prompt);
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
  }, [slug]);

  const handleDownloadImage = async () => {
    if (!image) return;

    sendEvent({
      event: "button_clicked",
      button_text: "Download",
      interaction_type: "Standard Button",
      button_id: "genimg_download_btn",
      page_name: "Generate Image",
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
      <div className=" md:hidden  pl-2 w-full md:p-4 ">
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

      {isMobile && isLoading && (
        <div className="w-full">
          <Loading
            title={"Please wait"}
            subTitle={subTitle}
            percentage={Math.round((progressPercentage * 95) / 100)}
          />
        </div>
      )}

      <div className="w-full md:w-[25%] bg-[#FFFFFF0D] p-4">
        <div className="">
          {slug === "headshot" ? (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Select Headshots</h3>
              <div className="grid grid-cols-4 gap-3">
                {(showAllImages ? allHeadshots : allHeadshots.slice(0, 8)).map(
                  (img) => (
                    <div
                      key={img.id}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition ${
                        selectedImages.includes(img.url)
                          ? "border-purple-500"
                          : "border-transparent"
                      }`}
                      onClick={() => toggleImageSelection(img.url)}
                    >
                      <img
                        src={img.url}
                        alt={`Headshot ${img.id}`}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  )
                )}
              </div>

              {allHeadshots.length > 8 && (
                <button
                  onClick={() => setShowAllImages((prev) => !prev)}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  {showAllImages ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex justify-between flex-wrap">
                <h3 className="text-sm font-medium mb-2">Prompt</h3>
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
          )}
          <div className="mb-6 flex gap-x-10">
            {/* Ref Image */}
            <div className="w-1/2">
              <h3 className="text-sm font-medium mb-2">Ref Image</h3>
              <label className="flex items-center gap-2 rounded-md bg-[#F5F5F5] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all cursor-pointer">
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
                      <h3>+ Add images</h3>
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

            <div className="w-1/2">
              <h3 className="text-sm font-medium mb-2">Aspect Ratio</h3>
              <div className="relative">
                <button className="flex items-center gap-2 rounded-md bg-[#F5F5F5] px-4 py-2 text-sm text-[1E1E1E] shadow-md transition-all">
                  {/* <span className="w-4 h-3 border border-black rounded-sm"></span> */}
                  <span
                    className={`border border-black rounded-sm ${
                      aspectRatioSizeMap[aspectRatio] || "w-4 h-3"
                    }`}
                  ></span>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="bg-[#F5F5F5]"
                  >
                    {aspectRatioData?.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </button>
              </div>
            </div>
          </div>

          {
            <div className="mb-6">
              <AvatarDropdown
                data={masterData?.avatars}
                onSelect={handleAvatarSelect}
              />
            </div>
          }

          {visibility && (
            <div className="mb-6">
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

          <h3 className="mb-6 text-sm text-[#1E1E1EB2] text-normal">
            Credits : {CREDIT_AI_IMAGE}
          </h3>

          {Math.floor(userData?.credits) < 6 && (
            <div className="text-center">
              <small
                className={
                  Math.floor(userData.credits) < 2
                    ? "text-red-600 font-semibold"
                    : "text-black"
                }
              >
                {Math.max(1, Math.floor(userData.credits))} image
                {Math.floor(userData.credits) === 1 ? "" : "s"} left
              </small>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-2 mb-6">
            <button
              onClick={handleGenerateImage}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all hover:brightness-110 text-sm md:text-base"
            >
              ✨ Generate
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center ">
        {isLoading ? (
          <div className="w-full hidden md:block">
            <Loading
              title={"Please wait"}
              subTitle={subTitle}
              percentage={Math.round((progressPercentage * 95) / 100)}
            />
          </div>
        ) : (
          <>
            <div className="hidden md:block w-full md:p-4 bg-[#F5F5F5]">
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
                  {/* Loader overlay */}
                  {imageLoading && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl z-10">
                      <span className="text-sm text-gray-400">
                        Loading image...
                      </span>
                    </div>
                  )}

                  {/* Image always rendered */}
                  <img
                    src={image}
                    key={image}
                    alt={prompt}
                    onLoad={() => setImageLoading(false)}
                    className={`w-full h-full object-contain rounded-xl max-h-[300px] md:max-h-[450px] transition-opacity duration-500 ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                </div>
              </div>

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
          </>
        )}
      </div>
      <SweetAlert2
        {...swalProps}
        onConfirm={(handleConfirm) => setSwalProps({ show: false })}
      />
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
