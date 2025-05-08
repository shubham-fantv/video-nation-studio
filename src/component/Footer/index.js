import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import Discord from "@mui/icons-material/Forum";

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: "#FFF",
        py: "50px",
        fontFamily: "Nohemi",
        zIndex: 99999,
      }}
    >
      <Container>
        <Grid container>
          {/* Logo and Description Section */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box component="img" src="/images/logo.svg" alt="videoNation" sx={{ height: 36 }} />
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: "#000" }}>
              The end-to-end platform for
              <br /> creators powered by AI
            </Typography>
            <Typography variant="body2" sx={{ color: "#000", fontSize: "0.875rem" }}>
              Crafted with ❤️ in India
            </Typography>
            <Typography variant="body2" sx={{ color: "#000", fontSize: "0.875rem" }}>
              © 2025 VideoNation. All rights reserved.
            </Typography>
          </Grid>

          {/* Company Section */}
          <Grid item xs={12} md={2} sx={{ fontFamily: "Nohemi", fontSize: "16px" }}>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: "#000", fontFamily: "Nohemi", fontSize: "16px" }}
            >
              Company
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Link
                href="/privacy"
                sx={{
                  color: "#000",
                  fontWeight: "400",
                  fontSize: "16px",
                  fontFamily: "Nohemi",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#000",
                  },
                }}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                sx={{
                  color: "#000",
                  fontWeight: "400",
                  fontSize: "16px",
                  fontFamily: "Nohemi",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#000",
                  },
                }}
              >
                Terms & Conditions
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
