import React from "react";
import { ArrowUpRight, Download } from "lucide-react";

const VideoGrid = () => {
  const videos = [
    {
      id: 1,
      thumbnail: "images/content/thumb1.png",
      title: "Girl singing on stage",
      duration: "2:00",
    },
    {
      id: 2,
      thumbnail: "images/content/thumb2.png",
      title: "A dog and man having converstion",
      duration: "2:00",
    },
    {
      id: 3,
      thumbnail: "images/content/thumb3.png",
      title: "Man Facetiming",
      duration: "2:00",
    },
    {
      id: 4,
      thumbnail: "images/content/thumb1.png",
      title: "Girl singing on stage",
      duration: "2:00",
    },
    {
      id: 5,
      thumbnail: "images/content/thumb2.png",
      title: "A dog and man having converstion",
      duration: "2:00",
    },
    {
      id: 6,
      thumbnail: "images/content/thumb3.png",
      title: "Man Facetiming",
      duration: "2:00",
    },
  ];

  return (
    <div className=" min-h-screen w-full p-6">
      <h1 className="text-white text-3xl font-bold text-center mb-8">My Videos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="flex flex-col">
            <div className="relative rounded-lg overflow-hidden mb-2">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-0.5 rounded-sm text-sm">
                {video.duration}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-white text-sm">{video.title}</h3>
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
      </div>
    </div>
  );
};

export default VideoGrid;
