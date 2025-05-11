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

const LogOutNavItem = [
  {
    path: "/video-studio",
    title: " Video Studio",
    icon: "🎵 ",
    newTag: false,
  },
  {
    path: "/generate-image",
    title: " Image Studio",
    icon: "🎵 ",
    newTag: true,
  },
  {
    path: "/my-video",
    title: " My Video",
    icon: "🎵 ",
    newTag: false,
  },
];

const HeaderNew = ({ app }) => {
  const wallet = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAnchorEl, setWalletAnchorEl] = useState(null);
  const router = useRouter();

  const currentPath = router.pathname;

  // Function to check if a link is active
  const isActiveLink = (path) => {
    return currentPath === path;
  };
  const { sendEvent } = useGTM();
  const [isPopupVisible, setIsPopupVisible] = useState({
    login: false,
  });
  const { isLoggedIn, userData } = useSelector((state) => state.user);

  const layoutData = useSelector((state) => state.layout);
  const [airdropPoints, setAirdropPoints] = useState(layoutData.airdropPoints);

  useEffect(() => {
    setAirdropPoints(layoutData.airdropPoints);
  }, [layoutData?.airdropPoints]);

  useEffect(() => {
    setWalletAnchorEl(layoutData.isSignWalletPopupOpen);
  }, [layoutData?.isSignWalletPopupOpen]);

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
        <Box className="">
          {userData?.credits > 0 ? (
            <div>
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
                {userData?.credits} Credits
              </button>
            </div>
          ) : (
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
                onClick={() =>
                  sendEvent({
                    event: "Upgrade Now / Manage Subscription",
                    email: userData?.email,
                    name: userData?.name,
                  })
                }
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
          )}
        </Box>

        {LogOutNavItem?.map((item, i) => (
          <Link key={i} prefetch={false} href={item?.path} passHref>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingTop={2}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <Typography
                variant="h6"
                className="nav-item"
                sx={{
                  color: router.pathname === item?.path ? "#000" : "#000",
                  fontFamily: "Nohemi",
                  fontSize: "16px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span className="text-lg">{item.icon}</span> &nbsp;
                {item?.title}
                {item?.newTag && (
                  <sup
                    style={{
                      marginLeft: "4px",
                      contentVisibility: "auto",
                      background: "linear-gradient(96.61deg, #FFA0FF 4.52%, #653EFF 102.26%)",
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
                  </sup>
                )}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
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
              <CLink href="/video-studio">
                <div>Video studio</div>
              </CLink>
            </div>
            <div className={`text-black flex ml-10 text-base font-medium m-auto ${
                isActiveLink("/image-studio") ? "underline underline-offset-8" : ""
              }`}>
              <div>
              <CLink href="/generate-image">
                <div>Image studio</div>
                </CLink>
              </div>
          
            </div>
          </div>

          <Box className="flex hidden md:flex">
            {userData?.credits > 0 ? (
              <div>
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
                  {userData?.credits} Credits
                </button>
              </div>
            ) : (
              <div>
                {!isActiveLink("/subscription") ? (
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
          <span className="md:hidden">
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
      </Box>
    </>
  );
};

export default memo(HeaderNew);
