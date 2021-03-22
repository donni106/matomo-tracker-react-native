import { useCallback, useContext } from 'react';

import { MatomoContext } from './MatomoProvider';

const useMatomo = () => {
  const instance = useContext(MatomoContext);

  const trackAppStart = useCallback(() => instance.trackAppStart && instance.trackAppStart(), [
    instance
  ]);

  const trackScreenView = useCallback(
    (params) => instance.trackScreenView && instance.trackScreenView(params),
    [instance]
  );

  const trackAction = useCallback(
    (params) => instance.trackAction && instance.trackAction(params),
    [instance]
  );

  const trackEvent = useCallback((params) => instance.trackEvent && instance.trackEvent(params), [
    instance
  ]);

  const trackSiteSearch = useCallback(
    (params) => instance.trackSiteSearch && instance.trackSiteSearch(params),
    [instance]
  );

  const trackLink = useCallback((params) => instance.trackLink && instance.trackLink(params), []);

  const trackDownload = useCallback(
    (params) => instance.trackDownload && instance.trackDownload(params),
    [instance]
  );

  return {
    trackAppStart,
    trackScreenView,
    trackAction,
    trackEvent,
    trackSiteSearch,
    trackLink,
    trackDownload
  };
};

export default useMatomo;
