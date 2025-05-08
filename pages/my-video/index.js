import React, { useEffect, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { FANTV_API_URL } from "../../src/constant/constants";
import fetcher from "../../src/dataProvider";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import moment from "moment";

const VideoGrid = ({ data, data1 }) => {
  console.log("🚀 ~ VideoGrid ~ data:", data);
  const [myVideo, setMyVideo] = useState(data);
  const [myImage, setMyImage] = useState(data1);
  const router = useRouter();

  const [mediaType, setMediaType] = useState("video");

  useEffect(() => {
    setMyVideo(myVideo);
    setMyImage(myImage);
  }, []);

  useEffect(() => {
    setMyVideo(data || []);
    setMyImage(data1 || []);
  }, [data, data1]);

  return (
    <div className=" min-h-screen w-full p-6">
      <h1 className="text-black text-3xl font-bold text-center mb-8">My Library</h1>
          {/* 🔄 Toggle Switch */}
          <div className="flex mb-8 w-[200px] bg-gray-200 rounded-full p-1">
              <button
                onClick={() => setMediaType("video")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  mediaType === "video"
                    ? "bg-[#1E1E1E] text-white"
                    : "text-gray-700"
                }`}
              >
                Video
              </button>
              <button
                onClick={() => setMediaType("image")}
                className={`px-6 py-2 w-[300px] rounded-full text-sm font-medium transition-all ${
                  mediaType === "image"
                    ? "bg-[#1E1E1E] text-white"
                    : "text-gray-700"
                }`}
              >
                Image
              </button>
            </div>
            {mediaType === "video" ? (
  <div className="mt-2 min-h-[50vh]" style={{ maxWidth: "1120px" }}>
    <div>
      <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
        {myVideo &&
          [...myVideo].reverse().map((video, index) => (
            <div
              key={index}
              onClick={() => router.push(`/generate-video/${video?._id || video?.id}`)}
              className="mb-6 break-inside-avoid rounded-xl transition-transform relative cursor-pointer"
            >
              <div className="relative">
                <video
                  src={video?.finalVideoUrl}
                  muted
                  loop
                  playsInline
                  controls
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                  onEnded={(e) => e.target.play()}
                  className="w-full min-h-[150px] object-cover rounded-xl"
                />
                {video?.status !== "completed" && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-xl">
                    <p className="text-white font-medium text-lg">{video?.status}</p>
                  </div>
                )}
              </div>
              <div className="pt-1 flex justify-between items-center">
                <h3 className="text-black text-sm truncate">&nbsp;{video?.prompt}</h3>
              </div>
              <h3 className="text-black text-sm truncate">
                &nbsp;{moment(video?.created_at).format("MMMM D, YYYY, h:mm A")}
              </h3>
            </div>
          ))}
      </div>
    </div>
  </div>
) : (
  <div className="mt-2 min-h-[50vh]" style={{ maxWidth: "1120px" }}>
    <div>
      <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
        {myImage &&
          [...myImage].reverse().map((image, index) => (
            <div
              key={index}
              onClick={() => router.push(`/generate-image/${image?._id || image?.id}`)}
              className="mb-6 break-inside-avoid rounded-xl transition-transform relative cursor-pointer"
            >
              <div className="relative">
                <img
                  src={image?.imageUrl}
                  alt={image?.prompt || "Generated Image"}
                  className="w-full min-h-[150px] object-cover rounded-xl"
                />
                {image?.status !== "completed" && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-xl">
                    <p className="text-white font-medium text-lg">{image?.status}</p>
                  </div>
                )}
              </div>
              <div className="pt-1 flex justify-between items-center">
                <h3 className="text-black text-sm truncate">&nbsp;{image?.prompt}</h3>
              </div>
              <h3 className="text-black text-sm truncate">
                &nbsp;{moment(image?.created_at).format("MMMM D, YYYY, h:mm A")}
              </h3>
            </div>
          ))}
      </div>
    </div>
  </div>
    )}
      </div>
  );
};

export default VideoGrid;

export async function getServerSideProps(ctx) {
  const cookie = parseCookies(ctx);

  const authToken = cookie["aToken"];
  const data = await fetcher.get(
    `${FANTV_API_URL}/api/v1/ai-video?page=1&limit=100`,
    {
      headers: {
        ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
      },
    },
    "default"
  );

  const data1 = await fetcher.get(
    `${FANTV_API_URL}/api/v1/ai-image?page=1&limit=100`,
    {
      headers: {
        ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
      },
    },
    "default"
  );

  if (!data.success) {
    return { notFound: true };
  }

  if (!data1.success) {
    return { notFound: true };
  }

  return {
    props: {
      data: data?.data || [],
      data1: data1?.data || [],
    },
  };
}
