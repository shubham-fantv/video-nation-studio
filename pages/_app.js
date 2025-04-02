import SnackBar from "@/src/component/Snackbar";
import { SnackbarProvider } from "@/src/context/SnackbarContext";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "animate.css";
import { Provider } from "react-redux";
import Layout from "../src/Layout";
import store from "../src/redux/store";
import AppSeo from "../src/seo/app";
import PageThemeProvider from "../src/styles/PageThemeProvider";
import "/styles/globals.css";
import "@mysten/dapp-kit/dist/index.css";
import "@fontsource/inter";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../createEmotionCache";

import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, refetchOnMount: false },
  },
});

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

const theme = createTheme({
  typography: {
    fontFamily: "inherit", // Prevent Material UI from overriding Tailwind fonts
  },
});

function MyApp({ Component, pageProps, emotionCache = createEmotionCache() }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          <GoogleOAuthProvider clientId="508551165708-227o7s8mmoc7sdt41999gqjratr78tjq.apps.googleusercontent.com">
            <Provider store={store}>
              <CacheProvider value={emotionCache}>
                <PageThemeProvider {...pageProps}>
                  <AppSeo />
                  <SnackbarProvider>
                    <SnackBar />
                    <Layout {...pageProps}>
                      <Component {...pageProps} />
                    </Layout>
                  </SnackbarProvider>
                </PageThemeProvider>
              </CacheProvider>
            </Provider>
          </GoogleOAuthProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
