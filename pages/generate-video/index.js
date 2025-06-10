import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import CommunityCreatedContent from "../../src/component/CommunityCreatedContent";
import HowToCreate from "../../src/component/HowToCreate";
import { useMutation, useQuery } from "react-query";
import fetcher from "../../src/dataProvider";
import { API_BASE_URL, FANTV_API_URL } from "../../src/constant/constants";
import axios from "axios";
import Loading from "../../src/component/common/Loading/loading";
import { getPageName, quotes } from "../../src/utils/common";
import { allPromptSamples } from "../../src/utils/common";
import { useSelector } from "react-redux";
import LoginAndSignup from "../../src/component/feature/Login";
import { useRouter } from "next/router";
import SweetAlert2 from "react-sweetalert2";
import useGTM from "../../src/hooks/useGTM";
import LoadingScreen from "../../src/component/common/LoadingScreen";
import { usePlanModal } from "../../src/context/PlanModalContext";

const aspectRatioSizeMap = {
  "1:1": "w-4 h-4",
  "4:5": "w-10 h-12",
  "9:16": "w-3 h-4",
  "16:9": "w-4 h-3",
};

const index = () => {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const lastTrialAction = localStorage.getItem("lastTrialAction");

  const { openModal } = usePlanModal();

  const RATE_LIMIT_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours
  const [isPlaying, setIsPlaying] = useState(null);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const quoteIndexRef = useRef(0);

  const audioRef = useRef(null); // reference for controlling audio
  const voiceOptions = [
    {
      name: "Laura",
      value: "6ZeRQ71MhGGmKDjCiFRa",
      sampleUrl:
        "https://assets.artistfirst.in/uploads/1747488017829-voice_preview_laura%20-%20narrative.mp3",
    },
    {
      name: "John",
      value: "c4NIULtANlpduSDihsKJ",
      sampleUrl:
        "https://assets.artistfirst.in/uploads/1747488078180-voice_preview_john_storyteller.mp3",
    },
    {
      name: "Clara",
      value: "8LVfoRdkh4zgjr8v5ObE",
      sampleUrl:
        "https://assets.artistfirst.in/uploads/1747488113955-voice_preview_clarastoryteller.mp3",
    },
    {
      name: "Monika",
      value: "2bNrEsM0omyhLiEyOwqY",
      sampleUrl:
        "https://assets.artistfirst.in/uploads/1747488171032-voice_preview_monika%20sogam-friendly%20customer%20care%20agent.mp3",
    },
    {
      name: "Arjun",
      value: "dxhwlBCxCrnzRlP4wDeE",
      sampleUrl: "https://assets.artistfirst.in/uploads/1747488220089-voice_preview_arjun.mp3",
    },
  ];
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState(null);
  const [showCaptionDropdown, setShowCaptionDropdown] = useState(false);
  const captionOptions = [
    { label: "Classic White", value: "ClassicWhite", img: "/images/caption-white.png" },
    { label: "Yellow Border", value: "YellowBorder", img: "/images/fantasy-purple.png" },
    { label: "Top Italic", value: "TopItalic", img: "/images/caption-previews/top_italic.png" },
    { label: "Big Red", value: "BigRedImpact", img: "/images/caption-previews/big_red_impact.png" },
    {
      label: "Fantasy Purple",
      value: "FantasyPurple",
      img: "/images/caption-previews/fantasy_purple.png",
    },
  ];

  const [captionEnabled, setCaptionEnabled] = useState(false);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [finalVideo, setFinalVideo] = useState("");
  const [image, setImage] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [credits, setCredits] = useState(20);
  const [duration, setDuration] = useState("5 sec");
  const [subTitle, setSubTitle] = useState("");
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const aspectRatioData = ["16:9", "9:16", "1:1"];
  const durationData = ["5 sec", "15 sec"];
  const [isLoading, setLoading] = useState(false);
  const [swalProps, setSwalProps] = useState({});

  const getRandomPrompts = (list, count = 3) =>
    list
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, count); // Pick first 3

  const [samplePrompts, setSamplePrompts] = useState([]);

  const { sendEvent } = useGTM();

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
      sendEvent({
        event: "button_clicked",
        button_text: "Ref Image",
        page_name: "Video Studio",
        interaction_type: "Attachment",
        button_id: "genvid_ref_img_btn",
        voiceover: selectedVoice || "No Voice",
      });
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
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-video`, obj),
    {
      onSuccess: (response) => {
        sendEvent({
          event: "asset_generated",
          aspectRatio: aspectRatio,
          duration: duration,
          credits_used: credits,
          caption: captionEnabled,
          voiceover: voiceoverEnabled,
          page_name: "Generate Video",
          interaction_type: "Standard Button",
          type: "video",
          prompt: prompt,
          url: response?.data?.finalVideoUrl,
        });

        setImagePreview(null);
        setPrompt("");
        setFinalVideo(response?.data._id);
        setLoading(false);
        if (userData?.isTrialUser) {
          localStorage.setItem("lastTrialAction", Date.now().toString());
        }

        router.push(`/generate-video/${response?.data._id}`, undefined, { scroll: false });
        // setSwalProps({
        //   icon: "success",
        //   show: true,
        //   title: "Success",
        //   text: "Video generation done",
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
          preConfirm: () => {
            sendEvent({
              event: "button_clicked",
              button_text: "OK",
              page_name: "Generate Video",
              interaction_type: "Standard button",
              button_id: "popup_video_gen_error_btn",
              section_name: "Popup",
            });
          },
        });
        sendEvent({
          event: "popup_displayed",
          popup_type: "Error",
          popup_name: "Video Generation",
          popup_messge_text:
            "AI video generation service failed to respond. Please try again later",
          page_name: "Generate Video",
        });
      },
    }
  );

  const handleConfirm = () => {
    //  router.push("/my-library");

    router.push(`/generate-video/${finalVideo}`, undefined, { scroll: false });
  };

  const handleGenerateVideo = () => {
    if (isLoggedIn) {
      if (!prompt.trim()) {
        alert("Please enter a prompt!");
        return;
      }

      const creditsUsed = 20 * parseInt(duration.replace("sec", "").trim() / 5, 10);

      if (userData.credits <= 0) {
        router.push("/subscription");
        return;
      }

      if (userData.credits < creditsUsed && !userData?.isTrialUser) {
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
            sendEvent({
              event: "button_clicked",
              button_text: "Ok",
              interaction_type: "Standard button",
              button_id: "popup_signup_btn",
              section_name: "Popup",
              page_name: getPageName(router?.pathname),
            });
          },
        });
        sendEvent({
          event: "popup_displayed",
          popup_type: "Nudge",
          popup_name: "Inssufficient Credits",
          popup_messge_text: "Insufficient credits. Please upgrade your plan or buy more credits.",
          page_name: getPageName(router?.pathname),
        });
      } else {
        if (userData.credits < creditsUsed && userData?.isTrialUser) {
          openModal();
        } else {
          const requestBody = {
            prompt,
            imageInput: image ? [image] : [],
            creditsUsed: creditsUsed,
            aspectRatio: aspectRatio,
            duration: duration,
            caption: captionEnabled,
            ...(selectedVoice && { voiceId: selectedVoice }), // ✅ selectedVoice
            ...(selectedCaptionStyle && { captionStyle: selectedCaptionStyle }), // ✅ selectedCaption
            voiceover: voiceoverEnabled,
            ...(image && { imageUrl: encodeURI(decodeURI(image)) }), // ✅ encode URL with spaces
          };
          setLoading(true);

          if (userData?.isTrialUser) {
            localStorage.setItem("lastTrialAction", Date.now().toString());
          }
          generateVideoApi(requestBody);
        }
        sendEvent({
          event: "button_clicked",
          email: userData?.email,
          name: userData?.name,
          prompt: prompt,
          aspectRatio: aspectRatio,
          duration: duration,
          caption: captionEnabled,
          voiceover: voiceoverEnabled,
          button_text: "Generate",
          page_name: "Generate Video",
          button_id: "genvid_btn",
          type: "video",
          interaction_type: "Standard Button",
        });
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
    const totalDuration = 180000; // 3 minutes
    const updateInterval = 2000; // every 2 seconds
    let elapsed = 0;

    progressInterval = setInterval(() => {
      elapsed += updateInterval;
      const progressRatio = elapsed / totalDuration;

      const easedProgress = Math.min(
        Math.floor(100 * Math.pow(progressRatio, 2.5)), // exponent controls acceleration
        99
      );

      const progress = Math.min(Math.floor((elapsed / totalDuration) * 100), 99); // max 99%
      setProgressPercentage(easedProgress);
    }, updateInterval);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  useEffect(() => {
    setSamplePrompts(getRandomPrompts(allPromptSamples));
  }, []);

  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current?.focus(); // Auto-focus on mount (for testing)
  }, []);

  return (
    <div>
      {isLoading && (
        <LoadingScreen
          progress={progressPercentage}
          mainText={subTitle}
          subText={`${progressPercentage}% completed`}
        />
      )}
      <div className="justify-center m-auto">
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          AI-Powered Video Creation. Just Type & Generate
        </h1>
        <p className="text-[#1E1E1EB2] pt-2 text-base font-normal text-center">
          Transform words into cinematic visuals—effortless, fast, and stunning
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
          <button className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[1E1E1E] shadow-md transition-all">
            {/* <span className="w-4 h-3 border border-black rounded-sm"></span> */}
            <span
              className={`border border-black rounded-sm ${
                aspectRatioSizeMap[aspectRatio] || "w-4 h-3"
              }`}
            ></span>
            <select
              value={aspectRatio}
              onChange={(e) => {
                setAspectRatio(e.target.value);
                sendEvent({
                  event: "button_clicked",
                  page_name: "Generate Video",
                  interaction_type: "Dropdown Option Select",
                  button_id: "genvid_aspect_ratio_dd_trigger",
                  dropdown_name: "Aspect Ratio Selector",
                  option_value: e.target.value,
                });
              }}
              className="bg-[#FFF]"
            >
              {aspectRatioData?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </button>
          {/* Duration Dropdown */}
          <button className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[1E1E1E] shadow-md transition-all">
            {/* <span className="w-4 h-3 border border-black rounded-sm"></span> */}
            <select
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                setCredits(20 * parseInt(e.target.value.replace("sec", "").trim() / 5, 10));
                sendEvent({
                  event: "button_clicked",
                  button_text: "-",
                  page_name: "Generate Video",
                  interaction_type: "Dropdown Option Select",
                  button_id: "genvid_duration_dd_trigger",
                  dropdown_name: "Duration Selector",
                  option_value: e.target.value,
                });
              }}
              className="bg-[#FFF]"
            >
              {durationData?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </button>
          {/* Caption Dropdown */}
          {/* Caption Style Dropdown */}
          {/* Caption Style Dropdown (Image Preview) */}
          <div className="relative">
            <button
              onClick={() => setShowCaptionDropdown((prev) => !prev)}
              className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all"
            >
              <span>Caption {selectedCaptionStyle ? selectedCaptionStyle : ""}</span>
              <span>{showCaptionDropdown ? "▲" : "▼"}</span>
            </button>

            {showCaptionDropdown && (
              <div className="absolute z-10 mt-2 w-[280px] bg-white border border-gray-300 rounded-md shadow-lg max-h-72 overflow-auto">
                {/* Option to unselect */}
                <div
                  className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedCaptionStyle === null
                      ? "bg-purple-100 border-l-4 border-purple-400"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedCaptionStyle(null);
                    setShowCaptionDropdown(false);
                  }}
                >
                  <span className="text-sm italic text-gray-500">No Captions</span>
                </div>

                {captionOptions.map((style) => (
                  <div
                    key={style.value}
                    className={`flex justify-between items-center px-3 py-2 cursor-pointer transition ${
                      selectedCaptionStyle === style.value
                        ? "bg-purple-100 border-l-4 border-purple-500"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedCaptionStyle(style.value);
                      setShowCaptionDropdown(false);
                      setCaptionEnabled(true);
                      sendEvent({
                        event: "button_clicked",
                        button_text: "Caption",
                        page_name: "Generate Video",
                        interaction_type: "Dropdown Option Select",
                        button_id: "genvid_caption_dd_trigger",
                        dropdown_name: "Caption Selector",
                        option_value: style.value,
                      });
                    }}
                  >
                    {" "}
                    <span className="text-sm text-gray-500">{style.label}</span>
                    {/* <img
                      src={style.img}
                      alt={style.label}
                      className="h-10 w-30 object-contain rounded-md"
                    /> */}
                    {selectedCaptionStyle === style.value && (
                      <span className="ml-2 text-purple-600 font-semibold">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voiceover Dropdown */}
          <div className="relative">
            {/* Toggle Button Styled Like Duration */}
            <button
              onClick={() => setShowVoiceDropdown((prev) => !prev)}
              className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[1E1E1E] shadow-md transition-all"
            >
              <span>
                Voiceover
                {selectedVoice
                  ? `: ${voiceOptions.find((v) => v.value === selectedVoice)?.name}`
                  : ""}
              </span>
              <span>{showVoiceDropdown ? "^" : "▼"}</span>
            </button>

            {/* Dropdown Content */}
            {showVoiceDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div
                  className={`flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedVoice === null ? "bg-purple-100 border-l-4 border-purple-400" : ""
                  }`}
                  onClick={() => {
                    setSelectedVoice(null);
                    setShowVoiceDropdown(false);
                  }}
                >
                  <span className="text-sm italic text-gray-500">No Voice</span>
                </div>
                {voiceOptions.map((voice) => (
                  <div
                    key={voice.value}
                    className={`flex justify-between items-center px-4 py-2 cursor-pointer transition ${
                      selectedVoice === voice.value
                        ? "bg-purple-100 border-l-4 border-purple-400"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedVoice(voice.value);
                      setVoiceoverEnabled(true);
                      setShowVoiceDropdown(false);
                      sendEvent({
                        event: "button_clicked",
                        button_text: "Voiceover",
                        page_name: "Generate Video",
                        interaction_type: "Dropdown Option Select",
                        button_id: "genvid_voiceover_dd_trigger",
                        dropdown_name: "Voiceover Selector",
                        option_value: voice?.value || "No Voice",
                      });
                    }}
                  >
                    <span className="text-sm">{voice.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        // if clicking same voice
                        if (isPlaying === voice.value) {
                          audioRef.current?.pause();
                          setIsPlaying(null);
                        } else {
                          if (audioRef.current) {
                            audioRef.current.pause();
                          }

                          const newAudio = new Audio(voice.sampleUrl);
                          newAudio.crossOrigin = "anonymous";
                          audioRef.current = newAudio;
                          setIsPlaying(voice.value);

                          newAudio.play().catch((err) => {
                            console.error("Playback error:", err);
                          });
                          newAudio.onended = () => setIsPlaying(null);
                        }
                      }}
                      className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      {isPlaying === voice.value ? "⏸" : "▶"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 hidden md:block text-sm"></div>
          {/* <button
            onClick={generateMagicPrompt}
            className="flex items-center gap-2 rounded-md bg-[#FFF] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all hover:bg-gray-100"
          >
            🪄 Magic Prompt
          </button> */}
          <div className="text-sm">
            Credits : {credits}
            {/* {Math.floor(userData?.credits / credits) < 6 && (
              <div className="text-center">
                <small
                  className={
                    Math.floor(userData.credits / credits) < 2
                      ? "text-red-600 font-semibold"
                      : "text-black"
                  }
                >
                  {Math.max(1, Math.floor(userData.credits / credits))} video
                  {Math.floor(userData.credits / credits) === 1 ? "" : "s"} left
                </small>
              </div>
            )} */}
          </div>
          <button
            onClick={() => handleGenerateVideo()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2.5 text-white shadow-md transition-all hover:brightness-110"
          >
            Generate Video
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 overflow-auto">
        {samplePrompts.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(sample);
              sendEvent({
                event: "button_clicked",
                button_text: sample,
                page_name: "Generate Video",
                interaction_type: "Standard Button",
                button_id: "genvid_sample_prompt_btn",
              });
            }}
            className="w-[360px] h-[75px] rounded-full bg-[#F5F5F5] px-5 py-4 text-sm text-[#1E1E1E] shadow-sm hover:bg-gray-200 transition-all"
          >
            {sample}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <HowToCreate />
      </div>
      {templates.length > 0 && (
        <div className="mt-12">
          <div className="w-full">
            <CommunityCreatedContent data={templates} isTabEnabled />
          </div>
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
