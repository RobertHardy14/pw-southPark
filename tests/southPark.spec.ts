import { test, expect } from '@playwright/test'
import { landingPage } from '../pages/landingPage'

test('Navigates to random episode', async ({ page }) => {

    const landing = new landingPage(page);

    await landing.navigate();
    await landing.clickOnNavBar();
    await landing.clickOnEpisodes();

})

