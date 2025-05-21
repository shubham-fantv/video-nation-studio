import React, { useEffect, useState } from "react";

const ResponsiveWrapper = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 1020);
    };

    checkWidth(); // initial check

    window.addEventListener("resize", checkWidth);

    return () => {
      window.removeEventListener("resize", checkWidth);
    };
  }, []);

  if (isDesktop === null) return null; // avoid SSR mismatch

  if (!isDesktop) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100 text-center px-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          <div className="justify-center flex">
            <img
              src={"/images/logo.svg"}
              alt="VideoNation Logo"
              width={180}
              loading="eager"
              decoding="async"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800  my-6 ">
            Welcome to VideoNation{" "}
          </p>
          Please explore this app on a desktop view
        </h2>
      </div>
    );
  }

  return <>{children}</>;
};

export default ResponsiveWrapper;
