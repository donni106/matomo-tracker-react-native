# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
