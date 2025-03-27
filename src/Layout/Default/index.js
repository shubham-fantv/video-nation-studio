import { Box } from "@mui/system";
import { memo } from "react";
import styles from "./styles";
import RevampFooter from "../../component/Footer";
import RevampHeader from "../../component/Header";
import Sidebar from "../../component/Sidebar";

const DefaultLayout = ({ children, customStyles = {} }) => {
  return (
    <Box sx={{ ...styles.wrapper, ...customStyles.wrapper }}>
      <Box sx={{ ...styles.wrapper, ...customStyles.wrapper }}>
        <RevampHeader />

        <Box sx={{ minHeight: "100vh" }}>
          <Sidebar> {children} </Sidebar>
        </Box>

        <RevampFooter />
      </Box>
    </Box>
  );
};

export default memo(DefaultLayout);
