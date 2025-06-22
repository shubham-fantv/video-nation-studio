import { Box, Modal } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "../../../constant/constants";
import fetcher from "../../../dataProvider";
import { setToken, setUserData } from "../../../redux/slices/user";
import loginData from "../../../utils/login";
import { styles } from "./style";
import useGTM from "../../../hooks/useGTM";
import { usePlanModal } from "../../../context/PlanModalContext";
import React, { useState, useEffect } from "react";

const slides = [
  {
    title: "Video Studio",
    description: "Transform ideas into captivating visual stories",
    images: [["/images/loginVideo.png"]],
  },
  {
    title: "Image Studio",
    description: "Turn your imagination into breathtaking visuals and art",
    images: [
      ["/images/before4.png", "/images/after4.png"],
      ["/images/before5.png", "/images/after5.png"],
      ["/images/before6.png", "/images/after6.png"],
    ],
  },
  {
    title: "Avatar Studio",
    description: "Express yourself with diverse styles and endless possibilities",
    images: [
      ["/images/before7.png", "/images/after7.png"],
      ["/images/before8.png", "/images/after8.png"],
      ["/images/before9.png", "/images/after9.png"],
    ],
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // Auto scroll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 bg-gradient-to-b from-purple-500 to-pink-400 text-white relative transition-all duration-1000 ease-linear">
      <h2 className="text-2xl md:text-4xl font-bold mb-3 text-center">{slides[current].title}</h2>
      <p className="text-center mb-6 text-sm md:text-lg">{slides[current].description}</p>

      <div className="flex justify-center items-center">
        <img
          src={
            slides[current].title === "Video Studio"
              ? "/images/loginVideo.png"
              : slides[current].title === "Image Studio"
              ? "/images/loginImage.png"
              : "/images/loginAvatar.png"
          }
          alt={slides[current].title}
          className="object-contain rounded w-60 h-60 md:w-80 md:h-80"
        />
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              current === index ? "bg-white" : "bg-white opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const LoginAndSignup = ({ open, handleModalClose }) => {
  const dispatch = useDispatch();
  const { sendEvent, sendGTM } = useGTM();
  const { removeUtmId } = usePlanModal();

  const { mutate: loginGoogleApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/auth/login-google`, obj),
    {
      onSuccess: (res) => {
        loginData(res.data.token, res.data.user.name, res.data.user.email, res.data.user.id);
        dispatch(setUserData(res?.data?.user));
        dispatch(
          setToken({
            accessToken: res.data.token,
            refreshToken: res.data.token,
            isLoggedIn: true,
          })
        );
        sendEvent({
          event: "signup_successful",
          email: res?.data?.user?.email,
          name: res?.data?.user?.name,
          signup_method: "Google",
        });
        sendGTM({
          event: "signup_successful",
          email: res?.data?.user?.email,
          name: res?.data?.user?.name,
          signup_method: "Google",
        });
        handleModalClose();
      },
      onError: (error) => {
        alert(error.response.data.message);
      },
    }
  );

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const access_token = tokenResponse.access_token;
      const payload = {
        access_token,
        utm_source: "google",
        utm_id: "free_trial_1717684987231_593",
      };
      loginGoogleApi(payload);
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: "openid email profile",
    flow: "implicit",
  });

  const handleLoginClick = () => {
    sendEvent({
      event: "signup_initiated",
      signup_method: "Google",
    });
    login();
  };

  return (
    <>
      <Modal
        style={{ zIndex: "9999", backdropFilter: "blur(44px)", blur: "40px" }}
        open={open}
        onClose={handleModalClose}
        closeAfterTransition
      >
        <Box
          sx={{
            background: "white",
            width: { xs: "95vw", md: "80vw" },
            height: { xs: "90vh", md: "80vh" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            margin: "auto",
            top: { xs: "5vh", md: "10vh" },
          }}
        >
          {/* Left Panel */}
          <Box sx={{ flex: 1 }}>
            <Carousel />
          </Box>

          {/* Right Panel */}
          <Box className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8">
            <Box
              sx={{
                cursor: "pointer",
                background: "#fff",
                borderRadius: "100px",
                position: "absolute",
                right: "10px",
                top: "10px",
                height: "24px",
                width: "24px",
              }}
              component="img"
              src="/images/close.svg"
              onClick={handleModalClose}
            />

            <img
              src={"/images/logo.svg"}
              alt="VideoNation Logo"
              className="w-32 md:w-40"
              loading="eager"
              decoding="async"
            />

            <p className="text-black text-center text-xl md:text-2xl font-semibold mt-6">
              Welcome to VideoNation
            </p>

            <button style={styles.googleButton} onClick={() => handleLoginClick()} className="mt-6">
              <div className="flex items-center justify-center">
                <span className="h-6 w-6">
                  <img className="h-6 w-6" src="/images/icons/google.svg" alt="Google Icon" />
                </span>
                &nbsp;
                <span>Login with Google</span>
              </div>
            </button>

            <div className="mt-4 text-xs md:text-sm text-center">
              <span className="text-gray-500">
                By signing up, you agree to our{" "}
                <a href="/terms" target="_blank" className="text-[#FF61A6]">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="text-[#FF61A6]">
                  Privacy Policy
                </a>
              </span>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default LoginAndSignup;
