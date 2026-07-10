import { test as base, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/home.page';
import { EpisodesPage } from '../../src/pages/episodes.page';

type AppFixtures = {
  homePage: HomePage;
  episodesPage: EpisodesPage;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  episodesPage: async ({ page }, use) => {
    await use(new EpisodesPage(page));
  },
});

export { expect };
