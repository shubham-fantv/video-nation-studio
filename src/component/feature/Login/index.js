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

const LoginAndSignup = ({ open, handleModalClose }) => {
  const dispatch = useDispatch();
  const { sendEvent } = useGTM();
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
      const utm_source = localStorage.getItem("utm_source");
      const utm_id = localStorage.getItem("utm_id");

      const payload = { access_token };

      if (utm_source && utm_id) {
        payload.utm_source = utm_source;
        payload.utm_id = utm_id;
      }

      loginGoogleApi(payload);
      localStorage.removeItem("utm_source");
      localStorage.removeItem("utm_id");
      removeUtmId();
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
        <Box sx={styles.wrapper}>
          <Box
            sx={{
              cursor: "pointer",
              background: "#fff",
              borderRadius: "100px",
              position: "absolute",
              right: "5px",
              top: "5px",
              height: "20px",
              width: "20px",
            }}
            component="img"
            src="/images/close.svg"
            onClick={handleModalClose}
            className="text-white"
          />
          <div className="justify-center flex">
            <img
              src={"/images/logo.svg"}
              alt="VideoNation Logo"
              width={140}
              loading="eager"
              decoding="async"
            />
          </div>
          <p className="text-white text-center text-2xl font-semibold  mt-6 ">
            Welcome to VideoNation{" "}
          </p>
          <button style={styles.googleButton} onClick={() => handleLoginClick()}>
            <div className="text-white flex align-center justify-center">
              <span className="h-6 w-6">
                <img className="h-6 w-6" src="/images/icons/google.svg" />{" "}
              </span>{" "}
              &nbsp;
              <span>Sign in with Google</span>
            </div>
          </button>
          <div>
            <span className="text-white text-sm">
              By signing up, you agree to our{" "}
              <a href="/terms" target="_blank" className="text-[#FFA0FF]">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="text-[#FFA0FF]">
                Privacy Policy
              </a>
            </span>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default LoginAndSignup;
