# South Park Playwright suite

End-to-end tests for [southpark.lat](https://www.southpark.lat), the Spanish/LatAm South Park Studios site, using Playwright + TypeScript with a Page Object Model.

## Structure

```
src/
  pages/        # Page objects (HomePage, EpisodesPage)
  components/   # Reusable nav/UI components
tests/
  data/         # Test data (routes, collections, episode labels)
  fixtures/     # Custom Playwright fixtures (auto-instantiate page objects)
  specs/        # Test specs
```

## Running tests

```
npm test              # headless, all browsers
npm run test:headed   # headed
npm run test:ui       # Playwright UI mode
npm run test:report   # open the last HTML report
```

## CI and the geo-locale gap

`southpark.lat` decides which locale to serve **by visitor IP**, not by the domain. From a
LatAm IP, it serves the Spanish site the tests are written against. From a US datacenter IP
(GitHub Actions runners included), it silently serves the English US South Park Studios site
instead — same domain, completely different markup, no redirect or error to catch.

This was confirmed by capturing screenshots/page snapshots on CI failures: the nav tests
were failing because the page they ran against had `Full Episodes` / `Random Episode` links,
not the expected `Episodios Completos` / `Episodio Aleatorio`. Setting `Accept-Language` to
`es-419` didn't change the outcome — the routing is a hard server-side IP check.

Rather than have CI report false regressions for something that isn't a code bug, the
locale-dependent tests (`navigates to random episode...`, `opens first episode listed...`,
`header/menu contract...`, `opens Emmy Collection...`) are skipped when `process.env.CI` is
set. The footer/legal-links test doesn't depend on locale-specific text, so it still runs and
gates CI.

The full suite runs normally on any machine with a LatAm-routable connection, which is the
expected way to run it locally. Making CI see the same content it needs either a self-hosted
runner in a LatAm region or a paid regional proxy — worth revisiting if this suite needs to be
a real regression gate rather than a local dev-loop check.
