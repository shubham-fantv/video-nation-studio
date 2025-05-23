import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import CommunityCreatedContent from "../../src/component/imageCommunityCreatedContent";
import HowToCreate from "../../src/component/HowToCreate";
import { useMutation, useQuery } from "react-query";
import fetcher from "../../src/dataProvider";
import { API_BASE_URL, FANTV_API_URL } from "../../src/constant/constants";
import axios from "axios";
import Loading from "../../src/component/common/Loading/loading";
import { quotes } from "../../src/utils/common";
import { allPromptSamples } from "../../src/utils/common";
import { useSelector } from "react-redux";
import LoginAndSignup from "../../src/component/feature/Login";
import { useRouter } from "next/router";
import SweetAlert2 from "react-sweetalert2";
import useGTM from "../../src/hooks/useGTM";

const aspectRatioSizeMap = {
  "1:1": "w-4 h-4",
  "4:5": "w-10 h-12",
  "9:16": "w-3 h-4",
  "16:9": "w-4 h-3",
};

const index = () => {
  const [captionEnabled, setCaptionEnabled] = useState(false);
  const lastTrialAction = localStorage.getItem("lastTrialAction");
  const RATE_LIMIT_INTERVAL_MS = 1 * 1000; // 1 sec for Image
  const [templates, setTemplates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [subTitle, setSubTitle] = useState("");
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const aspectRatioData = ["16:9", "9:16", "1:1"];
  const [isLoading, setLoading] = useState(false);
  const [swalProps, setSwalProps] = useState({});

  const getRandomPrompts = (list, count = 3) =>
    list
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, count); // Pick first 3

  const [samplePrompts, setSamplePrompts] = useState([]);

  const magicPrompts = [
    "A dragon soaring over snow-covered mountains at dusk",
    "A glowing forest where fireflies light up the night",
    "A cyberpunk girl walking through a neon-lit alley",
    "A quiet Japanese teahouse on a rainy evening",
    "An astronaut relaxing on a tropical alien beach",
    // Add more here...
  ];

  const generateMagicPrompt = () => {
    const randomPrompt = magicPrompts[Math.floor(Math.random() * magicPrompts.length)];
    setPrompt(randomPrompt);
  };

  const { sendEvent } = useGTM();

  const { isLoggedIn, userData } = useSelector((state) => state.user);
  useQuery(
    `${FANTV_API_URL}/api/v1/templates?limit=30`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/templates?limit=30`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setTemplates(data.results);
      },
    }
  );

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

  const { mutate: generateImageApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-image`, obj),
    {
      onSuccess: (response) => {
        //alert(JSON.stringify(response, null, 2));
        setImagePreview(null);
        setPrompt("");
        setLoading(false);
        // if (userData?.isTrialUser) {
        //   localStorage.setItem("lastTrialAction", Date.now().toString());
        // }

        sendEvent({
          event: "asset_generated",
          aspectRatio: aspectRatio,
          // duration: duration,
          credits_used: credits,
          caption: captionEnabled,
          voiceover: voiceoverEnabled,
          button_text: "Generate",
          page_name: "Generate Video",
          interaction_type: "Standard Button",
          type: "Image",
          url: response?.data?.finalImageUrl,
        });

        router.replace(`/generate-image/${response?.data._id}`, undefined, { scroll: false });
        // setSwalProps({
        //   icon: "success",
        //   show: true,
        //   title: "Success",
        //   text: "Image generation is completed",
        //   showCancelButton: true,
        //   confirmButtonText: "Go to My Library",
        //   cancelButtonText: "Cancel",
        //   allowOutsideClick: false, // Optional: prevent dismiss by clicking outside
        //   allowEscapeKey: false, // Optional: prevent ESC close
        // });
      },
      onError: (error) => {
        setLoading(false);

        const defaultMessage = "Something went wrong. Please try again later.";

        const message = error?.response?.data?.message || error?.message || defaultMessage;

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

  const handleConfirm = () => {
    //console.log(response.data);
    //router.push("/my-library?tab=image");
  };

  const handleGenerateImage = () => {
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
          },
        });
      } else {
        if (userData?.isTrialUser) {
          const now = Date.now();
          const lastActionTime = parseInt(localStorage.getItem("lastTrialAction") || now, 10);

          if (now - lastActionTime > 0 && now - lastActionTime < RATE_LIMIT_INTERVAL_MS) {
            const waitTime = Math.ceil(
              (RATE_LIMIT_INTERVAL_MS - (now - lastActionTime)) / 1000 / 60
            );
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
            });
            return;
          } else {
            const requestBody = {
              prompt,
              imageInput: image ? [encodeURI(image)] : [],
              creditsUsed: 1,
              aspectRatio: aspectRatio,
              caption: captionEnabled,
              ...(image && { imageUrl: encodeURI(image) }), // ✅ encode URL with spaces
            };

            setLoading(true);

            sendEvent({
              event: "Generate Image",
              email: userData?.email,
              name: userData?.name,
              prompt: prompt,
              aspectRatio: aspectRatio,
              caption: captionEnabled,
            });

            generateImageApi(requestBody);
          }
        } else {
          const requestBody = {
            prompt,
            imageInput: image ? [encodeURI(image)] : [],
            creditsUsed: 1,
            aspectRatio: aspectRatio,
            caption: captionEnabled,
            ...(image && { imageUrl: encodeURI(image) }), // ✅ encode URL with spaces
          };

          setLoading(true);

          sendEvent({
            event: "button_clicked",
            email: userData?.email,
            name: userData?.name,
            prompt: prompt,
            aspectRatio: aspectRatio,
            caption: captionEnabled,
            button_text: "Generate",
            page_name: "Generate Image",
            interaction_type: "Standard Button",
          });

          generateImageApi(requestBody);
        }
      }
    } else {
      setIsPopupVisible(true);
    }
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

  useEffect(() => {
    setSamplePrompts(getRandomPrompts(allPromptSamples));
  }, []);

  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current?.focus(); // Auto-focus on mount (for testing)
  }, []);

  return (
    <div>
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
      <div className="justify-center m-auto">
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          AI-Powered Image Creation. Just Type & Generate
        </h1>
        <p className="text-[#1E1E1EB2] pt-2 text-base font-normal text-center">
          Transform words into cinematic visuals — effortless, fast, and stunning.
        </p>
      </div>
      <div className="flex mt-8 w-full flex-col gap-4 rounded-lg bg-[#F5F5F5] p-4 shadow-md">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          className="w-full rounded-md bg-[#F5F5F5] p-3 text-sm text-[#1E1E1EB2] text-normal placeholder-gray-500 focus:outline-none"
          placeholder="Enter your prompt..."
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative w-24 h-24 mt-2">
            <img
              src={imagePreview}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 bg-red-600 text-black rounded-full w-6 h-6 flex items-center justify-center"
            >
              ✖
            </button>
          </div>
        )}

        {/* Buttons & Toggle */}
        <div className="flex  flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all cursor-pointer">
            + Ref image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>

          {/* Caption Toggle 
          <button
            onClick={() => setCaptionEnabled(!captionEnabled)}
            className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all"
          >
            <div
              className={`w-6 h-4 flex items-center rounded-full p-[2px] transition-all ${
                captionEnabled ? "bg-green-500" : "bg-gray-500"
              }`}
            >
              <div
                className={`h-3 w-3 rounded-full bg-white transition-transform ${
                  captionEnabled ? "translate-x-2" : ""
                }`}
              ></div>
            </div>
            Caption
          </button>
           Caption Toggle */}
          <button className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[1E1E1E] shadow-md transition-all">
            {/* <span className="w-4 h-3 border border-black rounded-sm"></span> */}
            <span
              className={`border border-black rounded-sm ${
                aspectRatioSizeMap[aspectRatio] || "w-4 h-3"
              }`}
            ></span>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="bg-[#FFF]"
            >
              {aspectRatioData?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </button>
          <div className="flex-1 hidden md:block"></div>
          {/* <button
            onClick={generateMagicPrompt}
            className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all hover:bg-gray-100"
          >
            🪄 Magic Prompt
          </button> */}
          <div className="text-sm">
            Credits : 1
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
          </div>
          <button
            onClick={() => handleGenerateImage()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 text-white shadow-md transition-all hover:brightness-110"
          >
            ✨ Generate
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 overflow-auto">
        {samplePrompts.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => setPrompt(sample)}
            className="w-[360px] h-[75px] rounded-full bg-[#F5F5F5] px-5 py-4 text-sm text-[#1E1E1E] shadow-sm hover:bg-gray-200 transition-all"
          >
            {sample}
          </button>
        ))}
      </div>
      <div className="mt-8"></div>
      {templates.length > 0 && (
        <div className="mt-12">
          <div className="w-full"></div>
        </div>
      )}

      {isPopupVisible && (
        <LoginAndSignup
          callBackName={"uniqueCommunity"}
          open={isPopupVisible}
          handleModalClose={() => setIsPopupVisible(false)}
        />
      )}
      <SweetAlert2 {...swalProps} onConfirm={(handleConfirm) => setSwalProps({ show: false })} />
    </div>
  );
};

export default index;
