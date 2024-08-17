import { test, expect, type Page } from 'playwright-test-coverage';
import { HomePage } from '../pages/home-page';
import { Utilities } from '../utilities/actions';
import credentials from '../fixtures/credentials.json';

test.describe('Validate Display tiles on homepage', () => {
  let homepage: HomePage;
  let utilities: Utilities;
  let pageX;
  test.beforeEach(async ({ page }: { page: Page }) => {
    test.setTimeout(60000)
    if (process.env.RUN_TIME == 'stage') {
      homepage = new HomePage(page);
      console.log('i am in stage>>>' + process.env.RUN_TIME);
      pageX = await test.step("Login", async () => {
        return await homepage.loginNavigateToBPL(credentials.username, credentials.password);
      })
      homepage = new HomePage(pageX);
    } else {
      homepage = new HomePage(page);
      await homepage.goto();
    }
  });

  test('Validate Display tile manage attributes on @homepage', async ({ page }) => {
    await page.waitForLoadState();
    if (process.env.RUN_TIME == 'stage') {
      await expect(page).toHaveTitle('TriNet Platform');
    } else {
      await expect(page).toHaveTitle('Benefit Plan Library');
    }
    await homepage.clickManageAttributesButton();
    if (process.env.RUN_TIME == 'stage') {
      await expect(page).toHaveURL('https://trinetqen2.hrpassport.com/#/app/main/dashboard');
    } else {
      await expect(page).toHaveURL(/.*\/base-plans$/);
    }

  });

  test('BNCBS-934 Validate Display tile @BCR Sync Status on homepage', async ({ page }) => {
    await page.waitForLoadState();
    await expect(homepage.tileHeader).toBeVisible();
    await expect(homepage.tileContent).toBeVisible();
    await homepage.clickViewSyncIssuesButton();
    if (process.env.RUN_TIME == 'stage') {
      await expect(page).toHaveURL('https://trinetqen2.hrpassport.com/#/app/main/dashboard');
    } else {
      await expect(page).toHaveURL(/.*\/sync-issues$/);
    }


  });
});
