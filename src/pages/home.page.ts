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

  async openCollectionCardByName(collectionName: string, timeoutMs = 60_000): Promise<void> {
    const targetCard = this.page.getByText(collectionName, { exact: true });

    // Collections load via a "Cargar más" pagination button whose batch load time varies
    // (worse under parallel workers), so retry continuously against a total budget instead
    // of a fixed number of attempts with short per-attempt timeouts.
    await expect
      .poll(
        async () => {
          if (await targetCard.isVisible()) {
            return true;
          }

          await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

          if (await this.loadMoreButton.isVisible()) {
            await this.loadMoreButton.click();
          }

          return false;
        },
        { timeout: timeoutMs }
      )
      .toBeTruthy();

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
