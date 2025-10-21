import { test, expect } from '@playwright/test'
import { landingPage } from '../pages/landingPage'

test('Navigates to random episode', async ({ page }) => {

    const landing = new landingPage(page);

    await landing.navigate();
    await landing.clickOnNavBar();
    await landing.clickOnEpisodes();

})

test('Should select first episode below "Episodios completos"', async ({ page }) => {
    const landing = new landingPage(page);

    // Navigate to southpark.lat
    await landing.navigate();

    await landing.clickOnNavBar();

    // Navigate to the episodes page
    await landing.navigateToEpisodiosCompletos();

    // Now verify you're on the correct page
    await expect(page.url()).toContain('/seasons/south-park');

    await landing.selectFirstEpisode();
})

test('Select Collection: Emmys Episode', async ({ page }) => {
    const landing = new landingPage(page);

    await landing.navigate();
    await landing.clickEmmyCollection();
    await landing.expectCollectionPageOpened()
    await landing.clickFirstLinkInCollection()
})