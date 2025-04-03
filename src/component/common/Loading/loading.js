import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, Box } from "@mui/material";

const styles = {
  root: {
    height: "90vh",
    display: "flex",
    backgroundColor: "custom.earnCoinBg",
    "& > * + *": {
      marginLeft: "8px",
    },
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    color: "custom.white",
    margin: "auto",
    textAlign: "center",
    "& p": {
      fontWeight: 600,
      fontSize: "24px",
    },
    "& span": {
      fontWeight: 400,
      fontSize: "16px",
      opacity: "0.5",
    },
  },
  activeCircular: {
    marginTop: "20px",
    color: "custom.white !important",
    zIndex: 10,
  },
};

export default function Loading({ label = "Please wait", text = "Loading", customStyles = {} }) {
  return (
    <Box sx={{ ...styles.root, ...customStyles }}>
      <Box sx={styles.container}>
        <Typography component="p">{label}</Typography>
        <Typography component="span">{text}</Typography>
        <Box>
          <CircularProgress sx={styles.activeCircular} />
        </Box>
      </Box>
    </Box>
  );
}
