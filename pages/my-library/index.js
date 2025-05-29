import React, { useEffect, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { FANTV_API_URL } from "../../src/constant/constants";
import fetcher from "../../src/dataProvider";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import moment from "moment";
import useGTM from "../../src/hooks/useGTM";

const VideoGrid = ({ data, data1 }) => {
  const [myVideo, setMyVideo] = useState(data || []);
  const [myImage, setMyImage] = useState(data1 || []);
  const router = useRouter();
  const { sendEvent } = useGTM();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [mediaType, setMediaType] = useState("video");

  const currentMedia = mediaType === "video" ? [...myVideo].reverse() : [...myImage].reverse();
  const totalPages = Math.ceil(currentMedia.length / itemsPerPage);

  const paginatedMedia = currentMedia.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset page on media type change
  }, [mediaType]);

  // Sync with URL query (e.g., ?tab=image)
  useEffect(() => {
    if (router.isReady) {
      const tabParam = router.query.tab;
      if (tabParam === "image" || tabParam === "video") {
        setMediaType(tabParam);
        setCurrentPage(1);
      }
    }
  }, [router.isReady, router.query.tab]);

  useEffect(() => {
    setMyVideo(data || []);
    setMyImage(data1 || []);
  }, [data, data1]);

  return (
    <div className="min-h-screen w-full md:p-6">
      <h1 className="text-black text-3xl font-bold text-center mb-8">My Library</h1>

      <div className="flex mb-8 w-[200px] bg-gray-200 rounded-full p-1">
        <button
          onClick={() => {
            setMediaType("video");
            sendEvent({
              event: "button_clicked",
              button_text: "Video",
              page_name: "My Library",
              interaction_type: "Tab Button",
              button_id: "lib_video_tab_btn",
            });
          }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            mediaType === "video" ? "bg-[#1E1E1E] text-white" : "text-gray-700"
          }`}
        >
          Video
        </button>
        <button
          onClick={() => {
            setMediaType("image");
            sendEvent({
              event: "button_clicked",
              button_text: "Image",
              page_name: "My Library",
              interaction_type: "Tab Button",
              button_id: "lib_image_tab_btn",
            });
          }}
          className={`px-6 py-2 w-[300px] rounded-full text-sm font-medium transition-all ${
            mediaType === "image" ? "bg-[#1E1E1E] text-white" : "text-gray-700"
          }`}
        >
          Image
        </button>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 pr-8 sm:pr-0 lg:pr-0">
        {paginatedMedia.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              router.push(
                mediaType === "video"
                  ? `/generate-video/${item?._id || item?.id}`
                  : `/generate-image/${item?._id || item?.id}`
              )
            }
            className="w-full md:w-[250px] mb-6 break-inside-avoid rounded-xl transition-transform relative cursor-pointer"
          >
            <div className="relative">
              {mediaType === "video" ? (
                <video
                  src={item?.finalVideoUrl}
                  muted
                  loop
                  playsInline
                  controls
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                  onEnded={(e) => e.target.play()}
                  className="w-full min-h-[150px] object-cover rounded-xl"
                />
              ) : (
                <img
                  src={item?.finalImageUrl}
                  alt={item?.prompt || "Generated Image"}
                  className="w-full min-h-[150px] object-cover rounded-xl"
                />
              )}

              {item?.status !== "completed" && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-xl">
                  <p className="text-white font-medium text-lg">{item?.status}</p>
                </div>
              )}
            </div>
            <div className="pt-1 flex justify-between items-center">
              <h3 className="text-black text-sm truncate">&nbsp;{item?.prompt}</h3>
            </div>
            <h3 className="text-black text-sm truncate">
              &nbsp;{moment(item?.created_at).format("MMMM D, YYYY, h:mm A")}
            </h3>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;

export async function getServerSideProps(ctx) {
  const cookie = parseCookies(ctx);
  const authToken = cookie["aToken"];

  try {
    const [videoRes, imageRes] = await Promise.all([
      fetcher.get(
        `${FANTV_API_URL}/api/v1/ai-video?page=1&limit=500`,
        {
          headers: {
            ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
          },
        },
        "default"
      ),
      fetcher.get(
        `${FANTV_API_URL}/api/v1/ai-image?page=1&limit=500`,
        {
          headers: {
            ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
          },
        },
        "default"
      ),
    ]);

    return {
      props: {
        data: videoRes.success ? videoRes.data : [],
        data1: imageRes.success ? imageRes.data : [],
      },
    };
  } catch (error) {
    console.error("Error fetching data in getServerSideProps:", error);
    return {
      props: {
        data: [],
        data1: [],
      },
    };
  }
}
