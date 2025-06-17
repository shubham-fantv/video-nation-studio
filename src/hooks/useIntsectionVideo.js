import { useEffect, useRef } from "react";

export const useIntersectionVideo = (callback, threshold = 1.0) => {
  const observer = useRef();

  const observe = (element) => {
    if (!element) return;
    observer.current = new IntersectionObserver(
      ([entry]) => {
        callback(entry.isIntersecting, element);
      },
      { threshold }
    );
    observer.current.observe(element);
  };

  const unobserve = () => {
    if (observer.current) observer.current.disconnect();
  };

  return { observe, unobserve };
};
