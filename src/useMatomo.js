import { useContext, useMemo } from 'react';

import { MatomoContext } from './MatomoProvider';

const useMatomo = () => {
  const instance = useContext(MatomoContext);

  return useMemo(
    () => ({
      trackAppStart: (params) => instance.trackAppStart && instance.trackAppStart(params),
      trackScreenView: (params) => instance.trackScreenView && instance.trackScreenView(params),
      trackAction: (params) => instance.trackAction && instance.trackAction(params),
      trackEvent: (params) => instance.trackEvent && instance.trackEvent(params),
      trackContent: (params) => instance.trackContent && instance.trackContent(params),
      trackSiteSearch: (params) => instance.trackSiteSearch && instance.trackSiteSearch(params),
      trackLink: (params) => instance.trackLink && instance.trackLink(params),
      trackDownload: (params) => instance.trackDownload && instance.trackDownload(params),
      updateUserInfo: (params) => instance.updateUserInfo && instance.updateUserInfo(params),
      removeUserInfo: () => instance.removeUserInfo && instance.removeUserInfo(),
    }),
    [instance]
  );
};

export default useMatomo;
