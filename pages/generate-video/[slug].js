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

const Index = ({ masterData }) => {
  const CREDIT_AI_VIDEO = process.env.NEXT_PUBLIC_CREDIT_AI_VIDEO_VALUE;
  const AI_VIDEO_LYPSYN = process.env.NEXT_PUBLIC_CREDIT_AI_VIDEO_LYPSYNC;

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const lastTrialAction = localStorage.getItem("lastTrialAction");
  const RATE_LIMIT_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [credits, setCredits] = useState(CREDIT_AI_VIDEO);
  const audioRef = useRef(null); // reference for controlling audio
  const quoteIndexRef = useRef(0);
  const dispatch = useDispatch();
  const { isLoggedIn, userData } = useSelector((state) => state.user);

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
      sampleUrl:
        "https://assets.artistfirst.in/uploads/1747488220089-voice_preview_arjun.mp3",
    },
  ];
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState(null);
  const [showCaptionDropdown, setShowCaptionDropdown] = useState(false);
  const captionOptions = [
    {
      label: "Classic White",
      value: "ClassicWhite",
      img: "/images/caption-white.png",
    },
    {
      label: "Yellow Border",
      value: "YellowBorder",
      img: "/images/fantasy-purple.png",
    },
    {
      label: "Top Italic",
      value: "TopItalic",
      img: "/images/caption-previews/top_italic.png",
    },
    {
      label: "Big Red",
      value: "BigRedImpact",
      img: "/images/caption-previews/big_red_impact.png",
    },
    {
      label: "Fantasy Purple",
      value: "FantasyPurple",
      img: "/images/caption-previews/fantasy_purple.png",
    },
  ];

  const [captionEnabled, setCaptionEnabled] = useState(false);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(false);
  const [template, setTemplate] = useState([]);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [avatar, setAvatar] = useState("");
  const [voice, setVoice] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const [progressPercentage, setProgressPercentage] = useState(0);
  const [duration, setDuration] = useState("5 sec");
  const durationData = ["5 sec", "15 sec"];

  const [video, setVideo] = useState("");
  const [newImage, setNewImage] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [captionStyle, setCaptionStyle] = useState("");
  const [swalProps, setSwalProps] = useState({});
  

  const { sendEvent } = useGTM();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    //console.log("Selected avatar:", avatar);
  };

  const {
    isShowFreeTrialBanner,
    openUpgradeModal,
    openTrialModal,
    openNoCreditModal,
  } = usePlanModal();

  const [subTitle, setSubTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const aspectRatioData = ["16:9", "9:16", "1:1"];
  const { slug } = router.query;

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

  const { mutate: generateVideoApi } = useMutation(
    (obj) => fetcher.post(`${FANTV_API_URL}/api/v1/ai-video`, obj),
    {
      onSuccess: (response) => {
        //console.log("I AM HERE", response?.data);
        setImagePreview(null);
        setImageUrl(null);
        setPrompt("");
        setLoading(false);
        if (userData?.isTrialUser) {
          localStorage.setItem("lastTrialAction", Date.now().toString());
        }
        //console.log("I AM HERE", response?.data._id);
        //router.push("/my-library?tab=video");
        router.replace(`/generate-video/${response?.data._id}`, undefined, {
          scroll: false,
        });
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
    //router.push(`/edit-video/${slug}`);
  };

  const handleConfirm = () => {
    //console.log(template);
  };

  const handleGenerateVideo = () => {
    if (isLoggedIn) {
      if (!prompt.trim()) {
        alert("Please enter a prompt!");
        return;
      }

      let creditsUsed =
        CREDIT_AI_VIDEO * parseInt(duration.replace("sec", "").trim() / 5, 10);
      if (voiceoverEnabled) {
        creditsUsed = Number(creditsUsed) + Number(AI_VIDEO_LYPSYN);
      }

      if (userData.credits < creditsUsed) {
        if (isShowFreeTrialBanner) {
          openTrialModal();
        } else if (!userData.isFreeTrial && userData.isFreeTrialUsed) {
          openUpgradeModal();
        } else {
          openNoCreditModal();
        }
      } else {
        const requestBody = {
          prompt,
          imageInput: imageUrl ? [encodeURI(decodeURI(imageUrl))] : [],
          creditsUsed: creditsUsed,
          aspectRatio: aspectRatio,
          duration: duration,
          caption: captionEnabled,
          ...(selectedVoice && { voiceId: selectedVoice }), // ✅ selectedVoice
          ...(selectedCaptionStyle && { captionStyle: selectedCaptionStyle }), // ✅ selectedCaption
          voiceover: voiceoverEnabled,
          ...(imageUrl && { imageUrl: encodeURI(decodeURI(imageUrl)) }), // ✅ encode URL with spaces
        };
        setLoading(true);

        sendEvent({
          event: "button_clicked",
          button_text: "Generate",
          page_name: "Generate Video",
          interaction_type: "Standard Button",
          section_name: "Sidebar",
          button_id: "genvid_variation_generate_sb_btn",
        });
        generateVideoApi(requestBody);
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
      setVideoLoading(true);

      try {
        const res = await fetcher.get(
          `${FANTV_API_URL}/api/v1/templates/${updatedSlug}`,
          {
            headers: {
              ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
            },
          },
          "default"
        );

        const data = res?.data;
        setTemplate(data);
        setAvatar(data.avatarId);
        setVoiceoverEnabled(data.voiceover);
        setVoice(data.voiceId);
        setSelectedVoice(data.voiceId);
        setCaptionEnabled(data.caption);
        setCaptionStyle(data.captionStyle);
        setSelectedCaptionStyle(data.captionStyle);
        setAspectRatio(data.aspectRatio);
        setDuration(data.duration);
        setPrompt(data.prompt);
        setImageUrl(data.imageUrl);
        setImagePreview(data.imageUrl);
        setVideo(data.videoUrl);
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

  console.log("duration", duration);

  const handleDownloadVideo = async () => {
    if (!video) return;

    sendEvent({
      event: "button_clicked",
      button_text: "Download",
      page_name: "Generate Video",
      interaction_type: "Standard Button",
      section_name: "Sidebar",
      button_id: "genvid_download_btn",
    });

    try {
      const response = await fetch(video);
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
      {isLoading && (
        <Loading
          title={`Generating your video... (${progressPercentage}%)`}
          subTitle={subTitle}
          percentage={progressPercentage}
        />
      )}
      <div className="md:hidden w-full pl-2 md:p-4 ">
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

      <div className="w-full md:w-[25%] bg-[#FFFFFF0D] p-4">
        <div className="">
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
          <div className="mb-6 flex gap-x-10">
            {/* Ref Image */}
            <div className="w-1/2">
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
          <div className="mb-6 flex gap-x-4">
            {/* Duration Dropdown */}
            <div className="w-1/3">
              <button className="flex items-center gap-2 rounded-md bg-[#F5F5F5] px-2 py-2 text-sm text-[1E1E1E] shadow-md transition-all">
                {/* <span className="w-4 h-3 border border-black rounded-sm"></span> */}
                <select
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    setCredits(
                      process.env.NEXT_PUBLIC_CREDIT_AI_VIDEO_VALUE *
                        parseInt(
                          e.target.value.replace("sec", "").trim() / 5,
                          10
                        )
                    );
                  }}
                  className="bg-[#F5F5F5]"
                >
                  {durationData?.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </button>
            </div>
            {/* VoiceOver Dropdown */}
            <div className="relative">
              {/* Toggle Button Styled Like Duration */}
              <button
                onClick={() => setShowVoiceDropdown((prev) => !prev)}
                className="flex items-center gap-2 rounded-md bg-[#F5F5F5] px-4 py-2 text-sm text-[1E1E1E] shadow-md transition-all"
              >
                <span>
                  Voiceover
                  {selectedVoice
                    ? `: ${
                        voiceOptions.find((v) => v.value === selectedVoice)
                          ?.name
                      }`
                    : ""}
                </span>
                <span>{showVoiceDropdown ? "^" : "▼"}</span>
              </button>

              {/* Dropdown Content */}
              {showVoiceDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-[#F5F5F5] border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div
                    className={`flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedVoice === null
                        ? "bg-purple-100 border-l-4 border-purple-400"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedVoice(null);
                      setShowVoiceDropdown(false);
                    }}
                  >
                    <span className="text-sm italic text-gray-500">
                      No Voice
                    </span>
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
          </div>
          <div>
            {/* Caption Dropdown */}
            <div className="mb-6 w-full relative">
              <button
                onClick={() => setShowCaptionDropdown((prev) => !prev)}
                className="flex items-center gap-2 rounded-md bg-[#F5F5F5] px-4 py-2 text-sm text-[#1E1E1E] shadow-md transition-all"
              >
                <span>
                  Caption: {selectedCaptionStyle ? selectedCaptionStyle : ""}
                </span>
                <span>{showCaptionDropdown ? "▲" : "▼"}</span>
              </button>

              {showCaptionDropdown && (
                <div className="absolute z-10 mt-2 w-[240px] bg-[#F5F5F5] border border-gray-300 rounded-md shadow-lg max-h-72 overflow-auto">
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
                      setCaptionEnabled(false);
                    }}
                  >
                    <span className="text-sm italic text-gray-500">
                      No Captions
                    </span>
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
                      }}
                    >
                      {" "}
                      <span className="text-sm text-gray-500">
                        {style.label}
                      </span>
                      {/* <img
                        src={style.img}
                        alt={style.label}
                        className="h-10 w-30 object-contain rounded-md"
                    /> */}
                      {selectedCaptionStyle === style.value && (
                        <span className="ml-2 text-purple-600 font-semibold">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* {(
            <div className="mb-6">
                <AvatarDropdown data={masterData?.avatars} onSelect={handleAvatarSelect}  />
            </div>
          )} */}

          {visibility && (
            <div className="mb-6">
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
          <div>
            <h3 className="mb-6 text-sm text-[#1E1E1EB2] text-normal">
              Credits :{" "}
              {voiceoverEnabled
                ? Number(credits) + Number(AI_VIDEO_LYPSYN)
                : credits}
            </h3>
            {/* {Math.floor(userData.credits / credits) < 6 && (
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
          <div className="flex items-center justify-center gap-4 mt-2 mb-6">
            <button
              onClick={handleGenerateVideo}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all hover:brightness-110 text-sm md:text-base"
            >
              ✨ Generate
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center ">
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
              {/* Video */}
              {/* Video always rendered */}

              <video
                src={video}
                muted
                loop
                playsInline
                controls
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
                onEnded={(e) => e.target.play()}
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
