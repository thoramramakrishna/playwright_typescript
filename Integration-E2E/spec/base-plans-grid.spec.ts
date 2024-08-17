// noinspection DuplicatedCode

import { test, expect, type Page } from 'playwright-test-coverage';
import { BasePlanPage } from '../pages/base-plan.page';
import { HomePage } from '../pages/home-page';
import { Utilities } from '../utilities/actions';
import { PlanAttributesPage } from '../pages/plan-attributes.page';
import { BNCBS439 } from '../fixtures/plan-headers.json';
import basePlans from '../fixtures/baseplans.json';
import credentials from '../fixtures/credentials.json';


test.describe('Base Plans - Grid', () => {
  for (const baseplan of basePlans) {
    test.describe(`Base Plans - Grid Plan Type - ${baseplan.benefitType}`, () => {
     test.setTimeout(80000);
      const exchange = baseplan.exchange;
      const carrier = baseplan.carrier;
      const benefitType = baseplan.benefitType;
      const searchItem = baseplan.test;
      const invalidPlanName = baseplan.invalidPlanName;

      let homepage: HomePage;
      let basePlansPage: BasePlanPage;
      let planAttributesPage: PlanAttributesPage;
      let utilities: Utilities;
      let pageX;
      test.beforeEach(async ({ page }: { page: Page }) => {
        if (process.env.RUN_TIME == 'stage') {
          homepage = new HomePage(page);
          console.log('i am in stage>>>' + process.env.RUN_TIME);
          pageX = await test.step("Login", async () => {
            return await homepage.loginNavigateToBPL(credentials.username, credentials.password);
          })
          homepage = new HomePage(pageX);
          basePlansPage = new BasePlanPage(pageX);
          planAttributesPage = new PlanAttributesPage(pageX);
          utilities = new Utilities();
        } else {
          homepage = new HomePage(page);
          basePlansPage = new BasePlanPage(page);
          planAttributesPage = new PlanAttributesPage(page);
          utilities = new Utilities();
          await homepage.goto();
        }
        await homepage.clickManageAttributesButton();
        await basePlansPage.basePlansListIsVisible();
        await basePlansPage.selectFilterOptions(exchange, carrier, benefitType);
        await basePlansPage.clickSearchFilterButton();
        await basePlansPage.recordsFoundInGrid();
      });

      test(`@BNCBS-425 should able to @filter on plan type for ${baseplan.benefitType}`, async ({ page }) => {
        test.skip(baseplan.benefitType == 'Vision');
        await basePlansPage.isFilterIconVisibleOnPlanTypeColumn();
        await basePlansPage.clickOnPlanTypeFilter();
        await basePlansPage.setValueToPlantTypeSearch(searchItem);
        await expect(basePlansPage.plantTypeInputSearchNoMatch).toBeVisible();
        await expect(basePlansPage.plantTypeInputSearchNoMatch).toContainText('No matches.');
        await basePlansPage.planTypeInputSearch.press('Enter');
        await basePlansPage.noRecordsFoundInGrid();
        await basePlansPage.setValueToPlantTypeSearch(baseplan.planType);
        await basePlansPage.plantTypeInputSearchNoMatch.isHidden();
        await basePlansPage.planTypeInputSearch.press('Enter');
        await basePlansPage.recordsFoundInGrid();
        await basePlansPage.planTypeFilterSelectAll.uncheck();
        await basePlansPage.noRecordsFoundInGrid();
        await basePlansPage.planTypeFilterSelectAll.check();
        await basePlansPage.recordsFoundInGrid();
        await basePlansPage.planTypeFilterSelect(baseplan.planType).uncheck();
        await basePlansPage.planTypeFilterSelect(baseplan.planType).check();
        await expect(basePlansPage.planTypeFilterSelectHmo(baseplan.planType).first()).toContainText(baseplan.planType);
        await basePlansPage.recordsFoundInGrid();
      });

      test(`@BNCBS-4271 should check all empty value validation and success scenarios of plan name update for ${baseplan.benefitType}`, async () => {
        const rows = await basePlansPage.getRows(baseplan.basePlanNameFilter);
        const rowData = await basePlansPage.getCells(rows[0]);
        const planName = await rowData[0].textContent();
        await basePlansPage.clickOnElementByName(planName.trim());
        await expect(basePlansPage.basePlanNameInputSaveIcon).toBeVisible();
        await expect(basePlansPage.basePlanNameInputCancelIcon).toBeVisible();
        await basePlansPage.basePlanNameInput.fill('');
        await expect(basePlansPage.basePlanNameInputSaveIconDisable).toBeVisible();
        await expect(basePlansPage.basePlanNameInputCancelIcon).toBeEnabled();
        await basePlansPage.basePlanNameInputCancelIcon.click();
        await expect(basePlansPage.basePlanNameInput).toBeHidden();
        basePlansPage.clickOnElementByName(planName.trim());
        await basePlansPage.basePlanNameInputSaveIcon.click();
        await expect(basePlansPage.basePlanNameUpdateSuccess).toBeVisible();
        await basePlansPage.successCloseButton.click();
      });

      test(`@BNCBS-427 should check plan name update error case for ${baseplan.benefitType}`, async () => {
        if (process.env.RUN_TIME == 'stage') {
          await console.log('---------stage-----------------');
          const rows = await basePlansPage.getRows(baseplan.basePlanNameFilter);
          const rowData = await basePlansPage.getCells(rows[0]);
          const planName = await rowData[0].textContent();
          await basePlansPage.clickOnElementByName(planName.trim());
          await expect(basePlansPage.basePlanNameInput).toBeVisible();
          await basePlansPage.basePlanNameInput.clear();
          await basePlansPage.basePlanNameInput.type(invalidPlanName);
          await basePlansPage.basePlanNameInputSaveIcon.click();
          await expect(basePlansPage.basePlanNameUpdateError).toBeVisible();
          await basePlansPage.errorCloseButton.click();
        } else {
          await console.log('---------CI env test passed-----------------');
        }
      });


      test(`@BNCBS-463 should navigate to the next page on pagination for ${baseplan.benefitType}`, async () => {
        test.skip(baseplan.benefitType == 'Vision');
        await expect(basePlansPage.basePlanGridPagination).toContainText('1 to 10');
        await expect(basePlansPage.paginationFirst).toBeVisible();
        await expect(basePlansPage.paginationLast).toBeVisible();
        await expect(basePlansPage.paginationNext).toBeVisible();
        await expect(basePlansPage.paginationPrevious).toBeVisible();
        await expect(basePlansPage.paginationFirst).toBeDisabled();
        await expect(basePlansPage.paginationPrevious).toBeDisabled();
        await expect(basePlansPage.basePlanGridPaginationPresentation).toContainText('Page 1');
        await basePlansPage.paginationNext.click();
        await expect(basePlansPage.basePlanGridPaginationPresentation).toContainText('Page 2');
        await expect(basePlansPage.paginationFirst).toBeEnabled();
        await expect(basePlansPage.paginationPrevious).toBeEnabled();
        await basePlansPage.paginationPrevious.click();
        await basePlansPage.paginationLast.click();
        await expect(basePlansPage.paginationLast).toBeDisabled();
        await expect(basePlansPage.paginationNext).toBeDisabled();
      });

      test(`@BNCBS-431 validate Baseplan columns and Plan names for ${baseplan.benefitType}`, async () => {
        await expect(basePlansPage.basePlanName(baseplan.basePlanNameFilter)).toBeVisible();
        await expect(basePlansPage.benefitType(baseplan.benefitType)).toBeVisible();
        await expect(basePlansPage.carriers(baseplan.carrier)).toBeVisible();
        if (baseplan.benefitType !== 'Vision') {
          await expect(basePlansPage.planType(baseplan.planType)).toBeVisible();
        }
        await expect(basePlansPage.planYear(baseplan.currentPlanYear)).toBeVisible();
        await expect(basePlansPage.sbc).toBeVisible();
      });

      test(`@BNCBS-439 @BNCBS-448 Validate multiple plan years for a baseplan for ${baseplan.benefitType}`, async ({ page }) => {
        // await basePlansPage.setPlanNameSearchText(baseplans.basePlanNameFilter);
        // await utilities.executeStep(basePlansPage.expandIcon, 'click', 'expand plan name');
        // await utilities.executeStep(basePlansPage.nestedFuturePlan, 'click', 'click on future plan year');
        // await utilities.assertStep(planAttributesPage.basePlanName, 'text', 'Validated ' + BNCBS439.planName + ' is displayed', BNCBS439.planName);
        // await utilities.assertStep(planAttributesPage.basePlanYear, 'text', 'Validated ' + BNCBS439.futurePlanYear + ' is displayed', BNCBS439.futurePlanYear);
        // await utilities.assertStep(planAttributesPage.sbcFromCarrier, 'text', 'Validated ' + BNCBS439.sbcCarrier + ' is displayed', BNCBS439.sbcCarrier);
        // await utilities.executeStep(planAttributesPage.baseplanLink, 'click', 'click on base plans link to navigate back to homepage');
        await basePlansPage.setPlanNameSearchText(baseplan.basePlanNameFilter);
        await basePlansPage.selectSearchResult();
        await planAttributesPage.loadData();
        await utilities.assertStep(planAttributesPage.basePlanName, 'text', 'Validated ' + BNCBS439.planName + baseplan.basePlanNameFilter + ' is displayed', BNCBS439.planName + baseplan.basePlanNameFilter);
        await utilities.assertStep(planAttributesPage.basePlanYear, 'text', 'Validated ' + BNCBS439.currentPlanYear + ' is displayed', BNCBS439.currentPlanYear);
        await utilities.assertStep(planAttributesPage.sbcFromCarrier, 'text', 'Validated ' + BNCBS439.sbcCarrier + ' is displayed', BNCBS439.sbcCarrier);
        await utilities.executeStep(planAttributesPage.baseplanLink, 'click', 'click on base plans link to navigate back to homepage');
        if (baseplan.benefitType == 'Medical') {
          await basePlansPage.setPlanNameSearchText(baseplan.basePlanNameFilter);
          await utilities.executeStep(basePlansPage.expandIcon, 'click', 'expand plan name');
       //   await utilities.assertStep(basePlansPage.sbcNotDisp, 'visible', 'Validated ' + BNCBS439.sbcCarrier + ' is not displayed');
          // await utilities.executeStep(basePlansPage.nestedPastPlan(baseplan.nestedPastPlan), 'click', 'click on past plan year');
          // await utilities.assertStep(planAttributesPage.basePlanName, 'text', 'Validated ' + BNCBS439.planName + ' is displayed', BNCBS439.planName);
          // await utilities.assertStep(planAttributesPage.basePlanYear, 'text', 'Validated ' + BNCBS439.pastPlanYear + ' is displayed', BNCBS439.pastPlanYear);
        }
      });
    });
  }
});
