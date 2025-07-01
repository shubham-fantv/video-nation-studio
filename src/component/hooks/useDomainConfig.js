import { useEffect, useState } from 'react';

export function useDomainConfig() {
  const [domainConfig, setDomainConfig] = useState({
    isStudio: false,
    isApp: false,
    domain: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;

      setDomainConfig({
        domain: hostname,
        isStudio: hostname === 'videostudio.fantv.world' || hostname === 'localhost',
        isApp: hostname === 'app.videonation.ai',
      });
    }
  }, []);

  return domainConfig;
}
