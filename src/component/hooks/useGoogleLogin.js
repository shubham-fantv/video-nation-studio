import { useState } from "react";
import { useMutation } from "@tanstack/react-query"; // Updated import
import fetcher from "../../dataProvider";

const useGoogleLoginHook = () => {
  const [isGoogleLoginSuccess, setIsGoogleLoginSuccess] = useState(false);

  const loginGoogle = useMutation({
    mutationFn: async ({ id_token }) => {
      return fetcher.post(`v1/auth/login-google`, { id_token });
    },
    onSuccess: (res) => {
      console.log("🚀 ~ useGoogleLogin ~ res:", res);
      setIsGoogleLoginSuccess(true);
    },
    onError: (err) => {
      console.log("🚀 ~ useGoogleLogin ~ err:", err);
    },
  });

  return [isGoogleLoginSuccess, loginGoogle.mutate];
};

export default useGoogleLoginHook;
