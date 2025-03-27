import SnackBar from "@/src/component/Snackbar";
import { SnackbarProvider } from "@/src/context/SnackbarContext";
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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, refetchOnMount: false },
  },
});

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          <Provider store={store}>
            <PageThemeProvider {...pageProps}>
              <AppSeo />
              <SnackbarProvider>
                <SnackBar />
                <Layout {...pageProps}>
                  <Component {...pageProps} />
                </Layout>
              </SnackbarProvider>
            </PageThemeProvider>
          </Provider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
