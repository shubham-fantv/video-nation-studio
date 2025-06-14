export const styles = {
  wrapper: {
    position: "relative",
    display: "block",
    maxWidth: "500px",
    margin: "auto",
    top: "50%",
    border: "none",
    transform: "translateY(-50%)",
    outline: "none",
  },
  innerWrapper: {
    width: "265px",
    "@media (max-width:480px)": {
      width: "100%",
    },
  },
  innerWrapperOPT: {
    width: "300px",
    "@media (max-width:480px)": {
      width: "100%",
    },
  },
  innerWrapperMail: {
    width: {
      xs: "100%",
      xm: "100%",
      mobile: "100%",
      tablet: "550px",
      laptop: "550px",
      lg: "550px",
      xl: "550px",
      xxl: "550px",
    },
  },
  innerWrapperMail2: {
    "& input": {
      width: "100px",
    },
  },
  FanSinUp: {
    display: "flex",
    flexDirection: "row",
    width: "auto",
    height: "auto",
    margin: "auto",
  },
  googleButton: {
    background: "#FFFFFF33",
    border: "1px solid #FFFFFF26",
    borderRadius: "100px",
    padding: "7px",
    margin: "auto",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "50px",
    fontSize: "16px",
    paddingInline: "20px",
    width: "100%",
    marginTop: "44px",
    marginBottom: "44px",

    "& img": {
      marginRight: "10px",
      width: "20px",
    },
    "& button": {
      backgroundColor: "#251D3E !important",
      color: "#fff !important",
      opacity: "9 !important",
      boxShadow: "none !important",
      fontSize: "16px",
      fontWeight: "500 !important",
      "& span": {
        padding: "0 !important",
      },
    },
    "& div": {
      backgroundColor: "#251D3E !important",
      padding: "0 !important",
      display: "flex",
    },
    "@media (max-width:480px)": {
      height: "40px",
      fontSize: "14px",
      "& img": {
        width: "18px",
      },
      "& button": {
        fontSize: "14px !important",
      },
    },
  },
  SignWithEmail: {
    background: "#251D3E",
    borderRadius: "100px",
    border: "none",
    padding: "7px",
    width: "100%",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "500 !important",
    textTransform: "capitalize",
    marginTop: "20px",
    fontSize: "16px",
    height: "50px",
    "& img": {
      marginRight: "10px",
      width: "20px",
    },
    "@media (max-width:480px)": {
      height: "40px",
      fontSize: "14px",
      "& img": {
        width: "18px",
      },
    },
    "&:hover": {
      background: "#251D3E",
    },
  },

  loginBtn: {
    borderRadius: "100rem",
    color: "#fff",
    background: "linear-gradient(93.1deg, #E14084 -29.05%, #3454FA 45.16%, #54B5BB 110.54%)",
    borderRadius: "100px",
    padding: "7px 33px",
    minHeight: "40px",
    margin: "30px auto",
    display: "block",
    fontWeight: "600",
    textTransform: "capitalize",
    position: "relative",
    left: "7px",
    "@media (max-width:480px)": {
      padding: "7px 25px",
      fontSize: "14px",
      margin: "18px auto",
    },
  },
};
