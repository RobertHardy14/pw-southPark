import { expect, type Locator, type Page } from '@playwright/test';

export class TopNavComponent {
  private readonly completeEpisodesMenu: Locator;
  private readonly randomEpisodeLink: Locator;
  private readonly completeEpisodesLink: Locator;

  constructor(private readonly page: Page) {
    this.completeEpisodesMenu = page.getByTestId('sub-nav-item_0');
    this.randomEpisodeLink = page.getByRole('link', { name: 'Episodio Aleatorio' });
    this.completeEpisodesLink = page
      .getByRole('navigation')
      .getByTestId('SubNavigation')
      .getByRole('link', { name: 'Episodios Completos' });
  }

  private async expandEpisodesMenu(): Promise<void> {
    await this.completeEpisodesMenu.hover();
    await expect(this.randomEpisodeLink).toBeVisible();
    await expect(this.completeEpisodesLink).toBeVisible();
  }

  async openRandomEpisode(): Promise<void> {
    await this.expandEpisodesMenu();
    await this.randomEpisodeLink.click();
  }

  async openCompleteEpisodes(): Promise<void> {
    // The submenu's "Episodios Completos" link renders directly under the top-level trigger
    // (same href), so its subtree intermittently intercepts pointer events from the trigger.
    // The trigger itself points at the same destination, so click it directly instead of
    // going through the submenu.
    await this.expandEpisodesMenu();
    await this.completeEpisodesMenu.click();
  }
}
