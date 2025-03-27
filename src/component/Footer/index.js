import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        py: { xs: "10px", md: "80px" },
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        fontFamily: "Nohemi",
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* Logo and Description Section */}
          <Grid item xs={12} md={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box component="img" src="/images/logo.svg" alt="FANTV" sx={{ height: 66 }} />
            </Box>
            {/* <Typography variant="body2" sx={{ mb: 2, color: "#FFFDD4" }}>
              The end-to-end platform for
              <br /> creators powered by AI
            </Typography>
            <Typography variant="body2" sx={{ color: "#FFFDD480", fontSize: "0.875rem" }}>
              Crafted with ❤️ by Spacekayak
            </Typography>
            <Typography variant="body2" sx={{ color: "#FFFDD480", fontSize: "0.875rem" }}>
              © 2024 FanTV. All rights reserved.
            </Typography> */}
          </Grid>

          {/* <Grid item xs={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                mb: { xs: 1.5, md: 2 },
                color: "#FFFDD4",
                fontFamily: "Nohemi",
                fontSize: "16px",
              }}
            >
              Company
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 4 },
              }}
            >
              {["Whitepaper", "Airdrop", "Privacy", "Terms & Conditions"].map((text) => (
                <Link
                  key={text}
                  href="#"
                  sx={{
                    color: "#FFFDD480",
                    fontWeight: "400",
                    fontSize: "16px",
                    fontFamily: "Nohemi",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                >
                  {text}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                mb: { xs: 1.5, md: 2 },
                color: "#FFFDD4",
                fontFamily: "Nohemi",
                fontSize: "16px",
              }}
            >
              Keep in touch
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 2.6 },
              }}
            >
              {[
                {
                  text: "Twitter",
                  icon: <TwitterIcon />,
                  link: "https://twitter.com/FanTV_official",
                },
                {
                  text: "Instagram",
                  icon: <InstagramIcon />,
                  link: "https://www.instagram.com/fantv.official/",
                },
                {
                  text: "Telegram",
                  icon: <TelegramIcon />,
                  link: "https://t.me/FanTVDiscussions",
                },
                {
                  text: "Discord",
                  icon: <Discord />,
                  link: "https://discord.gg/WTVgMFCceX",
                },
              ].map((item) => (
                <Link
                  key={item.text}
                  href={item?.link}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: "#FFFDD480",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "400",
                    fontSize: "16px",
                    fontFamily: "Nohemi",
                    gap: 1,
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                >
                  {item.icon}
                  <Typography>{item.text}</Typography>
                </Link>
              ))}
            </Box>
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
