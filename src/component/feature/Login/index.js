import { Box, Button, Modal, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { styles } from "./style";
import GoogleAuth from "../../common/GoogleAuth";

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
              borderRadius: "100px",
              position: "absolute",
              right: "5px",
              top: "5px",
              height: "20px",
              width: "20px",
            }}
            component="img"
            src="/images/close.svg"
            onClick={handleModalClose}
            className="text-white"
          />
          <p className="text-white text-center text-2xl mb-6">Welcome to VideoNation </p>
          <Box sx={styles.googleButton}>
            <GoogleAuth
              text={isSignUp ? "Sign up with Google" : "Sign in with Google"}
              handleModalClose={handleModalClose}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default LoginAndSignup;
