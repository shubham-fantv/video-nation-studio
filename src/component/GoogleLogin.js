import { makeStyles } from "@mui/styles";
import React from "react";
import GoogleLogin from "react-google-login";
import useGoogleLogin from "../hooks/useGoogleLogin";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "500",
    fontSize: "16",
    lineHeight: "30px",
    textTransform: "capitalize",
    borderRadius: "8",
    boxShadow: "none",
    border: "1px solid",
    borderColor: "#F3938A",
    color: "#EA4335",
    padding: "8px 16px",
    outline: "none",
    "&:hover": {
      backgroundColor: "transparent",
      boxShadow: "none",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "12",
      lineHeight: "16px",
      padding: "8px",
    },
  },
  startIcon: {
    [theme.breakpoints.down("sm")]: {
      marginRight: 4,
    },
  },
}));

export default function GoogleLogin1(props) {
  const [_, loginGoogle] = useGoogleLogin();

  const handleFailure = (e) => {
    console.log("failure");
    console.log(e);
  };

  const handleSuccess = (response) => {
    console.log("🚀 ~ handleSuccess ~ response:", response);
    var referralCode;
    var id_token = response?.tokenId;
    let userInviteCode = typeof window !== "undefined" && localStorage?.getItem("inviteCode");

    let deviceId = typeof window !== "undefined" && localStorage.getItem("deviceID");

    if (userInviteCode && userInviteCode.length == 6) {
      referralCode = userInviteCode;
    }
    loginGoogle({ id_token, referralCode, deviceId, userId });
    props?.handleModalClose();
  };

  const { text, fullWidth, onClick } = props;
  return (
    <GoogleLogin
      clientId="508551165708-227o7s8mmoc7sdt41999gqjratr78tjq.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      // cookiePolicy={"single_host_origin"}
      render={(renderProps) => (
        <>
          <button
            type="button"
            style={{ border: "none", cursor: "pointer" }}
            onClick={() => {
              renderProps.onClick();
            }}
            disabled={renderProps.disabled}
            className={`${props?.className}`}
          >
            <img
              src="/images/home/new-google.svg"
              style={{ verticalAlign: "middle", display: "inline" }}
              alt=""
            />
            {text}
          </button>
        </>
      )}
    />
  );
}
