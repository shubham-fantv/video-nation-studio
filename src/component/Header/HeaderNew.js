import { Box, Button, Drawer } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useWallet } from "@suiet/wallet-kit";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../../hooks/useIsMobile";
import { setSignWalletPopupOpen } from "../../redux/slices/layout";
import styles from "./style";
import MenuIcon from "@mui/icons-material/Menu";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import LoginAndSignup from "../feature/Login";
import UserProfileDropdown from "./UserProfileDropdown";
import CLink from "../CLink";
import { useQuery } from "react-query";
import { FANTV_API_URL } from "../../constant/constants";
import fetcher from "../../dataProvider";
import { setUserData } from "../../redux/slices/user";
import useGTM from "../../hooks/useGTM";
import SweetAlert2 from "react-sweetalert2";
import { getPageName } from "../../utils/common";
import mixpanel from "mixpanel-browser";
import FreeTrial from "../FreeTrial";
const activeStyle = {
  backgroundColor: "#FFFFFF0D",
  border: "1px solid #3E3E3E",
};

const HeaderNew = ({ app }) => {
  const wallet = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAnchorEl, setWalletAnchorEl] = useState(null);
  const router = useRouter();
  const [swalProps, setSwalProps] = useState({});
  const [isFreeTrialOpen, setIsFreeTrialOpen] = useState(false);
  const [isShowFreeTrialBanner, setIsShowFreeTrialBanner] = useState(false);
  const { isLoggedIn, userData } = useSelector((state) => state.user);

  const currentPath = router.pathname;

  useEffect(() => {
    const utmId = localStorage.getItem("utm_id");
    const isFreeTrialUsed = userData?.isFreeTrial;

    if ((utmId !== null && utmId !== undefined) || isFreeTrialUsed) {
      setIsShowFreeTrialBanner(true);
    }
  }, [userData]);

  // Function to check if a link is active
  const isActiveLink = (path) => {
    return currentPath === path;
  };
  const { sendEvent } = useGTM();
  const [isPopupVisible, setIsPopupVisible] = useState({
    login: false,
  });

  useEffect(() => {
    mixpanel.identify(userData?._id); // user_Id
    mixpanel.people.set({
      $name: userData?.name,
      $email: userData?.email,
      subscription_status: "Subscriber", // or Non Subscriber / Trial
      plan_type: "Pro", // or Basic / Ultra Pro
      plan_duration: "Monthly", // or Yearly
      credits: userData?.credits,
      isLoggedIn: isLoggedIn,
    });
  }, []);

  const layoutData = useSelector((state) => state.layout);
  const [airdropPoints, setAirdropPoints] = useState(layoutData.airdropPoints);

  useEffect(() => {
    setAirdropPoints(layoutData.airdropPoints);
  }, [layoutData?.airdropPoints]);

  useEffect(() => {
    setWalletAnchorEl(layoutData.isSignWalletPopupOpen);
  }, [layoutData?.isSignWalletPopupOpen]);

  useEffect(() => {
    if (!userData || userData?.credits === undefined) return;
    const hasShownModal = localStorage.getItem("creditWarningShown");

    if (userData?.credits < 10 && !hasShownModal) {
      // setSwalProps({
      //   show: true,
      //   title: "⏳ You're almost out of credits!",
      //   text: "Upgrade now to unlock HD, pro voices, and longer videos.",
      //   confirmButtonText: "View Plans",
      //   showCancelButton: true,
      //   icon: "warning",
      //   preConfirm: () => {
      //     router.push("/subscription");
      //     sendEvent({
      //       event: "button_clicked",
      //       button_text: "View Plans",
      //       interaction_type: "Standard button",
      //       button_id: "popup_almost_out_of_credits_plans_btn",
      //       section_name: "Popup",
      //       page_name: getPageName(router?.pathname),
      //     });
      //   },
      // });
      // sendEvent({
      //   event: "popup_displayed",
      //   popup_type: "Nudge",
      //   popup_name: "Almost out of Credits",
      //   popup_messge_text: "⏳ You're almost out of credits!",
      //   page_name: getPageName(router?.pathname),
      // });

      // Mark as shown
      localStorage.setItem("creditWarningShown", "true");
    }
  }, [userData?.credits]);

  const handleWalletClose = () => {
    setWalletAnchorEl(null);
    dispatch(setSignWalletPopupOpen(false));
  };

  const handleWalletClick = (event) => {
    event.stopPropagation();
    setIsPopupVisible({ login: true });
  };

  const dispatch = useDispatch();

  const isMobile = useIsMobile(app?.deviceParsedInfo?.device?.isMobile);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setIsMenuOpen(open);
  };

  useQuery(
    `${FANTV_API_URL}/api/v1/users/${userData?._id || userData?.id}`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/users/${userData?._id || userData?.id}`),
    {
      enabled: !!(userData?._id || userData?.id),
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        dispatch(setUserData(data));
      },
    }
  );

  const handleLoginPopupClose = () => {
    setIsPopupVisible({ login: false });
  };
  const drawerContent = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        background: "#FFF",
        backdropFilter: "blur(40px)",
        paddingInline: "20px",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        display="flex"
        sx={{
          gap: 2,
          alignItems: "flex-end",
          justifyContent: "flex-end",
          paddingTop: "10px",
          color: "#000",
        }}
        onClick={toggleDrawer(false)}
      >
        <X />
      </Box>
      <Box sx={styles.mobileScroll}>
        <Box onClick={(e) => e.stopPropagation()}>
          {isLoggedIn ? (
            <UserProfileDropdown />
          ) : (
            <Box sx={styles.btnContainer} onClick={handleWalletClick}>
              <Button
                sx={{
                  color: "#000000",
                  fontFamily: "Nohemi",
                  fontSize: "16px",
                }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Box>
        <div class="w-full h-px bg-gray-300 my-4"></div>

        <div className="flex h-screen">
          <aside>
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
    </Box>
  );

  const handleClickBanner = () => {
    if (isLoggedIn) {
      setIsFreeTrialOpen(true);
    } else {
      setIsPopupVisible({ login: true });
    }
  };
  return (
    <>
      {isShowFreeTrialBanner && (
        <div
          className="h-[70px] w-full relative flex justify-center items-center cursor-pointer"
          style={{ background: "linear-gradient(90deg, #653EFF 0%, #FF7B3E 100%)" }}
          onClick={() => handleClickBanner()}
        >
          <div className="pt-6">
            <img src="/images/video-ai/trial-image.svg" />
          </div>
          {/* <div className="absolute right-10">
            <img src="/images/icons/close-circle.svg" />
          </div> */}
        </div>
      )}
      <Box sx={styles.navbar} onClick={(e) => e.stopPropagation()}>
        <Box className="nav-container">
          <Box display="flex">
            <Box
              className="nav-logo"
              onClick={() => window?.open("/", "_self", "noopener,noreferrer")}
            >
              {isMobile ? (
                <Box className="fan__TigerMobileLogo">
                  <img
                    src={"/images/logo.svg"}
                    alt="mobile videonation logo"
                    loading="eager"
                    decoding="async"
                  />
                </Box>
              ) : (
                <Box className="fan__tigerDekstopLogo">
                  <img
                    src={"/images/logo.svg"}
                    alt="videonation Logo"
                    width={150}
                    loading="eager"
                    decoding="async"
                  />
                </Box>
              )}
            </Box>
          </Box>
          <div className="flex hidden md:flex">
            <div
              className={`text-black text-base font-medium m-auto ${
                isActiveLink("/video-studio") ? "underline underline-offset-8" : ""
              }`}
            >
              <CLink
                href="/video-studio"
                handleClick={() =>
                  sendEvent({
                    event: "button_clicked",
                    button_text: "Video Studio",
                    interaction_type: "Tab Button",
                    page_name: getPageName(router?.pathname),
                    section_name: "Header",
                    button_id: "hdr_vid_studio_nav_btn",
                  })
                }
              >
                <div>Video studio</div>
              </CLink>
            </div>
            <div
              className={`text-black flex ml-10 text-base font-medium m-auto ${
                isActiveLink("/image-studio") ? "underline underline-offset-8" : ""
              }`}
            >
              <div>
                <CLink
                  href="/image-studio"
                  handleClick={() =>
                    sendEvent({
                      event: "button_clicked",
                      button_text: "Image Studio",
                      interaction_type: "Tab Button",
                      page_name: getPageName(router?.pathname),
                      section_name: "Header",
                      button_id: "hdr_img_studio_nav_btn",
                    })
                  }
                >
                  <div>Image studio</div>
                </CLink>
              </div>
            </div>
          </div>

          <Box className="flex md:flex">
            {userData?.credits > 0 ? (
              userData.credits < 20 && router?.pathname != "/subscription" ? (
                <div className="flex items-center px-4 gap-4">
                  <CLink href={"/subscription"}>
                    <span
                      className="bg-yellow-100 flex text-sm md:text-sm text-yellow-800 px-3 py-1
                    rounded-full text-sm font-medium shadow"
                    >
                      {userData.credits} Credits Left
                    </span>
                  </CLink>
                  <CLink href={"/subscription"}>
                    <button className="hidden md:block bg-purple-600 text-white text-sm px-3 py-1 rounded-md hover:bg-purple-700 transition">
                      Upgrade
                    </button>
                  </CLink>
                </div>
              ) : (
                <CLink href={"/usage"}>
                  <button
                    style={{
                      border: "1px solid #262626",
                      borderRadius: "12px",
                      color: "#000",
                      fontSize: "14px",
                      textTransform: "capitalize",
                      width: "max-content",
                      display: "flex",
                      alignItems: "center",
                      marginRight: "20px",
                      height: "40px",
                      padding: isMobile ? "6px 10px" : "4px 16px",
                    }}
                  >
                    <img
                      src="/images/icons/blackStar.svg"
                      style={{
                        height: isMobile ? "24px" : "28px",
                        width: isMobile ? "24px" : "28px",
                        marginRight: "6px",
                      }}
                      alt="star icon"
                    />
                    {userData.credits} Credits
                  </button>
                </CLink>
              )
            ) : (
              <div>
                {!isActiveLink("/subscription") && isLoggedIn ? (
                  <CLink href={"/subscription"}>
                    <button
                      style={{
                        border: "1px solid #262626",
                        borderRadius: "12px",
                        color: "#000",
                        fontSize: "14px",
                        textTransform: "capitalize",
                        width: "max-content",
                        display: "flex",
                        alignItems: "center",
                        marginRight: "20px",
                        height: "40px",
                        padding: isMobile ? "6px 10px" : "4px 16px",
                      }}
                    >
                      <img
                        src="/images/icons/blackStar.svg"
                        style={{
                          height: isMobile ? "24px" : "28px",
                          width: isMobile ? "24px" : "28px",
                          marginRight: "6px",
                        }}
                        alt="star icon"
                      />
                      Upgrade Now
                    </button>
                  </CLink>
                ) : null}
              </div>
            )}
            <span className="hidden md:flex">
              {isLoggedIn ? (
                <UserProfileDropdown />
              ) : (
                <Box sx={styles.btnContainer} onClick={handleWalletClick}>
                  <Button
                    sx={{
                      color: "#000000",
                      fontFamily: "Nohemi",
                      fontSize: "16px",
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              )}
            </span>
          </Box>
          {/* <span className="md:hidden">
            {isLoggedIn ? (
              <UserProfileDropdown />
            ) : (
              <Box sx={styles.btnContainer} onClick={handleWalletClick}>
                <Button
                  sx={{
                    color: "#000000",
                    fontFamily: "Nohemi",
                    fontSize: "16px",
                  }}
                >
                  Sign In
                </Button>
              </Box>
            )}
          </span> */}

          {isMobile && (
            <Box sx={styles.profileNavBar} onClick={toggleDrawer(true)}>
              <MenuIcon style={{ color: "black", marginTop: "8px", marginLeft: "10px" }} />
            </Box>
          )}
          <Drawer anchor="right" open={isMenuOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>
        </Box>
        {isPopupVisible.login && (
          <LoginAndSignup
            callBackName={"uniqueCommunity"}
            open={isPopupVisible.login}
            handleModalClose={handleLoginPopupClose}
          />
        )}
        {isFreeTrialOpen && (
          <FreeTrial open={isFreeTrialOpen} handleModalClose={() => setIsFreeTrialOpen(false)} />
        )}
      </Box>
      <SweetAlert2
        {...swalProps}
        onConfirm={() => setSwalProps({ show: false })}
        didClose={() => {
          sendEvent({
            event: "button_clicked",
            button_text: "Cancel",
            page_name: getPageName(router?.pathname),
            interaction_type: "Standard button",
            button_id: "popup_almost_out_of_credits_cancel_btn",
            section_name: "Popup",
          });
        }}
      />
    </>
  );
};

export default memo(HeaderNew);
