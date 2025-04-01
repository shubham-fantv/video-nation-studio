import { Box, Button, Modal, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import GoogleLogin1 from "../../GoogleLogin";
import { styles } from "./style";

const LoginAndSignup = ({ open, handleModalClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (handleModalClose) {
        setOpen(false);
        setIsSignUp(false);
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
              <GoogleLogin1
                text={isSignUp ? "Sign up with Google" : "Sign in with Google"}
                handleModalClose={handleModalClose}
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default LoginAndSignup;
