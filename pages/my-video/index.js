import React, { useEffect, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { FANTV_API_URL } from "../../src/constant/constants";
import fetcher from "../../src/dataProvider";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

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

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {myVideo?.map((video) => (
          <div key={video.id} className="flex flex-col">
            <div className="relative rounded-lg overflow-hidden mb-2">
              {video.finalVideoUrl ? (
                <video
                  src={video?.finalVideoUrl}
                  muted
                  // poster={video.imageUrl}
                  controls
                  loop
                  playsInline
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                  onEnded={(e) => e.target.play()}
                  className="w-full  h-full object-cover rounded-xl"
                />
              ) : (
                <img
                  src={video?.imageUrl}
                  alt={video?.prompt}
                  className="w-full h-48 object-cover"
                />
              )}
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-white text-sm truncate">{video?.prompt}</h3>
              <div className="flex space-x-2">
                <button className="text-white p-1 rounded-full hover:bg-gray-700">
                  <ArrowUpRight size={18} />
                </button>
                <button className="text-white p-1 rounded-full hover:bg-gray-700">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      <div className="mt-2 min-h-[50vh]" style={{ maxWidth: "1120px" }}>
        <div>
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
            {myVideo &&
              myVideo?.map((video, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/generate-video/${video?._id}`)}
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
                      className="w-full h-full object-cover rounded-xl"
                    />

                    {video?.status !== "completed" && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-xl">
                        <p className="text-white font-medium text-lg">{video?.status}</p>
                      </div>
                    )}
                    <div className=" pt-1 flex justify-between items-center">
                      <h3 className="text-black text-sm truncate">{video?.prompt}</h3>
                    </div>
                  </div>
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
