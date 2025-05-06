import * as gtm from "../lib/gtm"; // adjust if you use aliases

const useGTM = () => {
  const sendEvent = (data) => {
    gtm.event(data);
  };

  const sendPageView = (url) => {
    gtm.pageview(url);
  };

  return {
    sendEvent,
    sendPageView,
  };
};

export default useGTM;
