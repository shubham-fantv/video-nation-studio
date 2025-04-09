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
import { quotes } from "../../src/utils/common";

const index = () => {
  const [captionEnabled, setCaptionEnabled] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [subTitle, setSubTitle] = useState("");

  const aspectRatioData = ["16:9", "9:16"];
  const [isLoading, setLoading] = useState(false);

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

  const { mutate: generateVideoApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-video`, obj),
    {
      onSuccess: (response) => {
        setImagePreview(null);
        setPrompt("");
        setLoading(false);
        alert(" Success => video generation started");
      },
      onError: (error) => {
        setLoading(false);
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
      prompt,
      imageInput: image ? [image] : [],
      creditsUsed: 20,
      aspectRatio: aspectRatio,
      caption: captionEnabled,
    };
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

  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current?.focus(); // Auto-focus on mount (for testing)
  }, []);

  return (
    <div>
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
      <div className="justify-center m-auto">
        <h1 className="text-white text-[32px] font-semibold text-center leading-[38px]">
          AI-Powered Video Creation. Just Type & Generate
        </h1>
        <p className="text-[#D2D2D2] pt-2 text-base font-normal text-center">
          Transform words into cinematic visuals—effortless, fast, and stunning.
        </p>
      </div>
      <div className="flex mt-8 w-full flex-col gap-4 rounded-lg bg-[#292929] p-4 shadow-md">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          className="w-full rounded-md bg-transparent p-3 text-sm text-[#D2D2D2] text-normal placeholder-gray-500 focus:outline-none"
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
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ✖
            </button>
          </div>
        )}

        {/* Buttons & Toggle */}
        <div className="flex  flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all hover:bg-gray-800 cursor-pointer">
            + Add image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>

          {/* Caption Toggle */}
          <button
            onClick={() => setCaptionEnabled(!captionEnabled)}
            className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all"
          >
            <div
              className={`w-6 h-4 flex items-center rounded-full bg-gray-700 p-1 transition-all ${
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
          <button className="flex items-center gap-2 rounded-md bg-[#1E1E1E] px-4 py-2 text-sm text-[#D2D2D2] shadow-md transition-all hover:bg-gray-800">
            <span className="w-4 h-3 border border-white rounded-sm"></span>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="bg-[#1E1E1E]"
              // className=" h-[48px] block w-full rounded-md bg-[#343434] border-0 py-2 pl-3 pr-10 text-white focus:ring-0 sm:text-sm appearance-none" // Add appearance-none
            >
              {aspectRatioData?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </button>
          <div className="flex-1 hidden md:block"></div>

          <button
            onClick={() => handleGenerateVideo()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 text-white shadow-md transition-all hover:brightness-110"
          >
            ✨ Generate
          </button>
        </div>
      </div>
      <div className="mt-12">
        <HowToCreate />
      </div>
      {templates.length > 0 && (
        <div className="mt-12">
          <div className="w-full">
            <CommunityCreatedContent data={templates} isTabEnabled />
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
