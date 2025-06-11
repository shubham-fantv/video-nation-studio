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
  trackEvent(event, { ...rest, app_id: "videonation" });
};

export const GTMevent = ({ event, ...rest }) => {
  window.dataLayer?.push({
    event,
    app_id: "videonation",
    ...rest,
  });
};
