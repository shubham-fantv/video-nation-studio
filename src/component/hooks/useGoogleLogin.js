import { useState } from "react";
import { useMutation } from "react-query";
import fetcher from "../../dataProvider";

const useGoogleLogin = () => {
  const [isGoogleLoginSuccess, setIsGoogleLoginSuccess] = useState(false);
  const { mutate: loginGoogle } = useMutation(
    ({ id_token, referralCode, deviceId, userId }) =>
      fetcher.post(`v1/auth/login-google`, {
        id_token,
      }),
    {
      onSuccess: (res) => {
        console.log("🚀 ~ useGoogleLogin ~ res:", res);
        setIsGoogleLoginSuccess(true);
      },
      onError: (err) => {
        console.log("🚀 ~ useGoogleLogin ~ err:", err);
      },
    }
  );

  return [isGoogleLoginSuccess, loginGoogle];
};

export default useGoogleLogin;
