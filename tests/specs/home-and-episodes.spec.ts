import { test, expect } from '../fixtures/base.fixture';
import { COLLECTIONS } from '../data/collections.data';
import { EPISODES } from '../data/episodes.data';
import { ROUTES } from '../data/routes.data';

const randomEpisodeUrlTimeoutMs = 15_000;

// southpark.lat geo-locates by IP and serves the English US site to non-LatAm IPs
// (confirmed via CI screenshots), ignoring the .lat domain entirely. GitHub Actions
// runners get the English site, so these Spanish-locator tests can't pass there.
// They still run locally and against any LatAm-IP environment. See README.
const skipOnCi = !!process.env.CI;
const ciSkipReason = 'requires a LatAm IP to see the Spanish site; see README';

test('navigates to random episode from episodes nav menu', async ({ homePage, page }) => {
  test.skip(skipOnCi, ciSkipReason);
  await homePage.gotoHome();
  await homePage.openRandomEpisodeFromNav();
  await expect(page).toHaveURL(new RegExp(ROUTES.randomEpisodePathContains), {
    timeout: randomEpisodeUrlTimeoutMs,
  });
});

test('opens first episode listed in episodios completos', async ({ homePage, episodesPage, page }) => {
  test.skip(skipOnCi, ciSkipReason);
  await homePage.gotoHome();
  await homePage.openCompleteEpisodesFromNav();

  await expect(page).toHaveURL(new RegExp(ROUTES.episodesPathContains));
  await episodesPage.openFirstEpisodeByLabel(EPISODES.firstSeasonFirstEpisodeLabel);
});

test('header/menu contract: key navigation links are visible and usable', async ({ homePage, page }) => {
  test.skip(skipOnCi, ciSkipReason);
  await homePage.gotoHome();

  const navContainer = page.getByRole('navigation');
  const episodesMenuTrigger = page.getByTestId('sub-nav-item_0');

  await expect(navContainer).toBeVisible();
  await expect(episodesMenuTrigger).toBeVisible();

  // Submenu links (Episodio Aleatorio + Episodios Completos) are asserted in TopNav before click.
  await homePage.openRandomEpisodeFromNav();
  await expect(page).toHaveURL(new RegExp(ROUTES.randomEpisodePathContains), {
    timeout: randomEpisodeUrlTimeoutMs,
  });
});

test('footer/legal links smoke: privacy and terms pages are reachable', async ({ homePage, page }) => {
  await homePage.gotoHome();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const footer = page.locator('footer');
  const privacyLink = footer.locator('a[href*="privacy"]').first();
  const legalLink = footer
    .locator(
      'a[href*="terms"], a[href*="term"], a[href*="california"], a[href*="copyright"], a[href*="notice"]'
    )
    .first();

  await expect(footer).toBeVisible();
  await expect(privacyLink).toBeVisible();
  await expect(legalLink).toBeVisible();

  await privacyLink.click();
  await expect(page).toHaveURL(/privacy/i);

  await page.goBack();
  await expect(legalLink).toBeVisible();

  await legalLink.click();
  await expect(page).toHaveURL(/(terms|term|california|copyright|notice)/i);
});

test('opens Emmy Collection from home and follows its first article link', async ({ homePage, page }) => {
  test.skip(skipOnCi, ciSkipReason);
  await homePage.gotoHome();
  await homePage.openCollectionCardByName(COLLECTIONS.emmyEpisodes);

  await expect(page).toHaveURL(ROUTES.emmyCollectionPathRegex, { timeout: 10_000 });

  const targetPage = await homePage.openFirstMainLinkInNewTab();
  await expect(targetPage).not.toHaveURL(ROUTES.emmyCollectionPathRegex, { timeout: 10_000 });
});
