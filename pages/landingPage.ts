import { expect, type Locator, type Page } from '@playwright/test'

export class landingPage {

    readonly page: Page
    readonly completeEpisodes: Locator
    readonly randomEpisode: Locator

    constructor(page: Page) {
        this.page = page
        this.completeEpisodes = page.getByTestId('sub-nav-item_0')
        this.randomEpisode = page.getByRole('link', { name: 'Episodio Aleatorio' })
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
}