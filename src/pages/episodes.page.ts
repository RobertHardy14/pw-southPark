import { expect, type Locator, type Page } from '@playwright/test';

export class EpisodesPage {
  private readonly episodeCards: Locator;

  constructor(private readonly page: Page) {
    this.episodeCards = page.locator('li.full-ep');
  }

  async waitForEpisodesList(): Promise<void> {
    await expect(this.episodeCards.first()).toBeVisible({ timeout: 10000 });
  }

  firstEpisodeHeadingByLabel(episodeLabel: string): Locator {
    return this.page.locator(`li.full-ep:has-text("${episodeLabel}") h2`).first();
  }

  async openFirstEpisodeByLabel(episodeLabel: string): Promise<void> {
    await this.waitForEpisodesList();
    const firstEpisodeHeading = this.firstEpisodeHeadingByLabel(episodeLabel);
    await expect(firstEpisodeHeading).toBeVisible({ timeout: 10000 });
    await firstEpisodeHeading.click();
  }
}
