import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import useGoogleLoginHook from "../hooks/useGoogleLogin";
const GoogleAuth = ({ text, handleModalClose }) => {
  // const login = useGoogleLogin({
  //   onSuccess: (codeResponse) => console.log(codeResponse),
  //   flow: "auth-code",
  //   flow: 'implicit',
  // });

  const [_, loginGoogle] = useGoogleLoginHook();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Access Token:", tokenResponse);
      // Fetch ID Token
      // const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      //   headers: {
      //     Authorization: `Bearer ${tokenResponse.access_token}`,
      //   },
      // });

      // const userInfo = await userInfoResponse.json();
      const id_token = tokenResponse.code;
      loginGoogle({ id_token });
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: "openid email profile", // Ensure OpenID scope is included for ID token
    flow: "auth-code", // Ensures immediate token retrieval
  });
  return (
    <div className="text-white">
      <button onClick={() => login()}>
        <span className="google-icon">G</span>
        {text}
      </button>
    </div>
  );
};

export default GoogleAuth;
