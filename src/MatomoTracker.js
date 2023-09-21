class MatomoTracker {
  constructor(userOptions) {
    if (!userOptions.urlBase) {
      throw new Error('urlBase is required for Matomo tracking.');
    }
    if (!userOptions.siteId) {
      throw new Error('siteId is required for Matomo tracking.');
    }

    this.initialize(userOptions);
  }

  initialize({ urlBase, trackerUrl, siteId, userId, disabled = false, log = false }) {
    const normalizedUrlBase = urlBase[urlBase.length - 1] !== '/' ? `${urlBase}/` : urlBase;

    this.disabled = disabled;
    this.log = log;

    if (disabled) {
      log && console.log('Matomo tracking is disabled.');

      return;
    }

    this.trackerUrl = trackerUrl ?? `${normalizedUrlBase}matomo.php`;
    this.siteId = siteId;

    if (userId) {
      this.userId = userId;
    }

    log &&
      console.log('Matomo tracking is enabled for:', {
        trackerUrl: this.trackerUrl,
        siteId: this.siteId,
        userId: this.userId
      });
  }

  /**
   * Tracks app start as action with prefixed 'App' category
   *
   * @param {Object} data -
   * {Object} `userInfo` - Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.
   */
  trackAppStart({ userInfo = {} } = {}) {
    return this.trackAction({ name: 'App / start', userInfo });
  }

  /**
   * Tracks screen view as action with prefixed 'Screen' category
   *
   * @param {Object} data -
   * {String} name - The title of the action being tracked. It is possible to use slashes / to set one or several categories for this action. For example, Help / Feedback will create the Action Feedback in the category Help.
   *
   * {Object} `userInfo` - Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.
   */
  trackScreenView({ name, userInfo = {} }) {
    if (!name) throw new Error('Error: name is required.');

    return this.trackAction({ name: `Screen / ${name}`, userInfo });
  }

  /**
   * Tracks actions
   *
   * Doc: https://developer.matomo.org/api-reference/tracking-api#recommended-parameters
   *
   * @param {Object} data -
   * {String} `name` - The title of the action being tracked. It is possible to use slashes / to set one or several categories for this action. For example, Help / Feedback will create the Action Feedback in the category Help.
   *
   * {Object} `userInfo` - Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.
   */
  trackAction({ name, userInfo = {} }) {
    if (!name) throw new Error('Error: name is required.');

    return this.track({ action_name: name, ...userInfo });
  }

  /**
   * Tracks custom events
   *
   * Doc: https://developer.matomo.org/api-reference/tracking-api#optional-event-trackinghttpsmatomoorgdocsevent-tracking-info
   *
   * @param {Object} data -
   * {String} `category` - The event category. Must not be empty. (eg. Videos, Music, Games...)
   *
   * {String} `action` - The event action. Must not be empty. (eg. Play, Pause, Duration, Add Playlist, Downloaded, Clicked...)
   *
   * {String} `name` - The event name. (eg. a Movie name, or Song name, or File name...)
   *
   * {String} `value` - The event value. Must be a float or integer value (numeric), not a string.
   *
   * {String} `campaign` - The event related campaign.
   *
   * {Object} `userInfo` - Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.
   */
  trackEvent({ category, action, name, value, campaign, userInfo = {} }) {
    if (!category) throw new Error('Error: category is required.');
    if (!action) throw new Error('Error: action is required.');

    return this.track({ e_c: category, e_a: action, e_n: name, e_v: value, mtm_campaign: campaign, ...userInfo });
  }

  /**
   * Tracks site search
   *
   * Doc: https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search
   *
   * @param {Object} data -
   * {String} `keyword` - The Site Search keyword. When specified, the request will not be tracked as a normal pageview but will instead be tracked as a Site Search request.
   *
   * {String} `category` - when `keyword` is specified, you can optionally specify a search category with this parameter.
   *
   * {String} `count` - when `keyword` is specified, we also recommend setting the search_count to the number of search results displayed on the results page. When keywords are tracked with &search_count=0 they will appear in the "No Result Search Keyword" report.
   *
   * {Object} `userInfo` - Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.
   */
  trackSiteSearch({ keyword, category, count, userInfo = {} }) {
    if (!keyword) throw new Error('Error: keyword is required.');

    return this.track({ search: keyword, search_cat: category, search_count: count, ...userInfo });
  }

  /**
   * Tracks outgoing links to other sites
   *
   * Doc: https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search
   *
   * @param {Object} data -
   * {String} `link` - An external URL the user has opened. Used for tracking outlink clicks.
   *
   * {Object} `userInfo` - Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.
   */
  trackLink({ link, userInfo = {} }) {
    if (!link) throw new Error('Error: link is required.');

    return this.track({ link, url: link, ...userInfo });
  }

  /**
   * Tracks downloads
   *
   * Doc: https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search
   *
   * @param {Object} data -
   * {String} `download` - URL of a file the user has downloaded. Used for tracking downloads.
   *
   * {Object} `userInfo` - Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.
   */
  trackDownload({ download, userInfo = {} }) {
    if (!download) throw new Error('Error: download is required.');

    return this.track({ download, url: download, ...userInfo });
  }

  /**
   * Sends the tracking to Matomo
   */
  track(data) {
    if (this.disabled) return;
    if (!data) return;

    // take a possibly given language and delete it from the data object, as we need to pass it in
    // the headers instead of body params. otherwise it would overwrite the 'Accept-Language' value.
    const lang = data.lang;
    delete data.lang;

    const fetchObj = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Language': lang,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: new URLSearchParams({
        idsite: this.siteId,
        rec: 1,
        apiv: 1,
        ...(this.userId ? { uid: this.userId }: {}),
        send_image: 0,
        ...data
      }).toString()
    };

    return fetch(this.trackerUrl, fetchObj)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        this.log && console.log('Matomo tracking is sent:', this.trackerUrl, fetchObj);

        return response;
      })
      .catch((error) => {
        this.log && console.log('Matomo tracking is not sent:', this.trackerUrl, fetchObj);

        console.warn('Matomo tracking error:', error);

        return error;
      });
  }
}

export default MatomoTracker;
