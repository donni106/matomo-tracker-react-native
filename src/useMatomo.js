import { useContext, useMemo } from 'react';

import { MatomoContext } from './MatomoProvider';

const useMatomo = () => {
  const instance = useContext(MatomoContext);

  return useMemo(
    () => ({
      trackAppStart: () => instance.trackAppStart && instance.trackAppStart(),
      trackScreenView: (params) => instance.trackScreenView && instance.trackScreenView(params),
      trackAction: (params) => instance.trackAction && instance.trackAction(params),
      trackEvent: (params) => instance.trackEvent && instance.trackEvent(params),
      trackSiteSearch: (params) => instance.trackSiteSearch && instance.trackSiteSearch(params),
      trackLink: (params) => instance.trackLink && instance.trackLink(params),
      trackDownload: (params) => instance.trackDownload && instance.trackDownload(params)
    }),
    [instance]
  );
};

export default useMatomo;
