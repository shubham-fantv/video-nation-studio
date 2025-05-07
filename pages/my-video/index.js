import React, { useEffect, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { FANTV_API_URL } from "../../src/constant/constants";
import fetcher from "../../src/dataProvider";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import moment from "moment";

const VideoGrid = ({ data }) => {
  console.log("🚀 ~ VideoGrid ~ data:", data);
  const [myVideo, setMyVideo] = useState(data);
  const router = useRouter();

  useEffect(() => {
    setMyVideo(myVideo);
  }, []);

  return (
    <div className=" min-h-screen w-full p-6">
      <h1 className="text-black text-3xl font-bold text-center mb-8">My Videos</h1>
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
                  <div className=" pt-1 flex justify-between items-center">
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

  if (!data.success) {
    return { notFound: true };
  }

  return {
    props: {
      data: data?.data || [],
    },
  };
}
