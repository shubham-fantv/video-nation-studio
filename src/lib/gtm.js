import { trackEvent } from "../../mixpanelClient";
// lib/gtm.js
export const GTM_ID = "GTM-PJRMHNSR";

export const pageview = (url) => {
  window.dataLayer?.push({
    event: "Page View",
    page_path: url,
  });
};

export const event = ({ event, ...rest }) => {
  window.dataLayer?.push({
    event,
    ...rest,
  });
  trackEvent(event, { ...rest });
};
