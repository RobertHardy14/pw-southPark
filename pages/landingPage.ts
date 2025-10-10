import { expect, type Locator, type Page } from '@playwright/test'

export class landingPage {

    readonly page: Page
    readonly completeEpisodes: Locator
    readonly randomEpisode: Locator
    readonly episodiosDropdownButton: Locator;
    readonly firstEpisode: Locator;
    readonly firstEpisodeContainer: Locator;

    constructor(page: Page) {
        this.page = page
        this.completeEpisodes = page.getByTestId('sub-nav-item_0')
        this.randomEpisode = page.getByRole('link', { name: 'Episodio Aleatorio' })
        this.episodiosDropdownButton = page.getByRole('navigation').getByTestId('SubNavigation').getByRole('link', { name: 'Episodios Completos' })
        this.firstEpisodeContainer = page.locator('li.full-ep').first();
        this.firstEpisode = page.locator('li.full-ep').first().getByRole('link');

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
        // Wait for the page to finish loading
        // await this.page.waitForLoadState('networkidle');

        // Ensure the episode list is present
        await this.firstEpisodeContainer.waitFor({ state: 'visible' });

        await this.firstEpisode.click()
    }
}