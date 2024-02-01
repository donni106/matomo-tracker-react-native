/**
 * Represents a Matomo Tracker for tracking user interactions.
 *
 * @class
 * @param {Object} userOptions - User configuration options for Matomo tracking.
 * @param {string} userOptions.urlBase - The base URL for Matomo tracking.
 * @param {number} userOptions.siteId - The Matomo site ID.
 * @param {string} [userOptions.trackerUrl] - The tracker URL. If not provided, it defaults to `${urlBase}/matomo.php`.
 * @param {string} [userOptions.userId] - The user ID for tracking.
 * @param {boolean} [userOptions.disabled=false] - Indicates if Matomo tracking is disabled.
 * @param {boolean} [userOptions.log=false] - Indicates if logging is enabled.
 */
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

  /**
   * Initializes the MatomoTracker with user options.
   *
   * @param {Object} options - Initialization options.
   * @param {string} options.urlBase - The base URL for Matomo tracking.
   * @param {string} [options.trackerUrl] - The tracker URL. If not provided, it defaults to `${urlBase}/matomo.php`.
   * @param {number} options.siteId - The Matomo site ID.
   * @param {string} [options.userId] - The user ID for tracking.
   * @param {boolean} [options.disabled=false] - Indicates if Matomo tracking is disabled.
   * @param {boolean} [options.log=false] - Indicates if logging is enabled.
   */
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
   * Tracks app start as an action with a prefixed 'App' category.
   *
   * @param {Object} [options={}] - Tracking options.
   * @param {Object} [options.userInfo={}] - Optional data for tracking different user info.
   * @returns {Promise} A Promise that resolves when the tracking is complete.
   *
   * @see https://developer.matomo.org/api-reference/tracking-api#optional-user-info for optional data used for tracking different user info
   */
  trackAppStart({ userInfo = {} } = {}) {
    return this.trackAction({ name: 'App / start', userInfo });
  }

  /**
   * Tracks a screen view as an action with the prefixed 'Screen' category.
   *
   * This method is used to record user interactions with screens or pages in your application.
   *
   * @param {Object} options - Options for tracking the screen view.
   * @param {string} options.name - The title of the screen being tracked. Use slashes (/) to set one or several categories for this screen. For example, 'Help / Feedback' will create the Action 'Feedback' in the category 'Help'.
   * @param {Object} [options.userInfo={}] - Optional data used for tracking different user information. See {@link https://developer.matomo.org/api-reference/tracking-api#optional-user-info} for details.
   * @throws {Error} Throws an error if the 'name' parameter is not provided.
   * @returns {Promise} A Promise that resolves when the screen view tracking is complete.
   *
   * @example
   * // Tracking a screen view without user information
   * trackScreenView({ name: 'Home' });
   *
   * @example
   * // Tracking a screen view with additional user information
   * trackScreenView({ name: 'Product Details', userInfo: { uid: '123456' } });
   */
  trackScreenView({ name, userInfo = {} }) {
    if (!name) {
      throw new Error('Error: The "name" parameter is required for tracking a screen view.');
    }

    return this.trackAction({ name: `Screen / ${name}`, userInfo });
  }


  /**
   * Tracks a custom action.
   *
   * This method is used to record user interactions with specific actions in your application.
   *
   * @param {Object} options - Options for tracking the action.
   * @param {string} options.name - The title of the action being tracked. Use slashes (/) to set one or several categories for this action. For example, 'Help / Feedback' will create the Action 'Feedback' in the category 'Help'.
   * @param {Object} [options.userInfo={}] - Optional data used for tracking different user information. See {@link https://developer.matomo.org/api-reference/tracking-api#optional-user-info} for details.
   * @throws {Error} Throws an error if the 'name' parameter is not provided.
   * @returns {Promise} A Promise that resolves when the action tracking is complete.
   *
   * @example
   * // Tracking a custom action without user information
   * trackAction({ name: 'ButtonClick' });
   *
   * @example
   * // Tracking a custom action with additional user information
   * trackAction({ name: 'AddToCart', userInfo: { uid: '123456'} });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#recommended-parameters|Matomo Tracking API - Recommended Parameters}
   */
  trackAction({ name, userInfo = {} }) {
    if (!name) {
      throw new Error('Error: The "name" parameter is required for tracking an action.');
    }

    return this.track({ action_name: name, ...userInfo });
  }

  /**
   * Tracks a custom event.
   *
   * This method is used to record specific events in your application, providing insights into user interactions.
   *
   * @param {Object} options - Options for tracking the event.
   * @param {string} options.category - The event category. Must not be empty. (e.g., Videos, Music, Games...)
   * @param {string} options.action - The event action. Must not be empty. (e.g., Play, Pause, Duration, Add Playlist, Downloaded, Clicked...)
   * @param {string} [options.name] - The event name. (e.g., a Movie name, or Song name, or File name...)
   * @param {number|float} [options.value] - The event value. Must be a float or integer value (numeric), not a string.
   * @param {string} [options.campaign] - The event related campaign.
   * @param {Object} [options.userInfo={}] - Optional data used for tracking different user information. See {@link https://developer.matomo.org/api-reference/tracking-api#optional-user-info} for details.
   * @throws {Error} Throws an error if the 'category' or 'action' parameters are not provided.
   * @returns {Promise} A Promise that resolves when the event tracking is complete.
   *
   * @example
   * // Tracking a basic event without additional information
   * trackEvent({ category: 'Videos', action: 'Play' });
   *
   * @example
   * // Tracking an event with a name and user information
   * trackEvent({ category: 'Music', action: 'Pause', name: 'FavoriteSong', userInfo: { uid: '123456'} });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#optional-event-trackinghttpsmatomoorgdocsevent-tracking-info|Matomo Tracking API - Event Tracking}
   */
  trackEvent({ category, action, name, value, campaign, userInfo = {} }) {
    if (!category) {
      throw new Error('Error: The "category" parameter is required for tracking an event.');
    }
    if (!action) {
      throw new Error('Error: The "action" parameter is required for tracking an event.');
    }

    return this.track({
      e_c: category,
      e_a: action,
      e_n: name,
      e_v: value,
      mtm_campaign: campaign,
      ...userInfo
    });
  }

  /**
   * Tracks a site search.
   *
   * This method is used to record user searches on your site, providing valuable insights into user behavior.
   *
   * @param {Object} options - Options for tracking the site search.
   * @param {string} options.keyword - The site search keyword. When specified, the request will not be tracked as a normal page view but will instead be tracked as a Site Search request.
   * @param {string} [options.category] - Optional. When the 'keyword' parameter is specified, you can optionally specify a search category with this parameter.
   * @param {number} [options.count] - Optional. When the 'keyword' parameter is specified, it is recommended to set 'search_count' to the number of search results displayed on the results page. When keywords are tracked with '&search_count=0', they will appear in the "No Result Search Keyword" report.
   * @param {Object} [options.userInfo={}] - Optional data used for tracking different user information. See {@link https://developer.matomo.org/api-reference/tracking-api#optional-user-info} for details.
   * @throws {Error} Throws an error if the 'keyword' parameter is not provided.
   * @returns {Promise} A Promise that resolves when the site search tracking is complete.
   *
   * @example
   * // Tracking a site search without additional information
   * trackSiteSearch({ keyword: 'product' });
   *
   * @example
   * // Tracking a site search with a category, result count, and user information
   * trackSiteSearch({ keyword: 'tutorial', category: 'Learning', count: 5, userInfo: { uid: '123456' } });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search|Matomo Tracking API - Site Search Tracking}
   */
  trackSiteSearch({ keyword, category, count, userInfo = {} }) {
    if (!keyword) {
      throw new Error('Error: The "keyword" parameter is required for tracking a site search.');
    }

    return this.track({ search: keyword, search_cat: category, search_count: count, ...userInfo });
  }

  /**
   * Tracks clicks on outgoing links.
   *
   * This method is used to record user interactions when clicking on external links, providing insights into user navigation patterns.
   *
   * @param {Object} options - Options for tracking the link click.
   * @param {string} options.link - An external URL the user has opened. Used for tracking outlink clicks.
   * @param {Object} [options.userInfo={}] - Optional data used for tracking different user information. See {@link https://developer.matomo.org/api-reference/tracking-api#optional-user-info} for details.
   * @throws {Error} Throws an error if the 'link' parameter is not provided.
   * @returns {Promise} A Promise that resolves when the link click tracking is complete.
   *
   * @example
   * // Tracking a link click without additional information
   * trackLink({ link: 'https://external-site.com' });
   *
   * @example
   * // Tracking a link click with user information
   * trackLink({ link: 'https://external-site.com', userInfo: { userId: '123456', userRole: 'visitor' } });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search|Matomo Tracking API - Outlink Tracking}
   */
  trackLink({ link, userInfo = {} }) {
    if (!link) {
      throw new Error('Error: The "link" parameter is required for tracking a link click.');
    }

    return this.track({ link, url: link, ...userInfo });
  }


  /**
   * Tracks file downloads.
   *
   * This method is used to record user interactions when downloading files, providing insights into user engagement with downloadable content.
   *
   * @param {Object} options - Options for tracking the file download.
   * @param {string} options.download - URL of a file the user has downloaded. Used for tracking downloads.
   * @param {Object} [options.userInfo={}] - Optional data used for tracking different user information. See {@link https://developer.matomo.org/api-reference/tracking-api#optional-user-info} for details.
   * @throws {Error} Throws an error if the 'download' parameter is not provided.
   * @returns {Promise} A Promise that resolves when the download tracking is complete.
   *
   * @example
   * // Tracking a file download without additional information
   * trackDownload({ download: 'https://example.com/files/document.pdf' });
   *
   * @example
   * // Tracking a file download with user information
   * trackDownload({ download: 'https://example.com/files/image.png', userInfo: { uid: '123456' } });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search|Matomo Tracking API - Download Tracking}
   */
  trackDownload({ download, userInfo = {} }) {
    if (!download) {
      throw new Error('Error: The "download" parameter is required for tracking a file download.');
    }

    return this.track({ download, url: download, ...userInfo });
  }


  /**
   * Sends the tracking data to Matomo.
   *
   * @param {Object} data - The tracking data.
   * @returns {Promise} A Promise that resolves when the tracking data is sent.
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
