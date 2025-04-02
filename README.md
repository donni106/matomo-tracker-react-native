<img src="./matomo-tracker-react-native.png" width="350">

# Matomo Tracker (React Native/Expo)

![Project version](https://img.shields.io/badge/version-0.3.3-informational.svg?style=flat-square)

Stand alone library for using Matomo tracking in React Native and Expo projects.

There is one [React Native Matomo package](https://github.com/BonifyByForteil/react-native-matomo) mentioned on the [official integration docs of Matomo](https://matomo.org/integrate), which sadly cannot be used with Expo because of native modules that are included.

If you know React Native already but have not heard about Expo yet, you can read about it [here in their docs](https://docs.expo.io/workflow/already-used-react-native).

This package aims for making tracking available in every React Native app with sending custom actions to the [Matomo Tracking HTTP API](https://developer.matomo.org/api-reference/tracking-api).

There are two existing implementations for Node.js and React, that built the basis for this React Native package. Thanks to:
- https://github.com/matomo-org/matomo-nodejs-tracker
- https://github.com/Amsterdam/matomo-tracker

## Installation

```sh
# with npm:

npm install matomo-tracker-react-native

# or with yarn:

yarn add matomo-tracker-react-native
```

## Usage

You need to create a Matomo instance within your project with your specific Matomo details and wrap your app with the `MatomoProvider` of this package.

The `useMatomo` hook is exposing all methods you can use for several trackings.

```js
import React, { useEffect } from 'react';
import MatomoTracker, { MatomoProvider, useMatomo } from 'matomo-tracker-react-native';

const MainAppContainer = () => {
  const { trackAppStart } = useMatomo();

  useEffect(() => {
    trackAppStart();
  }, []);

  return (
    <View>Main App</View>
  );
};

export const App = () => {
  const instance = new MatomoTracker({
    urlBase: 'https://LINK.TO.DOMAIN', // required
    // trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
    siteId: 1, // required, number matching your Matomo project
    // userId: 'UID76903202' // optional, default value: `undefined`.
    // disabled: false, // optional, default value: false. Disables all tracking operations if set to true.
    // log: false  // optional, default value: false. Enables some logs if set to true.
  });

  return (
    <MatomoProvider instance={instance}>
      <MainAppContainer />
    </MatomoProvider>
  );
};
```

## Instance

You need to provide at least an `urlBase` and a `siteId` to create an instance.

Method              | Default                | Description
------------------- | ---------------------- | -----------------------------------------------------------------------
`urlBase`           |                        | **(required)** Link to your Matomo server domain.
`trackerUrl`        | `${urlBase}matomo.php` | If your Matomo runs a different endpoint than the default `matomo.php`.
`siteId`            |                        | **(required)** Number matching your Matomo project.
`userId`            | `undefined`            | Defines the User ID for a tracking request. The User ID is any non-empty unique string identifying an user. (https://developer.matomo.org/api-reference/tracking-api#optional-user-info)
`disabled`          | `false`                | Disables all tracking operations if set to true.
`log`               | `false`                | Enables some logs if set to true.

## Methods

The following methods are available with the `useMatomo` hook.

### trackAppStart({ userInfo = {} } = {})

Tracks app start as action with prefixed 'App' category: `App / start`.

Param      | Description
---------- | -----------
`userInfo` | Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.

### trackScreenView({ name, url, userInfo = {} })

Tracks screen view as action with prefixed 'Screen' category: `Screen / ${name}`

Param      | Description
---------- | -----------
`name`     | The title of the action being tracked. It is possible to use slashes / to set one or several categories for this action. For example, Help / Feedback will create the Action Feedback in the category Help.
`url`      | The full URL for the current action.
`userInfo` | Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.

### trackAction({ name, url, userInfo = {} })

Tracks actions

Doc: https://developer.matomo.org/api-reference/tracking-api#recommended-parameters

Param      | Description
---------- | -----------
`name`     | The title of the action being tracked. It is possible to use slashes / to set one or several categories for this action. For example, Help / Feedback will create the Action Feedback in the category Help.
`url`      | The full URL for the current action.
`userInfo` | Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.

### trackEvent({ category, action, name, value, campaign, url, userInfo = {} })

Tracks custom events

Doc: https://developer.matomo.org/api-reference/tracking-api#optional-event-trackinghttpsmatomoorgdocsevent-tracking-info

Param      | Description
---------- | -----------
`category` | The event category. Must not be empty. (eg. Videos, Music, Games...)
`action`   | The event action. Must not be empty. (eg. Play, Pause, Duration, Add Playlist, Downloaded, Clicked...)
`name`     | The event name. (eg. a Movie name, or Song name, or File name...)
`value`    | The event value. Must be a float or integer value (numeric), not a string.
`campaign` | The event related campaign.
`url`      | The full URL for the current action.
`userInfo` | Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.

### trackContent({ name, piece, target, interaction, url, userInfo = {} })

Tracks content impressions or interactions

Doc: https://developer.matomo.org/api-reference/tracking-api#optional-content-trackinghttpsmatomoorgdocscontent-tracking-info

Param         | Description
--------------| -----------
`name`        | The name of the content. For instance 'Ad Foo Bar'.
`piece`       | The actual content piece. For instance the path to an image, video, audio, any text.
`target`      | The target of the content. For instance the URL of a landing page.
`interaction` | The name of the interaction with the content. For instance a 'click'.
`url`         | The full URL for the current action.
`userInfo`    | Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.

### trackSiteSearch({ keyword, category, count, url, userInfo = {} })

Tracks site search

Doc: https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search

Param       | Description
----------- | -----------
`keyword`   | The Site Search keyword. When specified, the request will not be tracked as a normal pageview but will instead be tracked as a Site Search request.
`category`  | When `keyword` is specified, you can optionally specify a search category with this parameter.
`count`     | When `keyword` is specified, it is also recommended setting the search_count to the number of search results displayed on the results page. When keywords are tracked with &search_count=0 they will appear in the "No Result Search Keyword" report.
`url`       | The full URL for the current action.
`userInfo`  | Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.

### trackLink({ link, url, userInfo = {} })

Tracks outgoing links to other sites

Doc: https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search

Param      | Description
---------- | -----------
`link`     | An external URL the user has opened. Used for tracking outlink clicks.
`url`      | The full URL for the current action.
`userInfo` | Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.

### trackDownload({ download, url, userInfo = {} })

Tracks downloads

Doc: https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search

Param      | Description
---------- | -----------
`download` | URL of a file the user has downloaded. Used for tracking downloads.
`url`      | The full URL for the current action.
`userInfo` | Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.

### updateUserInfo({ userInfo = {} })

Updates user information for tracking purposes.

Doc: https://developer.matomo.org/api-reference/tracking-api#optional-user-info

Param      | Description
---------- | -----------
`userInfo` | Optional data used for tracking different user info, see https://developer.matomo.org/api-reference/tracking-api#optional-user-info.

### removeUserInfo()

Removes user information for tracking purposes.


## Changelog

Have a look at the [changelog](./CHANGELOG.md) to be up to date with the development process.


---

###### Version: 0.3.3
