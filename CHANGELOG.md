# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.1.0] - 2025-07-17

### Added

- Add the `__nextHasNoMarginBottom` property to the Toggle control (Block's Edit script).
- Add the `wp-block-embed-theme` style dependency.
- Now uses @wordpress/scripts to generate the built block.

### Removed

- Dependency to [Composer](https://getcomposer.org/).
- Dependency to [ParcelJS](https://parceljs.org/).
- Dependency to the [Entrepôt](https://github.com/imath/entrepot) plugin.

### Fixed

- Only display the Spinner while loading the source code.

### Changed

- Bump Block stable version to 1.1.0.
- Rename "Bout de Code" in favor of "Bout de code".
- Update the README.md file to use a new screenshot & to inform Bout de code is now a Retraceur block.
- Move the `bout-de-code.pot` file inside a new `/i18n` directory.
- Move the server code used to set the Gist.GitHub.com handler into the main plugin file.
- Use the MIT license.


## [1.0.0] - 2021-01-03

### Added

- Block main feature: let authors embed gists from Gists.GitHub.com into their WP posts, thanks to the [Entrepôt](https://github.com/imath/entrepot) plugin.
