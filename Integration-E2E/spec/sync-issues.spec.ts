import { test, expect, type Page } from 'playwright-test-coverage';
import { HomePage } from '../pages/home-page';
import { SyncIssuesPage } from '../pages/sync-issues.page';
import { Utilities } from '../utilities/actions';
import { BNCBS943 } from '../fixtures/sync-issues.json';
import { BNCBS756 } from '../fixtures/plan-headers.json';
import { PlanAttributesPage } from 'Integration-E2E/pages/plan-attributes.page';
import credentials from '../fixtures/credentials.json';
import exp from 'constants';

test.describe('Sync Issues', () => {
  let homepage: HomePage;
  let syncIssuesPage: SyncIssuesPage;
  let utilities: Utilities;
  let planAttributesPage: PlanAttributesPage;
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
      syncIssuesPage = new SyncIssuesPage(pageX);
      planAttributesPage = new PlanAttributesPage(pageX);
      utilities = new Utilities();
    } else {
      homepage = new HomePage(page);
      syncIssuesPage = new SyncIssuesPage(page);
      planAttributesPage = new PlanAttributesPage(page);
      utilities = new Utilities();
      await homepage.goto();
    }
  });
  test('@BNCBS943 Loads Sync Issues list and rerun failed sync issues', async ({ page }) => {
    if (process.env.RUN_TIME == 'stage') { console.log('@BNCBS943 passed in stage') } else {
      await expect(page).toHaveTitle('Benefit Plan Library');
      await homepage.clickViewSyncIssuesButton();
      await expect(page).toHaveURL(/.*\/sync-issues$/);
      await expect(syncIssuesPage.syncIssuesList).toBeVisible();
      await syncIssuesPage.selectFailedSyncStatusRows();
      await utilities.assertStep(syncIssuesPage.reRunButton, 'enabled', 'Validating if the rerun button is enabled');
      await syncIssuesPage.clickReRunSyncIssuesButton();
      await utilities.assertStep(syncIssuesPage.sucessMessage, 'click', 'click on the Rerun button to sync the failed issues');
      await utilities.assertStep(syncIssuesPage.sucessMessage, 'text', 'Validated success alert title ' + BNCBS943.successAlertTitle + ' is displayed on the screen', BNCBS943.successAlertTitle);
      await utilities.assertStep(syncIssuesPage.sucessMessage, 'text', 'Validated success alert messafe ' + BNCBS943.successAlertMessage + ' is displayed on the screen', BNCBS943.successAlertMessage);
      await utilities.assertStep(syncIssuesPage.backButton, 'visible', 'Validated success alert messafe ' + BNCBS943.back + ' is displayed on the screen', BNCBS943.back);
    }
  });

  test.skip('@BNCBS-756 Validate Plan year link for failed status plan in  syncing issues page', async ({ page }) => {
    // test.setTimeout(100000)
    if (process.env.RUN_TIME == 'stage') { console.log('@BNCBS-756 passed in stage') } else {
      await homepage.clickViewSyncIssuesButton();
      await expect(page).toHaveURL(/.*\/sync-issues$/);
      await expect(syncIssuesPage.syncIssuesList).toBeVisible();
      await utilities.executeStep(syncIssuesPage.failedPlanYearLink, 'click', 'click on failed status plan year link');
      await utilities.assertStep(planAttributesPage.basePlanName, 'text', 'Validated ' + BNCBS756.planName + ' is displayed', BNCBS756.planName);
      await utilities.assertStep(planAttributesPage.basePlanYear, 'text', 'Validated ' + BNCBS756.planYear + ' is displayed', BNCBS756.planYear);
      await utilities.assertStep(planAttributesPage.sbcFromCarrier, 'text', 'Validated ' + BNCBS756.sbcCarrier + ' is displayed', BNCBS756.sbcCarrier);
    }
  });
});
