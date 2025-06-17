export const isMobileDevice = () => {
  if (typeof window === "undefined") return false; // SSR safe
  return /Mobi|Android|iPhone|iPad|iPod/i.test(window?.navigator?.userAgent);
};
