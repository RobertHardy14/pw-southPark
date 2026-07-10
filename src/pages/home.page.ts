import { expect, type Locator, type Page } from '@playwright/test';
import { TopNavComponent } from '../components/topNav.component';

export class HomePage {
  readonly nav: TopNavComponent;
  private readonly loadMoreButton: Locator;
  private readonly emmyCollectionCard: Locator;

  constructor(private readonly page: Page) {
    this.nav = new TopNavComponent(page);
    this.loadMoreButton = page.getByRole('button', { name: 'Cargar más' });
    this.emmyCollectionCard = page.getByText('Colección: Emmy Episodes', { exact: true });
  }

  async gotoHome(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openRandomEpisodeFromNav(): Promise<void> {
    await this.nav.openRandomEpisode();
  }

  async openCompleteEpisodesFromNav(): Promise<void> {
    await this.nav.openCompleteEpisodes();
  }

  async openCollectionCardByName(collectionName: string, maxAttempts = 8): Promise<void> {
    const targetCard = this.page.getByText(collectionName, { exact: true });

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (await targetCard.isVisible()) {
        await targetCard.scrollIntoViewIfNeeded();
        await targetCard.click();
        return;
      }

      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      if (await this.loadMoreButton.isVisible()) {
        await this.loadMoreButton.click();

        // Wait until either target appears or button state changes after loading.
        await expect
          .poll(
            async () => {
              const targetVisible = await targetCard.isVisible();
              const loadMoreVisible = await this.loadMoreButton.isVisible();
              return targetVisible || !loadMoreVisible;
            },
            { timeout: 7000 }
          )
          .toBeTruthy();
      }
    }

    await expect(targetCard).toBeVisible({ timeout: 5000 });
    await targetCard.scrollIntoViewIfNeeded();
    await targetCard.click();
  }

  async openFirstMainLinkInNewTab(): Promise<Page> {
    const firstLink = this.page.locator('main a').first();
    await expect(firstLink).toBeVisible({ timeout: 10000 });
    const popupPromise = this.page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null);

    await firstLink.click();
    const popupPage = await popupPromise;

    if (popupPage) {
      await popupPage.waitForLoadState('domcontentloaded');
      return popupPage;
    }

    await this.page.waitForLoadState('domcontentloaded');
    return this.page;
  }

  get emmyCollection(): Locator {
    return this.emmyCollectionCard;
  }
}
