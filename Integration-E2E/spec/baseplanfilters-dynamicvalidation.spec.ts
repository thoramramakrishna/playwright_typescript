// noinspection DuplicatedCode

import { test, expect, type Page } from 'playwright-test-coverage';
import { BasePlanPage } from '../pages/base-plan.page';
import { HomePage } from '../pages/home-page';
import baseplans from '../fixtures/baseplans.json';
import credentials from '../fixtures/credentials.json';

test.describe('Dynamic Validations Base Plans - Filters', () => {
  const exchange = baseplans[0].exchange;
  const carrier = baseplans[0].carrier;
  const benefitType = baseplans[0].benefitType;

  let homepage: HomePage;
  let basePlansPage: BasePlanPage;
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
      basePlansPage = new BasePlanPage(pageX);
    } else {
      homepage = new HomePage(page);
      basePlansPage = new BasePlanPage(page);
      await homepage.goto();
    }
    await homepage.clickManageAttributesButton();
    await basePlansPage.basePlansListIsVisible();
  });

  test('Validate Baseplan filters functional', async () => {
    await test.step('Dynamic validation of Exchanges ', async () => {
      if (process.env.RUN_TIME == 'stage') { await basePlansPage.validateExchangeDropdownValues(exchange); } else { console.log('Dynamic Validation passed in CI') }
    });
    await test.step('Dynamic validation of Benefit types ', async () => {
      if (process.env.RUN_TIME == 'stage') { await basePlansPage.validateBenefitTypeDropdownValues(); } else { console.log('Dynamic Validation passed in CI') }
    });
  });
});
