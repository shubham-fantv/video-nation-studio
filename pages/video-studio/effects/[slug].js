import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FANTV_API_URL } from "../../../src/constant/constants";
import { parseCookies } from "nookies";
import fetcher from "../../../src/dataProvider";

const cards = [
  {
    _id: "1",
    name: "Let's YMCA!",
    title: "Let's YMCA!",
    description: "Dance to the YMCA rhythm with AI animation.",
    imageUrl: "https://assets.artistfirst.in/uploads/ymca.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/ymca.mp4",
    isActive: true,
    slug: "lets-ymca",
    order: 5,
    categoryType: "video",
  },
  {
    _id: "2",
    name: "Subject 3 Fever",
    title: "Subject 3 Fever",
    description: "Feel the fever with Subject 3 visual style.",
    imageUrl: "https://assets.artistfirst.in/uploads/subject3.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/subject3.mp4",
    isActive: true,
    slug: "subject-3-fever",
    order: 6,
    categoryType: "video",
  },
  {
    _id: "3",
    name: "Ghibli Live!",
    title: "Ghibli Live!",
    description: "Transform your video into a live Ghibli scene.",
    imageUrl: "https://assets.artistfirst.in/uploads/ghibli.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/ghibli.mp4",
    isActive: true,
    slug: "ghibli-live",
    order: 7,
    categoryType: "video",
  },
  {
    _id: "4",
    name: "Suit Swagger",
    title: "Suit Swagger",
    description: "Put on a suit and strut with swagger.",
    imageUrl: "https://assets.artistfirst.in/uploads/suit.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/suit.mp4",
    isActive: true,
    slug: "suit-swagger",
    order: 8,
    categoryType: "video",
  },
  {
    _id: "5",
    name: "Muscle Surge",
    title: "Muscle Surge",
    description: "Bulk up instantly with AI-generated muscles.",
    imageUrl: "https://assets.artistfirst.in/uploads/muscle.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/muscle.mp4",
    isActive: true,
    slug: "muscle-surge",
    order: 9,
    categoryType: "video",
  },
  {
    _id: "6",
    name: "Emergency Beat",
    title: "Emergency Beat",
    description: "Dance like it’s an emergency drill!",
    imageUrl: "https://assets.artistfirst.in/uploads/emergency.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/emergency.mp4",
    isActive: true,
    slug: "emergency-beat",
    order: 10,
    categoryType: "video",
  },
  {
    _id: "7",
    name: "Kungfu Club",
    title: "Kungfu Club",
    description: "Enter the dojo with kungfu movie effects.",
    imageUrl: "https://assets.artistfirst.in/uploads/kungfu.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/kungfu.mp4",
    isActive: true,
    slug: "kungfu-club",
    order: 11,
    categoryType: "video",
  },
  {
    _id: "8",
    name: "Retro Anime Pop",
    title: "Retro Anime Pop",
    description: "Animate yourself in retro anime style.",
    imageUrl: "https://assets.artistfirst.in/uploads/retro.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/retro.mp4",
    isActive: true,
    slug: "retro-anime-pop",
    order: 12,
    categoryType: "video",
  },
  {
    _id: "9",
    name: "Vogue Walk",
    title: "Vogue Walk",
    description: "Strike a pose and walk the runway with AI flair.",
    imageUrl: "https://assets.artistfirst.in/uploads/vogue.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/vogue.mp4",
    isActive: true,
    slug: "vogue-walk",
    order: 13,
    categoryType: "video",
  },
  {
    _id: "10",
    name: "Mega Dive",
    title: "Mega Dive",
    description: "Jump into hyper-stylized cinematic action.",
    imageUrl: "https://assets.artistfirst.in/uploads/mega.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/mega.mp4",
    isActive: true,
    slug: "mega-dive",
    order: 14,
    categoryType: "video",
  },
  {
    _id: "11",
    name: "Evil Trigger",
    title: "Evil Trigger",
    description: "Unleash your dark side with Evil Trigger mode.",
    imageUrl: "https://assets.artistfirst.in/uploads/evil.jpg",
    videoUrl: "https://assets.artistfirst.in/uploads/evil.mp4",
    isActive: true,
    slug: "evil-trigger",
    order: 15,
    categoryType: "video",
  },
];

const EffectPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [prompt, setPrompt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoId, setVideoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState(""); // Track the actual status from API
  const [error, setError] = useState("");
  const title = cards.find((c) => c.slug === slug)?.title;

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Video download failed:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

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
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAspectClick = (ratio) => {
    setAspectRatio(ratio);
  };

  const resetVideoState = () => {
    setVideoId(null);
    setVideoUrl("");
    setProgress(0);
    setStatus("");
    setError("");
  };

  const handleCreate = async () => {
    if (!imageUrl) {
      alert("Please upload an image.");
      return;
    }

    // Reset all video-related state
    resetVideoState();
    setLoading(true);

    try {
      const res = await fetcher.post(
        `${FANTV_API_URL}/api/v1/ai-video-pixverse`,
        {
          prompt: "smiling",
          style: "anime",
          imageUrl,
          effect: title || "Ghibli Live!",
          quality: "720p",
          duration: 5,
          motion_mode: "normal",
          aspect_ratio: aspectRatio,
          visibility: "private",
        }
      );

      console.log("Video creation response:", res);

      const _id = res?.data?._id;
      if (!_id) throw new Error("No video ID returned from server");

      setVideoId(_id);
      setStatus("processing");
      // Start with a small progress to show something is happening
      setProgress(5);
    } catch (err) {
      console.error("Video creation failed:", err);
      setError("Failed to start video creation. Please try again.");
      setLoading(false);
    }
  };

  // Polling effect for video progress
  useEffect(() => {
    if (!videoId || !loading) return;

    const pollProgress = async () => {
      try {
        const progressRes = await fetcher.get(
          `https://api.videonation.xyz/api/v1/ai-video-pixverse/progress/${videoId}`
        );

        const responseData = progressRes?.data || {};
        const {
          finalVideoUrl,
          status: apiStatus,
          progress: apiProgress,
        } = responseData;

        console.log("Progress response:", responseData);

        // Update status
        setStatus(apiStatus || "processing");

        // Handle progress
        if (typeof apiProgress === "number") {
          setProgress(Math.max(apiProgress, progress)); // Ensure progress only increases
        }

        // Handle completion
        if (apiStatus === "completed" && finalVideoUrl) {
          setProgress(100);
          setVideoUrl(finalVideoUrl);
          setLoading(false);
          console.log("Video completed:", finalVideoUrl);
        } else if (apiStatus === "failed" || apiStatus === "error") {
          setError("Video generation failed. Please try again.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Progress polling failed:", err);
        setError("Failed to get video progress. Please refresh and try again.");
        setLoading(false);
      }
    };

    // Poll immediately, then every 3 seconds
    pollProgress();
    const interval = setInterval(pollProgress, 3000);

    return () => clearInterval(interval);
  }, [videoId, loading, progress]);

  // Simulated progress for better UX (only when we don't have real progress)
  useEffect(() => {
    if (!loading || videoUrl || status === "completed") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Don't simulate progress beyond 90% to leave room for real API progress
        if (prev >= 90) return prev;

        // Slower initial progress, faster in middle, slower near end
        if (prev < 20) return prev + 1;
        if (prev < 70) return prev + 2;
        return prev + 0.5;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [loading, videoUrl, status]);

  // Handle video completion with smooth transition
  useEffect(() => {
    if (progress >= 100 && videoUrl && loading) {
      // Add a small delay for smooth UX
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [progress, videoUrl, loading]);

  return (
    <div className="min-h-screen bg-white text-black p-5 w-screen mx-4">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-600 mb-4 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold mb-6 capitalize">
        {slug?.replace(/-/g, " ")}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="w-full lg:w-1/3 border rounded-xl p-4 shadow-sm">
          <label
            htmlFor="image-upload"
            className="cursor-pointer border border-dashed rounded-lg flex items-center justify-center h-48 bg-gray-50 mb-4"
          >
            {imageUrl ? (
              <div className="relative h-full w-full group">
                <img
                  src={imageUrl}
                  className="h-full w-full object-contain rounded-lg hover:opacity-90"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setImageUrl("");
                    setImage(null);
                    resetVideoState();
                  }}
                  className="absolute bottom-2 right-2 bg-black rounded-md border-2 border-white text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.9985 4.48437C13.9851 4.48437 13.9651 4.48437 13.9451 4.48437C10.4185 4.13104 6.89848 3.99771 3.41181 4.35104L2.05181 4.48437C1.77181 4.51104 1.52515 4.31104 1.49848 4.03104C1.47181 3.75104 1.67181 3.51104 1.94515 3.48437L3.30515 3.35104C6.85181 2.99104 10.4451 3.13104 14.0451 3.48437C14.3185 3.51104 14.5185 3.75771 14.4918 4.03104C14.4718 4.29104 14.2518 4.48437 13.9985 4.48437Z"
                      fill="white"
                    />
                    <path
                      d="M5.66846 3.81594C5.6418 3.81594 5.61513 3.81594 5.5818 3.80927C5.31513 3.7626 5.12846 3.5026 5.17513 3.23594L5.3218 2.3626C5.42846 1.7226 5.57513 0.835938 7.12846 0.835938H8.87513C10.4351 0.835938 10.5818 1.75594 10.6818 2.36927L10.8285 3.23594C10.8751 3.50927 10.6885 3.76927 10.4218 3.80927C10.1485 3.85594 9.88846 3.66927 9.84846 3.4026L9.7018 2.53594C9.60846 1.95594 9.58846 1.8426 8.8818 1.8426H7.13513C6.42846 1.8426 6.41513 1.93594 6.31513 2.52927L6.1618 3.39594C6.1218 3.6426 5.90846 3.81594 5.66846 3.81594Z"
                      fill="white"
                    />
                    <path
                      d="M10.1416 15.1677H5.86156C3.53489 15.1677 3.44156 13.881 3.36823 12.841L2.93489 6.12769C2.91489 5.85436 3.12823 5.61436 3.40156 5.59436C3.68156 5.58103 3.91489 5.78769 3.93489 6.06103L4.36823 12.7744C4.44156 13.7877 4.46823 14.1677 5.86156 14.1677H10.1416C11.5416 14.1677 11.5682 13.7877 11.6349 12.7744L12.0682 6.06103C12.0882 5.78769 12.3282 5.58103 12.6016 5.59436C12.8749 5.61436 13.0882 5.84769 13.0682 6.12769L12.6349 12.841C12.5616 13.881 12.4682 15.1677 10.1416 15.1677Z"
                      fill="white"
                    />
                    <path
                      d="M9.10672 11.5H6.88672C6.61339 11.5 6.38672 11.2733 6.38672 11C6.38672 10.7267 6.61339 10.5 6.88672 10.5H9.10672C9.38005 10.5 9.60672 10.7267 9.60672 11C9.60672 11.2733 9.38005 11.5 9.10672 11.5Z"
                      fill="white"
                    />
                    <path
                      d="M9.66536 8.83594H6.33203C6.0587 8.83594 5.83203 8.60927 5.83203 8.33594C5.83203 8.0626 6.0587 7.83594 6.33203 7.83594H9.66536C9.9387 7.83594 10.1654 8.0626 10.1654 8.33594C10.1654 8.60927 9.9387 8.83594 9.66536 8.83594Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-gray-400 text-sm text-center flex flex-col justify-center items-center">
                <svg
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M34.9513 2.16406H30.0513C28.6013 2.16406 27.5346 2.76406 27.0513 3.83073C26.7846 4.31406 26.668 4.88073 26.668 5.5474V10.4474C26.668 12.5641 27.9346 13.8307 30.0513 13.8307H34.9513C35.618 13.8307 36.1846 13.7141 36.668 13.4474C37.7346 12.9641 38.3346 11.8974 38.3346 10.4474V5.5474C38.3346 3.43073 37.068 2.16406 34.9513 2.16406ZM36.518 8.71406C36.3513 8.88073 36.1013 8.9974 35.8346 9.01406H33.4846V9.86406L33.5013 11.3307C33.4846 11.6141 33.3846 11.8474 33.1846 12.0474C33.018 12.2141 32.768 12.3307 32.5013 12.3307C31.9513 12.3307 31.5013 11.8807 31.5013 11.3307V8.9974L29.168 9.01406C28.618 9.01406 28.168 8.5474 28.168 7.9974C28.168 7.4474 28.618 6.9974 29.168 6.9974L30.6346 7.01406H31.5013V4.68073C31.5013 4.13073 31.9513 3.66406 32.5013 3.66406C33.0513 3.66406 33.5013 4.13073 33.5013 4.68073L33.4846 5.86406V6.9974H35.8346C36.3846 6.9974 36.8346 7.4474 36.8346 7.9974C36.818 8.28073 36.7013 8.51406 36.518 8.71406Z"
                    fill="#653EFF"
                  />
                  <path
                    d="M15.0018 17.8005C17.1926 17.8005 18.9685 16.0246 18.9685 13.8339C18.9685 11.6431 17.1926 9.86719 15.0018 9.86719C12.8111 9.86719 11.0352 11.6431 11.0352 13.8339C11.0352 16.0246 12.8111 17.8005 15.0018 17.8005Z"
                    fill="#653EFF"
                  />
                  <path
                    d="M34.9487 13.8359H34.1654V21.5193L33.9487 21.3359C32.6487 20.2193 30.5487 20.2193 29.2487 21.3359L22.3154 27.2859C21.0154 28.4026 18.9154 28.4026 17.6154 27.2859L17.0487 26.8193C15.8654 25.7859 13.982 25.6859 12.6487 26.5859L6.41536 30.7693C6.0487 29.8359 5.83203 28.7526 5.83203 27.4859V13.5193C5.83203 8.81927 8.31536 6.33594 13.0154 6.33594H26.6654V5.5526C26.6654 4.88594 26.782 4.31927 27.0487 3.83594H13.0154C6.9487 3.83594 3.33203 7.4526 3.33203 13.5193V27.4859C3.33203 29.3026 3.6487 30.8859 4.26536 32.2193C5.6987 35.3859 8.76536 37.1693 13.0154 37.1693H26.982C33.0487 37.1693 36.6654 33.5526 36.6654 27.4859V13.4526C36.182 13.7193 35.6154 13.8359 34.9487 13.8359Z"
                    fill="#653EFF"
                  />
                </svg>
                {uploading ? "Uploading..." : "Upload Image"}
                <br />
                (JPG, PNG - Max 10 MB)
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>

          {/* Aspect Ratio */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Aspect Ratio</p>
            <div className="flex gap-4 items-center">
              {["16:9", "1:1"].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => handleAspectClick(ratio)}
                  className={`border-2 w-18 h-18 p-3 rounded flex flex-col gap-y-1 items-center justify-center font-medium transition-all duration-200 ease-in  ${
                    aspectRatio === ratio
                      ? "bg-purple-100 text-purple-700 border-purple-500"
                      : "text-gray-600"
                  }`}
                  disabled={loading}
                >
                  <div
                    className={`border-2 border-gray-400 rounded-md ${
                      ratio == "16:9" ? "w-12 h-8" : "w-10 h-10"
                    }`}
                  ></div>
                  <p>{ratio}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl shadow disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCreate}
            disabled={loading || uploading || !imageUrl}
          >
            {loading ? "Creating..." : "✨ Create"}
          </button>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-2/3 flex items-center justify-center">
          {loading ? (
            <VideoProgressPanel
              progress={progress}
              status={status}
              showCompleted={progress >= 100 && videoUrl}
            />
          ) : videoUrl ? (
            <div className="w-full max-w-xl mx-auto p-6 bg-[#F9FAFB] rounded-2xl shadow-md">
              <div className="flex flex-col items-center space-y-4">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="rounded-lg w-[640px] h-[280px] shadow-md"
                  onLoadStart={() => console.log("Video loading started")}
                  onCanPlay={() => console.log("Video can play")}
                />

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all hover:brightness-110 text-sm md:text-base"
                >
                  Download Video
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4">
                <img
                  src="/images/video.svg"
                  alt="Placeholder"
                  className="w-32 h-32 mx-auto mb-4"
                />
              </div>
              <p className="text-lg italic text-gray-600">
                Start creating your video
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VideoProgressPanel = ({
  progress = 0,
  status = "",
  showCompleted = false,
}) => {
  const getStatusMessage = () => {
    if (showCompleted) return "Video completed! 🎉";
    if (progress >= 90) return "Finalizing your video...";
    if (progress >= 70) return "Almost there...";
    if (progress >= 30) return "Processing your video...";
    return "Starting video creation...";
  };

  return (
    <div className="p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-1">
        <div></div>
        <span
          className={`font-semibold text-lg ${
            showCompleted ? "text-green-600" : "text-[#7A43FF]"
          }`}
        >
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 bg-[#f5f0ff] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            showCompleted
              ? "bg-gradient-to-r from-green-500 to-green-400"
              : "bg-gradient-to-r from-[#7A43FF] to-[#C88FFF]"
          }`}
          style={{ width: `${Math.max(progress, 0)}%` }}
        />
      </div>
      <p className="text-black font-semibold mt-3">{getStatusMessage()}</p>
      {status && (
        <p className="text-sm text-gray-500 mt-1 capitalize">
          Status: {status}
        </p>
      )}
    </div>
  );
};

export default EffectPage;

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
