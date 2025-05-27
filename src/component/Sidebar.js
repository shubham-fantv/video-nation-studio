// import { Box } from "@mui/material";
// import Link from "next/link";
// import React from "react";
// import styles from "./styles";

// function Sidebar({ children }) {
//   return (
//     <Box sx={styles.wrapper}>
//       <Box sx={styles.sidebar}>
//         <div class="flex h-screen">
//           <aside class="p-6">
//             <ul>
//               <Link  legacyBehavior href={"/"} passHref>
//                 <li
//                   class="mb-6 cursor-pointer rounded-xl bg-[#FFFFFF0D] p-3 flex items-center"
//                   style={{ border: "1px solid #3E3E3E" }}
//                 >
//                   <span class="text-white mr-3">
//                     <svg
//                       class="w-6 h-6 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
//                     </svg>
//                   </span>
//                   <span class="text-sm text-[#D2D2D2]">Home</span>
//                 </li>
//               </Link>
//             </ul>

//             <div class="mb-4">
//               <h2 class="text-white text-base font-semibold px-4 mb-2">Studios</h2>
//               <ul>
//                 <li>
//                   <a href="/video-studio" class="flex items-center  py-2">
//                     <span class="text-white mr-3">
//                       <svg
//                         class="w-6 h-6 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                       >
//                         <path d="M17 10.5V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z" />
//                       </svg>
//                     </span>
//                     <span class="text-sm text-[#D2D2D2]">Video Studio</span>
//                   </a>
//                 </li>
//               </ul>
//               <ul>
//                 <li>
//                   <a href="/my-video" class="flex items-center  py-2">
//                     <span class="text-white mr-3">
//                       <svg
//                         class="w-6 h-6 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                       >
//                         <path d="M17 10.5V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z" />
//                       </svg>
//                     </span>
//                     <span class="text-sm text-[#D2D2D2]">My Video</span>
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div class="mt-6">
//               <h2 class="text-white text-base font-semibold px-4 mb-2">
//                 Subscription and Billings
//               </h2>
//               <ul>
//                 <li>
//                   <a href="/subscription" class="flex items-center  py-2">
//                     <span class="text-white mr-3">
//                       <svg
//                         class="w-6 h-6 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                       >
//                         <path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4h20zM2 12v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6H2z" />
//                       </svg>
//                     </span>
//                     <span class="text-sm text-[#D2D2D2]">Manage Subscription</span>
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </aside>
//         </div>
//       </Box>
//       <Box sx={styles.mainWrapper}>
//         <Box sx={styles.contentFavtv}>{children}</Box>
//       </Box>
//     </Box>
//   );
// }

// export default Sidebar;

import { Box } from "@mui/material";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import styles from "./styles";
import useGTM from "../hooks/useGTM";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import CLink from "./CLink";
import { getPageName } from "../utils/common";

function Sidebar({ children }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const { isLoggedIn } = useSelector((state) => state.user);
  const isActiveLink = (...paths) => {
    const exactMatch = paths.find((path) => router.pathname === path);
    if (exactMatch) return true;

    // If no exact match, fall back to the longest prefix match (most specific)
    const matchedPrefix = paths
      .filter((path) => path !== "/")
      .sort((a, b) => b.length - a.length) // prioritize longer (more specific) paths
      .find((path) => router.pathname.startsWith(path));

    return matchedPrefix ? router.pathname.startsWith(matchedPrefix) : false;
  };

  // Style for active menu items
  const activeStyle = {
    backgroundColor: "#FFFFFF0D",
    border: "1px solid #3E3E3E",
  };
  const { userData } = useSelector((state) => state.user);
  const { sendEvent } = useGTM();

  const handleBack = () => {
    sendEvent({
      event: "button_clicked",
      button_text: "Back",
      interaction_type: "Sidebar Navigation",
      section_name: "Sidebar",
      button_id: "sb_back_nav_lnk",
      page_name: getPageName(router?.pathname),
    });

    if (isActiveLink("/payment-success")) {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.sidebar}>
        <div className="flex h-screen">
          <aside className="px-6">
            {!isActiveLink("/") && (
              <ul>
                <div onClick={() => handleBack()}>
                  <li className={`mb-3 cursor-pointer rounded-xl p-3 flex items-center`}>
                    <img
                      style={{ height: "20px", width: "20px" }}
                      src="/images/icons/arrow-left.svg"
                    />
                    <span className="text-sm text-black pl-2">Back</span>
                  </li>
                </div>
              </ul>
            )}

            {isActiveLink("/") && (
              <ul>
                <Link legacyBehavior href="/" passHref>
                  <li
                    className={`mb-3 cursor-pointer rounded-xl p-3 flex items-center ${
                      isActiveLink("/") ? "bg-[#FFFFFF0D] font-bold" : ""
                    }`}
                    style={isActiveLink("/") ? activeStyle : {}}
                  >
                    <img src="/images/icons/home.svg" />
                    <span className="text-sm text-black pl-2">Home</span>
                  </li>
                </Link>
              </ul>
            )}

            <div className="mb-4">
              <h2 className="text-black text-base font-semibold px-4 ">Studios</h2>
              <ul>
                <li>
                  <CLink
                    route="/video-studio"
                    handleClick={() =>
                      sendEvent({
                        event: "button_clicked",
                        button_text: "Video Studio",
                        interaction_type: "Sidebar Navigation",
                        section_name: "Sidebar",
                        navigation_group: "Studios",
                        button_id: "sb_studio_nav_lnk",
                        page_name: getPageName(router?.pathname),
                      })
                    }
                  >
                    <div className="flex items-center  pt-1">
                      <div
                        className={`flex items-center rounded-xl p-3 w-full ${
                          isActiveLink("/video-studio", "/category", "/generate-video")
                            ? "bg-[#FFFFFF0D] font-bold"
                            : ""
                        }`}
                        style={
                          isActiveLink("/video-studio", "/category", "/generate-video")
                            ? activeStyle
                            : {}
                        }
                      >
                        <img
                          style={{ height: "20px", width: "20px" }}
                          src="/images/icons/video.svg"
                          className="text-black"
                        />{" "}
                        &nbsp;
                        <span className="text-sm text-black pl-2">Video Studio</span>
                      </div>
                    </div>
                  </CLink>
                </li>
                <li>
                  <CLink
                    route="/image-studio"
                    handleClick={() =>
                      sendEvent({
                        event: "button_clicked",
                        button_text: "Image Studio",
                        interaction_type: "Sidebar Navigation",
                        section_name: "Sidebar",
                        navigation_group: "Studios",
                        button_id: "sb_studio_nav_lnk",
                        page_name: getPageName(router?.pathname),
                      })
                    }
                  >
                    <div className="flex items-center  pt-1">
                      <div
                        className={`flex items-center rounded-xl p-3 w-full ${
                          isActiveLink("/image-studio", "/image-category", "/generate-image")
                            ? "bg-[#FFFFFF0D] font-bold"
                            : ""
                        }`}
                        style={
                          isActiveLink("/image-studio", "/image-category", "/generate-image")
                            ? activeStyle
                            : {}
                        }
                      >
                        <img
                          style={{ height: "20px", width: "20px" }}
                          src="/images/icons/gallery.svg"
                          className="text-black"
                        />{" "}
                        &nbsp;
                        <span className="text-sm text-black pl-2">Image Studio</span>
                      </div>
                    </div>
                  </CLink>
                </li>
                <li>
                  <Link
                    href="/avatar-studio"
                    handleClick={() =>
                      sendEvent({
                        event: "button_clicked",
                        button_text: "Avatar Studio",
                        interaction_type: "Sidebar Navigation",
                        section_name: "Sidebar",
                        navigation_group: "Studios",
                        button_id: "sb_studio_nav_lnk",
                        page_name: "Home Page",
                      })
                    }
                  >
                    <div className="flex items-center  pt-1">
                      <div
                        className={`flex items-center rounded-xl p-3 w-full ${
                          isActiveLink("/avatar-studio", "/generate-avatar")
                            ? "bg-[#FFFFFF0D] font-bold"
                            : ""
                        }`}
                        style={
                          isActiveLink("/avatar-studio", "/generate-avatar") ? activeStyle : {}
                        }
                      >
                        <img
                          style={{ height: "20px", width: "20px" }}
                          src="/images/icons/video.svg"
                          className="text-black"
                        />{" "}
                        &nbsp;
                        <span className="text-sm text-black pl-2">Avatar Studio</span>
                        {/* <sup
                            style={{
                              marginLeft: "4px",
                              contentVisibility: "auto",
                              background:
                                "linear-gradient(96.61deg, #FFA0FF 4.52%, #653EFF 102.26%)",
                              right: "0px",
                              padding: " 8px",
                              borderRadius: " 10px",
                              fontSize: "8px",
                              fontWeight: 700,
                              color: "rgb(255, 255, 255)",
                              textAlign: "center",
                              height: "max-content",
                            }}
                          >
                            coming Soon
                          </sup> */}
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
              <ul>
                {isLoggedIn && (
                  <li>
                    <CLink
                      route="/my-library"
                      handleClick={() =>
                        sendEvent({
                          event: "button_clicked",
                          button_text: "My Library",
                          interaction_type: "Sidebar Navigation",
                          section_name: "Sidebar",
                          navigation_group: "Studios",
                          button_id: "sb_studio_nav_lnk",
                          page_name: getPageName(router?.pathname),
                        })
                      }
                    >
                      <div className="flex items-center   cursor-pointer">
                        <div
                          className={`flex items-center rounded-xl p-3 w-full ${
                            isActiveLink("/my-library") ? "bg-[#FFFFFF0D] font-bold" : ""
                          }`}
                          style={isActiveLink("/my-library") ? activeStyle : {}}
                        >
                          <span className="text-black">
                            <svg
                              className="w-6 h-6 text-black"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17 10.5V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z" />
                            </svg>
                          </span>
                          <span className="text-sm text-black pl-2">My Library</span>
                        </div>
                      </div>
                    </CLink>
                  </li>
                )}
              </ul>
            </div>

            {isLoggedIn && (
              <div className="">
                <h2 className=" text-black text-base font-semibold px-4 mb-2">Profile</h2>
                <ul>
                  <li>
                    <CLink
                      route="/subscription"
                      handleClick={() =>
                        sendEvent({
                          event: "button_clicked",
                          button_text: "Manage Subscription",
                          interaction_type: "Sidebar Navigation",
                          section_name: "Sidebar",
                          navigation_group: "Profile",
                          button_id: "sb_profile_nav_lnk",
                          page_name: "Home Page",
                        })
                      }
                    >
                      <div className="flex items-center  py-2">
                        <div
                          className={`flex items-center rounded-xl p-3 w-full ${
                            isActiveLink("/subscription") ? "bg-[#FFFFFF0D] font-bold" : ""
                          }`}
                          style={isActiveLink("/subscription") ? activeStyle : {}}
                        >
                          <img
                            style={{ height: "20px", width: "20px" }}
                            src="/images/icons/subscription.svg"
                          />
                          <span className="text-sm text-black pl-2">
                            {userData?.isTrialUser ? "Upgrade" : "Manage Subscription"}
                          </span>
                        </div>
                      </div>
                    </CLink>
                  </li>
                  {isLoggedIn && (
                    <li>
                      <CLink
                        href="/usage"
                        handleClick={() =>
                          sendEvent({
                            event: "button_clicked",
                            button_text: "Usage",
                            interaction_type: "Sidebar Navigation",
                            section_name: "Sidebar",
                            navigation_group: "Profile",
                            button_id: "sb_profile_nav_lnk",
                            page_name: "Home Page",
                          })
                        }
                      >
                        <div className="flex items-center  py-2">
                          <div
                            onClick={() =>
                              sendEvent({
                                event: "Usage",
                                email: userData?.email,
                                name: userData?.name,
                              })
                            }
                            className={`flex items-center rounded-xl p-3 w-full ${
                              isActiveLink("/usage") ? "bg-[#FFFFFF0D] font-bold" : ""
                            }`}
                            style={isActiveLink("/usage") ? activeStyle : {}}
                          >
                            <img
                              style={{ height: "20px", width: "20px" }}
                              src="/images/icons/usage.svg"
                            />
                            <span className="text-sm text-black pl-2">Usage</span>
                          </div>
                        </div>
                      </CLink>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Box>
      <Box sx={styles.mainWrapper}>
        <Box sx={styles.contentFavtv}>{children}</Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
