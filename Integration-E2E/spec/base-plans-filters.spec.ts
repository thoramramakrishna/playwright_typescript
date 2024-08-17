// noinspection DuplicatedCode

import { test, expect, type Page } from 'playwright-test-coverage';
import { BasePlanPage } from '../pages/base-plan.page';
import { HomePage } from '../pages/home-page';
import baseplans from '../fixtures/baseplans-filters.json';
import credentials from '../fixtures/credentials.json';

test.describe('@BNCBS-425 @BNCBS-232 Base Plans - Filters', () => {
 

  let homepage: HomePage;
  let basePlansPage: BasePlanPage;
  let pageX;
  test.beforeEach(async ({ page }: { page: Page }) => {
    test.setTimeout(60000)
    if (process.env.RUN_TIME == 'stage') {
      homepage = new HomePage(page);
      console.log('i am in stage>>>' + process.env.RUN_TIME);
      pageX = await test.step("Login", async () => {
        return await homepage.loginNavigateToBPL(credentials.username, credentials.password)
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


  for (const plan of baseplans) {

    const exchange = plan.exchange;
    const carrier = plan.carrier;
    const benefitType = plan.benefitType;
  test(`Validate Baseplan filters functional for ${plan.benefitType}`, async () => {

    await test.step('No filters selected should have disabled button', async () => {
      await expect(basePlansPage.selectFiltersButton).toBeDisabled();
    });

    await test.step('Selecting only Exchange should have disabled button', async () => {
      await basePlansPage.selectExchange(exchange);
      await expect(basePlansPage.exchangeFilter).toContainText(exchange);
      await expect(basePlansPage.selectFiltersButton).toBeDisabled();
    });

   
    await test.step('Selecting only Exchange and benefit-type should have disabled button', async () => {
      await basePlansPage.selectExchange(exchange);
      await basePlansPage.selectBenefitType(benefitType);
      await expect(basePlansPage.exchangeFilter).toContainText(exchange);
      await expect(basePlansPage.benefitTypeFilter).toHaveText(benefitType);
      await expect(basePlansPage.selectFiltersButton).toBeDisabled();
    });

    await test.step('Selecting all filters enables button', async () => {
      await basePlansPage.selectFilterOptions(exchange, carrier, benefitType);
      await expect(basePlansPage.exchangeFilter).toContainText(exchange);
      await expect(basePlansPage.carrierFilter).toHaveText(carrier);
      await expect(basePlansPage.benefitTypeFilter).toHaveText(benefitType);
      await expect(basePlansPage.selectFiltersButton).toBeEnabled();
    });

    await test.step('Should be able to filter base plans by name', async () => {
      const basePlanNameFilter = plan.basePlanNameFilter;
      await basePlansPage.selectFilterOptions(exchange, carrier, benefitType);
      await expect(basePlansPage.exchangeFilter).toContainText(exchange);
      await expect(basePlansPage.carrierFilter).toHaveText(carrier);
      await expect(basePlansPage.benefitTypeFilter).toHaveText(benefitType);
      await expect(basePlansPage.selectFiltersButton).toBeEnabled();
      await basePlansPage.clickSearchFilterButton();
      await basePlansPage.setPlanNameSearchText(basePlanNameFilter);
      // await expect(basePlansPage.basePlanGridPagination).not.toContainText('of 0');
      // await expect(basePlansPage.basePlanGridPagination).toContainText('of 1');
    });
  });
}
});
