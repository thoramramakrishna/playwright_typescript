import { test, expect, type Page } from 'playwright-test-coverage';
import { BasePlanPage } from '../pages/base-plan.page';
import { RegionalPlanMappingPage } from '../pages/regional-plan.page';
import { PlanAttributesPage } from '../pages/plan-attributes.page';
import { HomePage } from '../pages/home-page';
import { Utilities } from '../utilities/actions';
import regionalPlans from '../fixtures/regionalmapping.json'
import credentials from '../fixtures/credentials.json';

test.describe('Regional Plans mapping to Baseplan', () => {
  let homepage: HomePage;
  let basePlansPage: BasePlanPage;
  let planAttributesPage: PlanAttributesPage;
  let regionalPlanMappingPage: RegionalPlanMappingPage;
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
      regionalPlanMappingPage = new RegionalPlanMappingPage(pageX);
      planAttributesPage = new PlanAttributesPage(pageX);
      utilities = new Utilities();
    } else {
      homepage = new HomePage(page);
      basePlansPage = new BasePlanPage(page);
      regionalPlanMappingPage = new RegionalPlanMappingPage(page);
      planAttributesPage = new PlanAttributesPage(page);
      utilities = new Utilities();
      await homepage.goto();
    }
    await homepage.clickManageAttributesButton();
  });
  for (const BNCBS459 of regionalPlans) {
    test(`@BNFT-39065(@BNCBS-459) Validate Regional Plan Mapping to baseplans for ${BNCBS459.benefitType}`, async () => {
      test.setTimeout(100000);
      await basePlansPage.selectFilterOptions(BNCBS459.exchange, BNCBS459.carrier, BNCBS459.benefitType);
      await basePlansPage.clickSearchFilterButton();
      await basePlansPage.setPlanNameSearchText(BNCBS459.basePlanNameFilter);
      await basePlansPage.clickSearchFilterButton();
      await basePlansPage.clickFirstPlanYearForPlanName(BNCBS459.planName);
      await planAttributesPage.loadData();
      await utilities.assertStep(regionalPlanMappingPage.textToVerify, 'text', 'Validated ' + BNCBS459.question + ' is displayed', BNCBS459.question)
      await utilities.assertStep(regionalPlanMappingPage.buttonYes, 'visible', 'Validate Yes button is displayed');
      await test.step('Validate Effective date calendar picker dates are restricted between plan year start and end date', async () => {
        await planAttributesPage.handleDatePickerForEffectiveDateRestriction();
      });
      await regionalPlanMappingPage.selecYesButton();
      await utilities.assertStep(regionalPlanMappingPage.exchange, 'visible', 'Validate exchange Trinet III is displayed');
      await utilities.assertStep(regionalPlanMappingPage.planName, 'text', 'Validated Regional Plan name ' + BNCBS459.planName + ' is displayed in split screen', BNCBS459.planName);
      await utilities.assertStep(regionalPlanMappingPage.planID, 'text', 'Validated Regional Plan id ' + BNCBS459.planID + ' is displayed in split screen', BNCBS459.planID);
      await utilities.assertStep(regionalPlanMappingPage.quarter, 'text', 'Validated Regional Quarter ' + BNCBS459.quarter + ' is displayed in split screen', BNCBS459.quarter);
      await utilities.assertStep(regionalPlanMappingPage.filter, 'visible', 'Validated filter is displayed on Quarter');
      await regionalPlanMappingPage.selectQuarterFilter();
      await regionalPlanMappingPage.searchQuarter(BNCBS459.Q1)
      await utilities.assertStep(regionalPlanMappingPage.quarterValue, 'text', 'Validate Quarter ' + BNCBS459.Q1 + ' is Displayed', BNCBS459.Q1);
      await regionalPlanMappingPage.searchQuarter(BNCBS459.Q4)
      await utilities.assertStep(regionalPlanMappingPage.quarterValue, 'text', 'Validate Quarter ' + BNCBS459.Q4 + ' is Displayed', BNCBS459.Q4);
      await regionalPlanMappingPage.closeSplitScreen();
    });
  }
});