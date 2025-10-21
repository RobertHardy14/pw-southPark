import { expect, type Locator, type Page } from '@playwright/test'

export class landingPage {

    readonly page: Page
    readonly completeEpisodes: Locator
    readonly randomEpisode: Locator
    readonly episodiosDropdownButton: Locator;
    readonly firstEpisode: Locator;
    readonly emmyCollection: Locator;

    constructor(page: Page) {
        this.page = page
        this.completeEpisodes = page.getByTestId('sub-nav-item_0')
        this.randomEpisode = page.getByRole('link', { name: 'Episodio Aleatorio' })
        this.episodiosDropdownButton = page.getByRole('navigation').getByTestId('SubNavigation').getByRole('link', { name: 'Episodios Completos' })
        this.firstEpisode = page.locator('li.full-ep:has-text("T1 • E1") h2').first();
        this.emmyCollection = page.getByText('Colección: Emmy Episodes', { exact: true });
    }

    async navigate() {
        await this.page.goto('https://www.southpark.lat/')
    }

    async clickOnNavBar() {
        await this.completeEpisodes.hover()
    }

    async clickOnEpisodes() {
        await this.randomEpisode.click()
    }

    async navigateToEpisodiosCompletos() {
        // Hover over the nav item to reveal the dropdown
        await this.completeEpisodes.hover();

        // Wait for the dropdown button to be visible
        // await this.episodiosDropdownButton.waitFor({ state: 'visible' });

        // Click the dropdown button while ensuring the hover state is maintained
        await this.episodiosDropdownButton.click({ force: true });
    }

    async selectFirstEpisode() {
        await this.page.locator('li.full-ep').first().waitFor({ state: 'attached' });

        await this.firstEpisode.waitFor({ state: 'visible' });

        await this.firstEpisode.scrollIntoViewIfNeeded();
        await this.firstEpisode.click();
    }


    async clickEmmyCollection() {
        await this.emmyCollection.waitFor({ state: 'visible', timeout: 8000 });
        await this.emmyCollection.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await this.emmyCollection.click();
        await this.page.waitForLoadState('networkidle');
    }

    async expectCollectionPageOpened() {
        // ✅ Expect exact URL after clicking
        await expect(this.page).toHaveURL(/\/noticias\/cleowc\/coleccion-emmy-episodes$/, { timeout: 10000 });
    }

    async clickFirstLinkInCollection() {
        // Wait for any <a> tag on the page — adjust selector if there's a specific link
        const firstLink = this.page.locator('main a').first();

        await firstLink.waitFor({ state: 'visible', timeout: 8000 });
        const href = await firstLink.getAttribute('href');
        console.log('Clicking first link:', href);

        await firstLink.scrollIntoViewIfNeeded();
        await firstLink.click();

        // Wait for navigation triggered by the link
        await this.page.waitForLoadState('networkidle');
    }

}