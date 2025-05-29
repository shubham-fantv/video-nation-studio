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

  const [mediaType, setMediaType] = useState("video");
  const [mergedContent, setMergedContent] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Compute paginated slice
  const paginatedContent = Array.isArray(mergedContent)
    ? mergedContent.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const totalPages = Math.ceil(mergedContent.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [mergedContent]);

  useEffect(() => {
    setMyVideo(data || []);
    setMyImage(data1 || []);
  }, [data, data1]);

  useEffect(() => {
    const videosWithType = (data || []).map((item) => ({
      ...item,
      type: "video",
    }));

    const imagesWithType = (data1 || []).map((item) => ({
      ...item,
      type: "image",
    }));

    const mergedData = [...videosWithType, ...imagesWithType];

    const sortedByDate = mergedData.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at); // latest first
    });

    setMergedContent(sortedByDate); // <-- new state variable for the unified list
  }, [data, data1]);

  return (
    <div className="min-h-screen w-full py-6 max-w-[1120px] mx-auto">
      <h1 className="text-black text-3xl font-bold text-center mb-8">My Usage</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full table-fixed text-left text-sm text-black border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2 w-[25%]">Prompt</th>
              <th className="px-4 py-2 w-[10%]">Type</th>
              <th className="px-4 py-2 w-[10%]">Status</th>
              <th className="px-4 py-2 w-[10%]">Credits Used</th>
              <th className="px-4 py-2 w-[15%]">Created At</th>
              <th className="px-4 py-2 w-[10%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedContent.length > 0 ? (
              paginatedContent.map((item, index) => (
                <tr
                  key={index}
                  className={`border-t border-gray-200 ${
                    item.status === "completed"
                      ? "hover:bg-gray-50 cursor-pointer"
                      : "cursor-not-allowed opacity-60"
                  }`}
                  onClick={() => {
                    if (item.status === "completed") {
                      router.push(
                        item.type === "video"
                          ? `/generate-video/${item._id || item.id}`
                          : `/generate-image/${item._id || item.id}`
                      );
                      sendEvent({
                        event: "button_clicked",
                        button_text: "View",
                        page_name: "Usage",
                        page_number: currentPage || 1,
                        interaction_type: "Standard button",
                        button_id: "usage_view_btn",
                      });
                    }
                  }}
                >
                  <td className="px-4 py-2 truncate">{item?.prompt || "-"}</td>
                  <td className="px-4 py-2 capitalize">{item?.type}</td>
                  <td className="px-4 py-2 capitalize">{item?.status}</td>
                  <td className="px-4 py-2">{item?.creditsUsed || 0}</td>
                  <td className="px-4 py-2">
                    {moment(item?.created_at).format("MMMM D, YYYY, h:mm A")}
                  </td>
                  <td className="px-4 py-2 text-blue-500 underline">View</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  No content found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden">
        {paginatedContent.length > 0 ? (
          <div className="space-y-4">
            {paginatedContent.map((item, index) => (
              <div
                key={index}
                className={`border border-gray-300 rounded-lg p-4 bg-white ${
                  item.status === "completed"
                    ? "hover:bg-gray-50 cursor-pointer"
                    : "cursor-not-allowed opacity-60"
                }`}
                onClick={() => {
                  if (item.status === "completed") {
                    router.push(
                      item.type === "video"
                        ? `/generate-video/${item._id || item.id}`
                        : `/generate-image/${item._id || item.id}`
                    );
                    sendEvent({
                      event: "button_clicked",
                      button_text: "View",
                      page_name: "Usage",
                      page_number: currentPage || 1,
                      interaction_type: "Standard button",
                      button_id: "usage_view_btn",
                    });
                  }
                }}
              >
                <div className="space-y-3">
                  <div>
                    <div className="text-sm  font-semibold mb-1 font-semibold text-[#1E1E1E]">
                      PROMPT
                    </div>
                    <div className="text-sm text-black break-words">{item?.prompt || "-"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm  font-semibold mb-1 font-semibold text-[#1E1E1E]">
                        TYPE
                      </div>
                      <div className="text-sm text-black capitalize">{item?.type}</div>
                    </div>
                    <div>
                      <div className="text-sm  font-semibold mb-1 font-semibold text-[#1E1E1E]">
                        STATUS
                      </div>
                      <div className="text-sm text-black capitalize">{item?.status}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm  font-semibold mb-1 font-semibold text-[#1E1E1E]">
                        CREDITS USED
                      </div>
                      <div className="text-sm text-black">{item?.creditsUsed || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm  font-semibold mb-1 font-semibold text-[#1E1E1E]">
                        CREATED AT
                      </div>
                      <div className="text-sm text-black">
                        {moment(item?.created_at).format("MMM D, YYYY")} &nbsp;
                        <span className="text-xs text-gray-600">
                          {moment(item?.created_at).format("h:mm A")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.status === "completed" && (
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-blue-500 underline text-sm font-medium">View</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-8 text-center text-gray-500 bg-white">
            No content found.
          </div>
        )}
      </div>

      {/* Pagination - Works for both mobile and desktop */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border rounded disabled:opacity-50 text-sm"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 border rounded text-sm ${
                currentPage === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border rounded disabled:opacity-50 text-sm"
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
  const data = await fetcher.get(
    `${FANTV_API_URL}/api/v1/ai-video?page=1&limit=500`,
    {
      headers: {
        ...(!!authToken && { Authorization: `Bearer ${authToken}` }),
      },
    },
    "default"
  );

  const data1 = await fetcher.get(
    `${FANTV_API_URL}/api/v1/ai-image?page=1&limit=500`,
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
