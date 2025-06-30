import SnackBar from "@/src/component/Snackbar";
import { SnackbarProvider } from "@/src/context/SnackbarContext";
import { CacheProvider } from "@emotion/react";
import "@fontsource/inter";
import "animate.css";
import {
  QueryClient as QueryClientV3,
  QueryClientProvider as QueryClientProviderV3,
  Hydrate,
} from "react-query"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createEmotionCache from "../createEmotionCache";
import Layout from "../src/Layout";
import store from "../src/redux/store";
import AppSeo from "../src/seo/app";
import PageThemeProvider from "../src/styles/PageThemeProvider";
import "/styles/globals.css";
import * as gtm from "../src/lib/gtm";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useGTM from "../src/hooks/useGTM";
import ResponsiveWrapper from "../src/component/ResponsiveWrapper";
import { initMixpanel, trackEvent } from "../mixpanelClient";
import { PlanModalProvider } from "../src/context/PlanModalContext";
import PlanUpgradeModal from "../src/component/PlanUpgradeModal";
import FreeTrial from "../src/component/FreeTrial";
import NoCreditModal from "../src/component/NoCreditModal";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import '@mysten/dapp-kit/dist/index.css';

const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
});


const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, refetchOnMount: false },
  },
});

const persistor = persistStore(store, {}, function () {
  persistor.persist();
});

function MyApp({ Component, pageProps, emotionCache = createEmotionCache() }) {
  const router = useRouter();
  const { sendPageView } = useGTM();

  if (process.env.NEXT_PUBLIC_ENVIRONMENT_FOR_LOG == "prod") {
    console.log = () => {};
    console.error = () => {};
    console.debug = () => {};
  }

  useEffect(() => {
    initMixpanel();

    const handleRouteChange = (url) => {
      sendPageView(url); // fire GTM event
      trackEvent("page_view", { page: url });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    // Fire on first load
    handleRouteChange(window.location.pathname);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const tanstackQueryClient = new QueryClient();       // For mysten/dapp-kit
  const reactQueryClientV3 = new QueryClientV3();      // For legacy useQuery

  return (
    <QueryClientProviderV3 client={reactQueryClientV3}>
    <QueryClientProvider client={tanstackQueryClient}>
      <GoogleOAuthProvider clientId="...">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <CacheProvider value={emotionCache}>
              <PageThemeProvider {...pageProps}>
                <AppSeo />
                <PlanModalProvider>
                  <SnackbarProvider>
                    <SnackBar />
                    <PlanUpgradeModal />
                    <FreeTrial />
                    <NoCreditModal />
                    <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
                      <WalletProvider autoConnect={false}>
                        <Layout {...pageProps}>
                          <Component {...pageProps} />
                        </Layout>
                      </WalletProvider>
                    </SuiClientProvider>
                  </SnackbarProvider>
                </PlanModalProvider>
              </PageThemeProvider>
            </CacheProvider>
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
    </QueryClientProviderV3>
  );
  
}
export default MyApp;
