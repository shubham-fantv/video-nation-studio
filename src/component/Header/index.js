import { Box, Button, Drawer } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useWallet } from "@suiet/wallet-kit";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../../hooks/useIsMobile";
import { setSignWalletPopupOpen } from "../../redux/slices/layout";
import { formatWalletAddress, openLink } from "../../utils/common";
import WalletConnectModal from "./WalletConnectModal";
import styles from "./style";
import MenuIcon from "@mui/icons-material/Menu";
import useWalletConnection from "../../hooks/useWalletConnection";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

const LogOutNavItem = [
  {
    path: "/",
    title: "Home",
    icon: "🏠",
    newTag: false,
  },
  {
    path: "/ai-agent",
    title: "Create",
    icon: "🎵",
    newTag: false,
  },
];

const RevampHeader = ({ app }) => {
  const wallet = useWallet();
  const { walletState } = useWalletConnection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAnchorEl, setWalletAnchorEl] = useState(null);

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
    setWalletAnchorEl(event.currentTarget);
  };

  const router = useRouter();
  const dispatch = useDispatch();

  const isMobile = useIsMobile(app?.deviceParsedInfo?.device?.isMobile);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setIsMenuOpen(open);
  };

  const isWalletConnected = useMemo(() => {
    if (walletState.status == "connected") {
      return true;
    } else {
      return false;
    }
  }, [walletState, walletState?.state]);

  const pathname = usePathname();

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        background: "#18181B",
        backdropFilter: "blur(40px)",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        display="flex"
        sx={{ gap: 2, alignItems: "center", padding: 2 }}
        onClick={toggleDrawer(false)}
      >
        {/* <img
          style={{ height: '32px', width: '32px', color: '#FFF' }}
          src='/images/close.svg'
          alt='close icon'
        /> */}
        <X />
      </Box>
      <Box sx={styles.mobileScroll}>
        {/* <Box
          display='block'
          sx={{
            gap: '10px',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2,
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Box sx={styles.pointContainer}>
            <img
              style={{ width: '24px', height: '24px', marginRight: '8px' }}
              src='/images/seasonIcon.png'
              alt='icon'
            />
            <Typography
              variant='h6'
              sx={{
                color: '#000000',
                fontFamily: 'Nohemi',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              {airdropPoints}
            </Typography>
          </Box>
        </Box> */}
        {LogOutNavItem?.map((item, i) => (
          <Link key={i} prefetch={false} href={item?.path} passHref>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding={2}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <Typography
                variant="h6"
                className="nav-item"
                sx={{
                  color: router.pathname === item?.path ? "#FFF" : "#FFF",
                  fontFamily: "Nohemi",
                  fontSize: "16px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span className="text-lg">{item.icon}</span>
                {item?.title}
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
                    alt="mobile FanTV logo"
                    loading="eager"
                    decoding="async"
                  />
                </Box>
              ) : (
                <Box className="fan__tigerDekstopLogo">
                  <img
                    src={"/images/logo.svg"}
                    alt="FanTV Logo"
                    width={140}
                    loading="eager"
                    decoding="async"
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Box>
            <Box sx={styles.btnContainer} onClick={handleWalletClick}>
              {isWalletConnected ? (
                <Button
                  sx={{
                    color: "#000000",
                    fontFamily: "Nohemi",
                    fontSize: "16px",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {formatWalletAddress(walletState?.address)}
                </Button>
              ) : (
                <Button
                  sx={{
                    color: "#000000",
                    fontFamily: "Nohemi",
                    fontSize: "16px",
                  }}
                >
                  Connect Wallet
                </Button>
              )}
            </Box>
            <WalletConnectModal anchorEl={walletAnchorEl} onClose={handleWalletClose} />
          </Box>
          {isMobile && (
            <Box sx={styles.profileNavBar} onClick={toggleDrawer(true)}>
              <MenuIcon style={{ color: "white", marginTop: "8px", marginLeft: "10px" }} />
            </Box>
          )}

          <Drawer anchor="right" open={isMenuOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>
        </Box>
      </Box>
    </>
  );
};

export default memo(RevampHeader);
