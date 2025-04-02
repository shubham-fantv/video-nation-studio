import { useState } from "react";
import { useMutation } from "@tanstack/react-query"; // Updated import
import fetcher from "../../dataProvider";

const useGenerateVideo = () => {
  const [isGoogleLoginSuccess, setIsGoogleLoginSuccess] = useState(false);

  const generateVideoApi = useMutation({
    mutationFn: async (body) => {
      return fetcher.post(`/ai-video`, body);
    },
    onSuccess: (res) => {
      console.log("🚀 ~ useGoogleLogin ~ res:", res);
      setIsGoogleLoginSuccess(true);
    },
    onError: (err) => {
      console.log("🚀 ~ useGoogleLogin ~ err:", err);
    },
  });

  return [isGoogleLoginSuccess, generateVideoApi.mutate];
};

export default useGenerateVideo;
