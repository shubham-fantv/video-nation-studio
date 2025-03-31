import { Box, Button, Modal, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import useWalletConnection from "src/hoc/useWalletConnection";
import GoogleLogin from "../../../../components/Buttons/GoogleLogin";
im;

const LoginAndSignup = ({ open, handleModalClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobile, setMobileInParant] = useState();
  const [countryCode, setCountryCode] = useState();
  const [isLoginandSignupModal, setIsLoginandSignupModal] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [walletAnchorEl, setWalletAnchorEl] = useState(null);
  const { walletState } = useWalletConnection();

  useEffect(() => {
    return () => {
      if (handleModalClose) {
        setOpen(false);
        setIsSignUp(false);
        setIsLoginOpen(false);
        setIsLoginandSignupModal(false);
      }
    };
  }, [handleModalClose]);

  return (
    <>
      <Modal style={{ zIndex: "9999" }} open={open} onClose={handleModalClose} closeAfterTransition>
        <Box sx={styles.wrapper}>
          <Box
            sx={{
              cursor: "pointer",
              background: "#fff",
              borderRadius: "16px",
              position: "absolute",
              right: "5px",
              top: "5px",
            }}
            component="img"
            src="/images/community/close.svg"
            onClick={handleModalClose}
          />
          <Box sx={styles.LoginButton}>
            <Box sx={styles.googleButton}>
              <GoogleLogin
                text={isSignUp ? "Sign up with Google" : "Sign in with Google"}
                handleModalClose={handleModalClose}
              />
            </Box>
            <Button sx={styles.SignWithEmail} onClick={() => setIsLoginOpen(true)}>
              <img src="/images/login/email.svg" alt="" /> Sign Up with Email
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default LoginAndSignup;
