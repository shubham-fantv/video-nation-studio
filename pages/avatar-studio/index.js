import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import SectionCards from "../../src/component/SectionCards";
import Link from "next/link";
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

const index = (data) => {
  const [avatarData, setAvatarData] = useState([]);
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const [image, setImage] = useState("");
  const [myAvatar, setMyAvatar] = useState(data);
  const { sendEvent } = useGTM();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [subTitle, setSubTitle] = useState("");

  const [swalProps, setSwalProps] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);

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
    name:"John",
    age: "30",
    gender: "Female",
    ethnicity: "Caucasian",
    hairColor: "Blonde",
    eyeColor: "Brown",
    clothing: "Dress",
    expression: "Smiling",
    style: "Cinematic portrait",
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
      }
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
      
        const message =
          error?.response?.data?.message ||
          error?.message ||
          defaultMessage;
      
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

  const handleGenerateAvatar = (prompt,name,gender) => {
    if (isLoggedIn) {
      if (!prompt) {
        alert("Please enter a prompt!");
        return;
      }

      if (userData.credits <= 0) {
        router.push("/subscription");
        return;
      }

      const requestBody = {
        prompt,
        name:name,
        gender:gender,
        creditsUsed: 1,
        aspectRatio: "9:16",
        ...(image && { imageUrl: image }), // ✅ only include if `image` is truthy
      };
      setLoading(true);

      sendEvent({
        event: "Generate Avatar",
        email: userData?.email,
        name: userData?.name,
        prompt: prompt,
        aspectRatio: "9:16",
      });

      generateAvatarApi(requestBody);
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
        </p> */}
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
        </Link>
      </div>
      <div className="mt-12">
        {/* <SectionCards data={homeFeedData?.section1} /> */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p variant="h5" className="font-semibold text-2xl text-[#1E1E1E]">
              My Avatars
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
      {/* Create New Avatar Card */}
      <div
        className="h-150px border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-gray-100 transition"
        style={{
            //backgroundImage: "url('/images/photo-avatar-bg.jpg')", // 📷 background
              backgroundColor: "#FDE68A", // light gray-blue as fallback
          }}
          onClick={() => setIsPromptModalVisible(true)}
 
      >
        <PlusCircle className="text-gray-500 w-8 h-8 mb-2" />
        <div className="text-gray-700 font-medium">Photo Avatar</div>
      </div>
        {/* Create New Avatar Card */}
        <div
        className="h-150px border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-gray-100 transition"
        style={{
           // backgroundImage: "url('/images/ai-avatar-bg.jpg')", // 🤖 background
            backgroundColor: "EDF2F7", // soft yellow as fallback
          }}
          onClick={() => setIsPromptModalVisible(true)}
      >
        <PlusCircle className="text-gray-500 w-8 h-8 mb-2" />
        <div className="text-gray-700 font-medium">AI Avatar</div>
      </div>

      {/* Avatar Cards */}
      {myAvatar.data.length > 0 ? (
            myAvatar.data.map((avatar) => (
                <div
                key={avatar._id}
                className="rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer"
                >
                <img
                    src={avatar.imageUrl}
                    alt={avatar.name}
                    className="w-full h-36 object-cover"
                />
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
        <img
          src={card.imageUrl}
          alt={card.gender}
          className="w-full h-48 object-cover"
        />
        <div className="p-3 space-y-1">
          <div className="text-base font-semibold text-gray-800">{card.name}</div>
          <div className="text-sm text-gray-500">{card.name}</div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 font-medium mb-4">
          {[
            ["Name", "name", "text"],
            ["Age", "age", "number"],
            ["Gender", "gender", "select"],
            ["Ethnicity", "ethnicity", "text"],
            ["Hair Color", "hairColor", "text"],
            ["Eye Color", "eyeColor", "text"],
            ["Clothing", "clothing", "text"],
            ["Expression", "expression", "text"],
            ["Avatar Style", "style", "text"],
          ].map(([label, name, type]) => (
            <div key={name} className="flex flex-col">
              <label className="mb-1" htmlFor={name}>{label}</label>
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
              ];

              const generated = promptParts.filter(Boolean).join(", ") + ".";
              setPrompt(generated.trim());
              handleGenerateAvatar(generated,name,gender);
              setIsPromptModalVisible(false);
              setLoading(true);
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
          src="https://video-assets.fantv.world/acd9dcb5-3552-4292-a58a-18009dc5098c.jpg"
          alt="Prompt Preview"
          className="rounded-lg w-full h-auto object-cover"
        />
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
  