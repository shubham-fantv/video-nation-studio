import { Button } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import SectionCards from "../../src/component/SectionCards";
import Link from "next/link";
import axios from "axios";
import fetcher from "../../src/dataProvider";
import { useMutation } from "react-query";
import { API_BASE_URL, FANTV_API_URL } from "../../src/constant/constants";
import { useQuery } from "react-query";
import { quotes } from "../../src/utils/common";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useSelector } from "react-redux";
import useGTM from "../../src/hooks/useGTM";
import SweetAlert2 from "react-sweetalert2";
import Loading from "../../src/component/common/Loading/loading";
import LoginAndSignup from "../../src/component/feature/Login/index";
import { usePlanModal } from "../../src/context/PlanModalContext";
const index = (data) => {
  const [avatarData, setAvatarData] = useState([]);
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const [image, setImage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [myAvatar, setMyAvatar] = useState(data);
  const { sendEvent } = useGTM();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [subTitle, setSubTitle] = useState("");
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const CREDIT_AI_IMAGE = process.env.NEXT_PUBLIC_CREDIT_IMAGE_VALUE;
  const { isShowFreeTrialBanner, openUpgradeModal, openTrialModal, openNoCreditModal } =
    usePlanModal();

  const [swalProps, setSwalProps] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);
  const [isPromptPhotoModalVisible, setIsPromptPhotoModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const MAX_IMAGES = 12;
  const MAX_SIZE_MB = 5;
  //  console.log("data",data);
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

  useEffect(() => {
    const pickRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSubTitle(quotes[randomIndex]);
    };
    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);

    return () => clearInterval(interval);
  }, []);

  const [form, setForm] = useState({
    name: "Gabriela",
    age: "22",
    gender: "female",
    ethnicity: "Caucasian",
    hairColor: "Blonde",
    eyeColor: "Brown",
    clothing: "Dress",
    expression: "Smiling",
    style: "Cinematic portrait",
    orientation: "portrait",
    pose: "upper body",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useQuery(
    `${FANTV_API_URL}/api/v1/ai-avatar`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/ai-avatar?limit=50`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setAvatarData(data);
      },
    }
  );

  useEffect(() => {
    setMyAvatar(data || []);
  }, [data]);

  const { mutate: generateAvatarApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-avatar`, obj),
    {
      onSuccess: (response) => {
        setPrompt("");
        setLoading(false);
        setSwalProps({
          icon: "success",
          show: true,
          title: "Success",
          text: "Avatar generation is completed",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          allowOutsideClick: false, // Optional: prevent dismiss by clicking outside
          allowEscapeKey: false, // Optional: prevent ESC close
        });
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

  const handleConfirm = () => {
    router.push("/avatar-studio");
  };

  const handleGenerateAvatar = (prompt, name, gender) => {
    if (isLoggedIn) {
      if (!prompt) {
        alert("Please enter a prompt!");
        return;
      }
      if (userData.credits < CREDIT_AI_IMAGE) {
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
          name: name,
          gender: gender,
          creditsUsed: 1,
          aspectRatio: "1:1",
          ...(image && { imageUrl: encodeURI(image) }), // ✅ encode URL with spaces
        };
        setLoading(true);

        sendEvent({
          event: "Generate Avatar",
          email: userData?.email,
          name: userData?.name,
          prompt: prompt,
          aspectRatio: "1:1",
        });

        generateAvatarApi(requestBody);
      }
    } else {
      setIsPopupVisible(true);
    }
  };

  const { mutate: generatePhotoAvatarApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/ai-avatar/photo-avatar`, obj),
    {
      onSuccess: (response) => {
        setPrompt("");
        setLoading(false);
        setSwalProps({
          icon: "success",
          show: true,
          title: "Success",
          text: "Photo Avatar generation is completed",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          allowOutsideClick: false, // Optional: prevent dismiss by clicking outside
          allowEscapeKey: false, // Optional: prevent ESC close
        });
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
        ...(image && { imageUrl: image }), // ✅ only include if `image` is truthy
        imageInput: files ? files : [],
      };
      setLoading(true);

      sendEvent({
        event: "Generate Photo Avatar",
        email: userData?.email,
        name: userData?.name,
        prompt: prompt,
        aspectRatio: "1:1",
      });

      generatePhotoAvatarApi(requestBody);
    } else {
      setIsPopupVisible(true);
    }
  };

  return (
    <div>
      {isLoading && <Loading title={"Please wait"} subTitle={subTitle} />}
      <div className="justify-center m-auto">
        <h1 className="text-black text-[32px] font-semibold text-center leading-[38px]">
          Avatar Studio
        </h1>
        {/* <p className="text-gray-700 pt-2 text-base font-normal text-center">
          VideoNation Creator Studio
        </p> 
        <Link
          href={"/generate-avatar"}
          passHref
          className="flex items-center justify-center w-full mt-6"
        >
          <div
            className="flex w-full items-center rounded-full border-2 border-gray-500 bg-white "
            style={{
              boxShadow: "0px 0px 14px 0px #00000040",
              backdropFilter: "blur(114px)",
            }}
          >
            <input
              type="text"
              readOnly
              placeholder="Enter your prompt to create a AI avatar"
              className="w-full rounded-full px-4 py-4 text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <div>
              <button
                style={{
                  background: "linear-gradient(180deg, #5A5A5A 0%, #1E1E1E 100%)",
                  border: "1px solid #FFFFFF",
                  borderRadius: "100px",
                  // width: "auto",
                  color: "#FFF",
                  fontSize: "16px",
                  textTransform: "capitalize",
                  width: "max-content",
                  paddingInline: "16px",
                  marginRight: "4px",
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                }}
              >
                <img src="/images/video-ai/star.png" style={{ height: "28px", width: "28px" }} />
                Generate
              </button>
            </div>
          </div>
        </Link>*/}
      </div>

      <div className="mt-12">
        {/* <SectionCards data={homeFeedData?.section1} /> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Generate Avatar Card */}
          <div
            onClick={() => setIsPromptModalVisible(true)}
            className="flex justify-between items-center p-6 bg-[#F0F9FF] border border-[#7DD3FC] rounded-xl hover:bg-[#E0F2FE] transition cursor-pointer"
          >
            {/* Left: Icon and Text */}
            <div className="flex flex-col gap-4 max-w-[60%]">
              <button>
                <div className="flex items-center gap-2 text-[#0EA5E9]">
                  <span className="font-semibold text-lg text-[#0369A1]">Generate AI Avatar</span>
                </div>
              </button>
              <p className="text-sm text-gray-700">
                Create an AI avatar by describing its appearance and attributes with text prompts.
              </p>
            </div>

            {/* Right: Prompt Preview */}
            <div className="flex gap-2 relative">
              <img
                src="https://assets.artistfirst.in/uploads/1747488821569-Custom_Avatar_Icon_1.jpg"
                className="w-20 h-20 rounded-md object-cover"
              />
              <img
                src="https://assets.artistfirst.in/uploads/1747488851625-Custom_Avatar_Icon_2.jpg"
                className="w-20 h-20 rounded-md object-cover"
              />
            </div>
          </div>

          {/* Custom Photo Avatar Card */}
          <div
            onClick={() => router.push("/image/headshot")}
            className=" cursor-pointer flex justify-between items-center p-6 bg-[#F5F3FF] border border-[#A78BFA] rounded-xl hover:bg-[#EDE9FE] transition"
          >
            <div className="flex flex-col gap-4 max-w-[60%] ">
              <button>
                <div className="flex items-center gap-2 text-[#7C3AED]">
                  <span className="font-semibold text-lg text-[#4C1D95]">
                    Headshot Photo Avatar
                  </span>
                </div>
              </button>
              <p className="text-sm text-gray-700">
                Use existing photos to create a new Headshot and multiple looks.
              </p>
            </div>

            {/* Right: Preview Images */}
            <div className="flex gap-2">
              <img src="/images/h1.jpg" className="w-20 h-20 rounded-md object-cover" />
              <img src="/images/h2.jpg" className="w-20 h-20 rounded-md object-cover" />
            </div>
          </div>
          <div
            onClick={() => router.push("/image/luxuryshot")}
            className=" cursor-pointer flex justify-between items-center p-6 bg-[#F5F3FF] border border-[#A78BFA] rounded-xl hover:bg-[#EDE9FE] transition"
          >
            <div className="flex flex-col gap-4 max-w-[60%] ">
              <button>
                <div className="flex items-center gap-2 text-[#7C3AED]">
                  <span className="font-semibold text-lg text-[#4C1D95]">
                    Luxuryshot Photo Avatar
                  </span>
                </div>
              </button>
              <p className="text-sm text-gray-700">
                Use existing photos to create a new Luxuryshot and multiple looks.
              </p>
            </div>

            {/* Right: Preview Images */}
            <div className="flex gap-2">
              <img
                src="https://assets.artistfirst.in/uploads/1747489542488-Ai_Avatar_Icon_1.png"
                className="w-20 h-20 rounded-md object-cover"
              />
              <img
                src="https://assets.artistfirst.in/uploads/1747489568650-AI_Avatar_Icon_2.jpg"
                className="w-20 h-20 rounded-md object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p variant="h5" className="font-semibold text-2xl text-[#1E1E1E]">
              My Avatars
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {myAvatar?.data?.length > 0 ? (
            myAvatar?.data.map((avatar) => (
              <div
                onClick={() => router.push(`/image/headshot/${avatar?._id}`)}
                key={avatar._id}
                className="relative rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer"
              >
                {avatar.finalImageUrl != "" ? (
                  <div className="relative w-full aspect-square">
                    <img
                      src={avatar.finalImageUrl}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-black flex items-center justify-center">
                    <p className="text-white text-lg font-medium"></p>
                  </div>
                )}

                {/* Optional overlay for status other than 'completed' */}
                {avatar?.status == "processing" && (
                  <div className="absolute h-48 inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-xl">
                    <p className="text-white font-medium text-lg">{avatar?.status}</p>
                  </div>
                )}

                <div className="p-2 space-y-1">
                  <div className="text-base font-semibold text-gray-800">{avatar.name}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No avatars found.</div>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p variant="h5" className="font-semibold text-2xl text-[#1E1E1E]">
              Public Avatars
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {avatarData?.map((card) => (
            <div key={card._id} className="space-y-4">
              <div className="rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer">
                <div className="relative w-full aspect-square">
                  {" "}
                  {/* 1:1 aspect ratio */}
                  <img
                    src={card.imageUrl}
                    alt={card.gender}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-base font-semibold text-gray-800">{card.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isPromptModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-full max-w-5xl rounded-xl p-6 relative grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Close Button */}
            <button
              onClick={() => setIsPromptModalVisible(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            {/* LEFT: Form Fields */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Create New AI Avatar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 font-medium mb-2">
                {[
                  ["Name", "name", "text"],
                  ["Age", "age", "number"],
                  ["Gender", "gender", "select"],
                  ["Ethnicity", "ethnicity", "text"],
                  ["Hair Color", "hairColor", "text"],
                  ["Eye Color", "eyeColor", "text"],
                  ["Clothing", "clothing", "text"],
                  ["Expression", "expression", "text"],
                  ["Style", "style", "text"],
                  ["Orientation", "orientation", "text"],
                  ["Pose", "pose", "text"],
                ].map(([label, name, type]) => (
                  <div key={name} className="flex flex-col">
                    <label className="mb-1" htmlFor={name}>
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        className="border p-2 rounded-md"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        className="border p-2 rounded-md"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsPromptModalVisible(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const {
                      name,
                      age,
                      gender,
                      ethnicity,
                      hairColor,
                      eyeColor,
                      clothing,
                      expression,
                      style,
                      orientation,
                      pose,
                    } = form;

                    const promptParts = [
                      age ? `${age}-year-old` : "",
                      gender,
                      ethnicity ? `of ${ethnicity} descent` : "",
                      hairColor || eyeColor
                        ? `with ${hairColor ? hairColor + " hair" : ""}${
                            hairColor && eyeColor ? " and " : ""
                          }${eyeColor ? eyeColor + " eyes" : ""}`
                        : "",
                      clothing ? `wearing a ${clothing}` : "",
                      expression ? `in a ${expression} expression` : "",
                      style ? `styled as a ${style}` : "",
                      orientation ? `in a ${orientation} mode` : "",
                      pose ? `showing ${pose}` : "",
                    ];

                    const generated = promptParts.filter(Boolean).join(", ") + ".";
                    setPrompt(generated.trim());
                    handleGenerateAvatar(generated, name, gender);
                    setIsPromptModalVisible(false);
                  }}
                  className="px-4 py-2 bg-black text-white rounded-md"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* RIGHT: Image */}
            <div className="flex items-center justify-center">
              <img
                src="https://video-assets.fantv.world/19c54a54-9384-4c0e-8fa1-50db9765b4bc.jpg"
                alt="Prompt Preview"
                className="rounded-lg w-[50%] h-auto object-cover"
              />
            </div>
          </div>
        </div>
      )}
      {isPromptPhotoModalVisible && (
        <div className="fixed mt-20 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="overflow-y-auto max-h-[calc(90vh-1rem)] pr-2">
            <div className="bg-white w-full max-w-5xl rounded-xl p-6 relative grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden max-h-[85vh]">
              {/* Close Button */}
              <button
                onClick={() => setIsPromptPhotoModalVisible(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
              >
                ✕
              </button>
              {/* Title */}
              <h2 className="text-xl font-semibold text-center mb-4">
                Upload Photos of Your Avatar
              </h2>
              <p className="text-center text-sm text-gray-600 mb-4">
                Upload photos to create multiple looks for your avatar
              </p>

              {/* Upload Box */}
              <div>
                <div className="h-200px border-2 border-dashed border-purple-300 bg-purple-50 rounded-xl p-8 text-center cursor-pointer hover:bg-purple-100 transition mb-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-purple-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 15a4 4 0 004 4h10a4 4 0 004-4V8a4 4 0 00-4-4H7a4 4 0 00-4 4v7z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10l6.586-6.586a2 2 0 012.828 0L21 12"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Select upto 12 photos to upload</p>
                    <p className="text-xs text-gray-500 mb-2">
                      Upload PNG, JPG, HEIC, or WebP file up to 5MB each
                    </p>
                    {/* Image Preview */}

                    {/* Image Preview */}

                    {imagePreviews && (
                      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 mb-6">
                        {imagePreviews.map(({ url, localPreview }, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={localPreview || url}
                              className="w-full h-16 object-cover rounded-md"
                              alt="preview"
                            />
                            <button
                              onClick={() => handleRemoveImage(url)}
                              className="absolute top-0 right-0 bg-red-600 text-black rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ✕
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

                    <button
                      onClick={() => {
                        if (imagePreviews.length >= MAX_IMAGES) {
                          alert("Maximum 12 images allowed.");
                          return;
                        }
                        inputRef.current.click();
                      }}
                      disabled={uploading}
                      className="bg-purple-500 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-600"
                    >
                      {uploading ? "Uploading..." : "Select Photos"}
                    </button>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex justify-center mt-2 gap-3">
                  <button
                    onClick={() => setIsPromptPhotoModalVisible(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleGeneratePhotoAvatar();
                      setIsPromptPhotoModalVisible(false);
                      setLoading(true);
                    }}
                    className="px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600"
                  >
                    Generate Avatar
                  </button>
                </div>
              </div>

              {/* Photo Requirements */}
              <div className="space-y-6">
                {/* Good Photos */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 font-semibold">✔ Good Photos</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Recent photos of yourself (just you), showing a mix of close-ups and full-body
                    shots, with different angles, expressions (smiling, neutral, serious), and a
                    variety of outfits. Make sure they are high-resolution and reflect your current
                    appearance.
                  </p>
                  <div className="flex gap-2 overflow-x-auto">
                    <img
                      key={1}
                      src={`https://assets.artistfirst.in/uploads/1747396154317-Good_Avatar_1.webp`}
                      className="w-20 h-28 rounded-md object-cover border border-green-500"
                      alt="good photo"
                    />
                    <img
                      key={2}
                      src={`https://assets.artistfirst.in/uploads/1747396178612-Good_Avatar_2.webp`}
                      className="w-20 h-28 rounded-md object-cover border border-green-500"
                      alt="good photo"
                    />
                    <img
                      key={3}
                      src={`https://assets.artistfirst.in/uploads/1747396196125-Good_Avatar_3.webp`}
                      className="w-20 h-28 rounded-md object-cover border border-green-500"
                      alt="good photo"
                    />
                    <img
                      key={4}
                      src={`https://assets.artistfirst.in/uploads/1747396217107-Good_Avatar_4.webp`}
                      className="w-20 h-28 rounded-md object-cover border border-green-500"
                      alt="good photo"
                    />
                    <img
                      key={5}
                      src={`https://assets.artistfirst.in/uploads/1747396229542-Good_Avatar_5.webp`}
                      className="w-20 h-28 rounded-md object-cover border border-green-500"
                      alt="good photo"
                    />
                  </div>
                </div>

                {/* Bad Photos */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600 font-semibold">✖ Bad Photos</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    No group photos, hats, sunglasses, pets, heavy filters, low-resolution images,
                    or screenshots. Avoid photos that are too old, overly edited, or don’t represent
                    how you currently look.
                  </p>
                  <div className="flex gap-2 overflow-x-auto">
                    <img
                      key={1}
                      src={`https://assets.artistfirst.in/uploads/1747915251733-Bad_Avatar_1.jpg`}
                      className="w-20 h-28 rounded-md object-cover border border-red-500"
                      alt="bad photo"
                    />
                    <img
                      key={2}
                      src={`https://assets.artistfirst.in/uploads/1747395752777-Bad_Avatar_2.jpg`}
                      className="w-20 h-28 rounded-md object-cover border border-red-500"
                      alt="bad photo"
                    />
                    <img
                      key={3}
                      src={`https://assets.artistfirst.in/uploads/1747395778037-Bad_Avatar_3.jpg`}
                      className="w-20 h-28 rounded-md object-cover border border-red-500"
                      alt="bad photo"
                    />
                    <img
                      key={4}
                      src={`https://assets.artistfirst.in/uploads/1747395795794-Bad_Avatar_4.webp`}
                      className="w-20 h-28 rounded-md object-cover border border-red-500"
                      alt="bad photo"
                    />
                    <img
                      key={5}
                      src={`https://assets.artistfirst.in/uploads/1747395814436-Bad_Avatar_5.webp`}
                      className="w-20 h-28 rounded-md object-cover border border-red-500"
                      alt="bad photo"
                    />
                  </div>
                </div>
              </div>
            </div>
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

      <SweetAlert2 {...swalProps} onConfirm={handleConfirm} />
    </div>
  );
};

export default index;

export async function getServerSideProps(ctx) {
  const cookie = parseCookies(ctx);
  const authToken = cookie["aToken"];

  try {
    const [avatarResult] = await Promise.all([
      fetcher.get(
        `${FANTV_API_URL}/api/v1/ai-avatar/user-avatars?page=1&limit=100`,
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
        data: avatarResult.success ? avatarResult.data : [],
      },
    };
  } catch (error) {
    console.error("Error fetching data in getServerSideProps:", error);
    return {
      props: {
        data: [],
      },
    };
  }
}
