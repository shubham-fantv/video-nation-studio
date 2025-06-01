import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery } from "react-query";
import { API_BASE_URL, FANTV_API_URL } from "../../../src/constant/constants";
import { useRouter } from "next/router";
import fetcher from "../../../src/dataProvider";
import { useSelector } from "react-redux";

export default function Index() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [headShotStyleData, setHeadShotStyleData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [groupedData, setGroupedData] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState();

  const [selectedImage, setSelectedImage] = useState(data?.images?.[0]);

  const { isLoggedIn, userData } = useSelector((state) => state.user);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const router = useRouter();
  const { isLoading: avatarLoading } = useQuery(
    `${FANTV_API_URL}/api/v1/ai-avatar/photo-avatar/${router?.query?.slug}`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/ai-avatar/photo-avatar/${router?.query?.slug}`),
    {
      enabled: !!router.query.slug,
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setData(data);
        setSelectedImage(data?.images?.[0]);
      },
    }
  );

  const { mutate: generatePhotoAvatarApi } = useMutation(
    (obj) =>
      fetcher.post(`${API_BASE_URL}/api/v1/ai-avatar/photo-avatar/${router.query.slug}`, obj),
    {
      onSuccess: (response) => {
        setLoading(false);
        router.replace(`/image/headshot/${response?.data._id}`, undefined, { scroll: false });
      },
      onError: (error) => {
        setLoading(false);
        const defaultMessage = "Something went wrong. Please try again later.";
        const message = error?.response?.data?.message || error?.message || defaultMessage;
        setSwalProps({
          icon: "error",
          show: true,
          title: "Error",
          text: message,
          confirmButtonText: "OK",
        });
      },
    }
  );

  const handleGeneratePhotoAvatar = () => {
    if (isLoggedIn) {
      if (selectedImages.length > 0) {
        setLoading(true);
        if (userData.credits <= 0) {
          router.push("/subscription");
          return;
        }
        const requestBody = {
          headshots: selectedImages.map((item) => item._id),
        };
        setLoading(true);
        generatePhotoAvatarApi(requestBody);
      } else {
        alert("Select style image");
      }
    } else {
      alert("please login");
    }
  };

  const { isLoading: loadingHeadShot } = useQuery(
    `${FANTV_API_URL}/api/v1/homefeed`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/headshot/headshot`),
    {
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        setHeadShotStyleData(data.filter((item) => item.category !== "Natural"));
      },
    }
  );

  useEffect(() => {
    if (headShotStyleData.length > 0) {
      const grouped = headShotStyleData.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});

      setGroupedData(grouped);
      const categories = Object.keys(grouped);
      setCategoryOrder(categories);

      // Set first category as default selected
      if (!selectedCategory && categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    }
  }, [headShotStyleData, selectedCategory]);

  const getMainImages = () => {
    return categoryOrder.map((category) => ({
      category,
      ...groupedData[category][0],
    }));
  };

  const getRelatedImages = () => {
    if (!selectedCategory || !groupedData[selectedCategory]) {
      return [];
    }
    return groupedData[selectedCategory];
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const toggleImageSelection = (imageObj) => {
    setSelectedImages((prev) => {
      const isSelected = prev.some((img) => img._id === imageObj._id);

      if (isSelected) {
        return prev.filter((img) => img._id !== imageObj._id);
      } else {
        return [...prev, imageObj];
      }
    });
  };

  const isImageSelected = (imageObj) => {
    return selectedImages.some((img) => img._id === imageObj._id);
  };

  const mainImages = getMainImages();
  const relatedImages = getRelatedImages();

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <isLoading title={"Please wait"} />}
      <div className="px-6 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center pl-2 gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Photo Studio</span>
        </button>
      </div>

      {data?.status == "processing" ? (
        <div className=" mx-10 bg-[#F5F5F5] flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="bg-[#EBEBEB] rounded-2xl shadow-sm p-12 mb-8">
              <div className=" rounded-lg mx-auto mb-6">
                <div className="space-y-5 ">
                  <h1 className="text-base font-medium text-gray-900">
                    Hang tight! Just{" "}
                    <span className="text-blue-500 text-xl font-semibold">{timeLeft} minutes</span>{" "}
                    left to bring your image to life.
                  </h1>
                  <p className=" text-sm text-gray-600 text-sm">
                    Rendering in progress. Magic doesn't happen in a blink
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row text-black md:gap-4">
          <div className="w-full md:w-[30%] bg-[#F6F4FF] p-4 border border-[#E4DDFF] ml-8  rounded-xl">
            <div>
              <div className="max-w-xl mx-auto pt-3">
                <h2 className="text-sm font-medium mb-3">Select Headshot Style</h2>
                <div className="flex gap-1 overflow-x-auto mb-4">
                  {mainImages.map((img, idx) => (
                    <div
                      key={img._id}
                      className={`flex flex-col items-center cursor-pointer border-2 rounded-xl ${
                        selectedCategory === img.category
                          ? "border-purple-500"
                          : "border-transparent"
                      }`}
                      onClick={() => handleCategorySelect(img.category)}
                    >
                      <img
                        src={img.url}
                        alt={`${img.category} style`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <span className="text-xs text-[#626262] mt-1">{img.category}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl mb-6">
                  {relatedImages.map((img, idx) => (
                    <div key={img._id} onClick={() => toggleImageSelection(img)}>
                      <div
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition relative ${
                          isImageSelected(img) ? "border-purple-500" : "border-transparent"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`${img.style} - ${img.description}`}
                          className="w-full h-20 object-cover"
                        />
                        {isImageSelected(img) && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-2 h-2 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-xs flex text-center text-[#626262] mt-">
                        {img.style}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex w-full items-center justify-center gap-4 mt-2 mb-6">
                <button
                  disabled={selectedImages?.length == 0}
                  onClick={handleGeneratePhotoAvatar}
                  className="flex w-full items-center text-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 md:px-6 py-2 md:py-3 text-white shadow-md transition-all text-sm md:text-base 
             disabled:bg-gray-400 disabled:cursor-not-allowed disabled:from-gray-200 disabled:to-gray-400"
                >
                  ✨ Generate
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full flex flex-col pr-8 pl-4 items-center ">
            <div className="min-h-screen  w-full  p-6">
              <div className="  w-full  mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">Create an Avatar</h1>
                  <p className="text-lg text-gray-600">
                    Upload photos to create multiple looks for your avatar
                  </p>
                </div>

                {/* Main Content */}
                <div className="bg-[#F6F4FF] rounded-2xl border border-[#E4DDFF] p-8 relative overflow-hidden">
                  <div className="flex justify-center ">
                    <div className="relative">
                      <div className="w-80 h-80 rounded-3xl overflow-hidden border-4  shadow-2xl ">
                        <img
                          src={selectedImage?.imageUrl}
                          alt={selectedImage?.description}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/320x320/e5e7eb/9ca3af?text=Avatar+Image";
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Selected Image Info */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      {selectedImage?.style}
                    </h2>
                    <p className="text-gray-600">{selectedImage?.description}</p>
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="bg-[#E8E6F5] rounded-2xl p-6">
                    <div className="grid grid-cols-4 gap-6">
                      {data?.images?.map((image, index) => (
                        <div key={image.id} className="text-center">
                          <div
                            className={`w-20 h-20 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                              selectedImage?.id === image?.id
                                ? "ring-4 ring-purple-400 shadow-lg scale-105"
                                : "ring-2 ring-gray-200 hover:ring-purple-300"
                            }`}
                            onClick={() => handleImageClick(image)}
                          >
                            <img
                              src={image.imageUrl}
                              alt={image.description}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/80x80/e5e7eb/9ca3af?text=Avatar";
                              }}
                            />
                          </div>
                          <p className="text-sm font-medium text-gray-700 mt-2">
                            Style {index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      withSideBar: false,
    },
  };
}
