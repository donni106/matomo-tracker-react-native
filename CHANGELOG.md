# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [v0.3.1]

Merge signed out user with signed in user

## [v0.3.0]

Pass more params to Matomo Tracking HTTP API

- see https://developer.matomo.org/api-reference/tracking-api#optional-user-info
  for possible params

### Changed

- **BREAKING** updated four methods to receive a params object while adding optional user info to every method
  - `trackAppStart()` -> `trackAppStart({ userInfo = {} } = {})`
  - `trackScreenView(name)` -> `trackScreenView({ name, userInfo = {} })`
  - `trackLink(link)` -> `trackLink({ link, userInfo = {} })`
  - `trackDownload(download)` -> `trackDownload({ download, userInfo = {} })`
- added `send_image: 0` - If set to 0 (send_image=0) Matomo will respond with a
  HTTP 204 response code instead of a GIF image
- added `'Accept-Language': lang` - This value is used to detect the visitor's country

## [v0.2.4]

Memoize `useMatomo` hook

### Changed

- added `useMemo` to the returned hook object

## [v0.2.3]

Provide MatomoContext

### Changed

- export `MatomoContext` as well

## [v0.2.2]

Optimize error handling

### Changed

- added error handling with returning the error instead of `console.error` to let the parent app
  handle errors individually

## [v0.2.1]

Update readme

### Fixed

- corrected import advices

## [v0.2.0]

First version to use Matomo tracking

### Added

- created `MatomoTracker` class, `MatomoProvider` context and `useMatomo` hook to provide
  functionality for tracking with a Matomo instance

## [v0.1.0]

First npm publish

## [v0.0.1]

Initial repository setup with readmes and issue templates
