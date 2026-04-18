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
        await this.randomEpisode.click({ force: true });
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
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            // Scroll to the bottom of the page
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await this.page.waitForTimeout(500);

            // Check if "Cargar más" button is visible and click it
            const loadMore = this.page.getByRole('button', { name: 'Cargar más' });
            if (await loadMore.isVisible()) {
                await loadMore.click();
                await this.page.waitForTimeout(1000); // Wait for content to load
            }

            // Check if the Emmy collection is now visible
            if (await this.emmyCollection.isVisible()) {
                break;
            }

            attempts++;
        }

        // Once visible, scroll into view and click
        await this.emmyCollection.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'load' }),
            this.emmyCollection.click()
        ]);
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

        // Handle potential new page/tab opening
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            firstLink.click()
        ]);

        // Wait for the new page to load
        await newPage.waitForLoadState('load');

        // Optionally, switch to the new page for further actions
        // this.page = newPage; // If you need to interact with the new page

        console.log('New page URL:', newPage.url());
    }

}