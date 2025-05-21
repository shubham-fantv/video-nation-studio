import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: true,
      track_pageview: true,
      persistence: "localStorage",
    });
  } else {
    console.warn("Mixpanel token is missing! Check your .env file.");
  }
};

export const trackEvent = (eventName, properties = {}) => {
  if (MIXPANEL_TOKEN) {
    mixpanel.track(eventName, properties);
  }
};

export default mixpanel;
