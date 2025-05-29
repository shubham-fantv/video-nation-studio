import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Index() {
  const [timeLeft, setTimeLeft] = useState(30);
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center pl-2 gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Avatar Studio</span>
        </button>
      </div>

      {/* Main Content */}
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
