import { test, expect, type Page } from 'playwright-test-coverage';
import { BasePlanPage } from '../pages/base-plan.page';
import { PublishPage } from '../pages/publish.page';
import { HomePage } from '../pages/home-page';
import { Utilities } from '../utilities/actions';
import basePlans from '../fixtures/publish.json';
import { PlanAttributesPage } from '../pages/plan-attributes.page';
import credentials from '../fixtures/credentials.json';

test.describe('Pre and Post Validations of Publishing the effective changes to attributes', () => {
  let homepage: HomePage;
  let basePlansPage: BasePlanPage;
  let publishPage: PublishPage;
  let utilities: Utilities;
  let planAttributesPage: PlanAttributesPage;
  let pageX;

  test.beforeEach(async ({ page }: { page: Page }) => {
    test.setTimeout(80000);
    if (process.env.RUN_TIME == 'stage') {
      homepage = new HomePage(page);
      console.log('i am in stage>>>' + process.env.RUN_TIME);
      pageX = await test.step("Login", async () => {
        return await homepage.loginNavigateToBPL(credentials.username, credentials.password);
      })
      homepage = new HomePage(pageX);
      basePlansPage = new BasePlanPage(pageX);
      publishPage = new PublishPage(pageX);
      planAttributesPage = new PlanAttributesPage(pageX);
      utilities = new Utilities();
    } else {
      homepage = new HomePage(page);
      basePlansPage = new BasePlanPage(page);
      publishPage = new PublishPage(page);
      planAttributesPage = new PlanAttributesPage(page);
      utilities = new Utilities();
      await homepage.goto();
    }
    await homepage.clickManageAttributesButton();
  });



  for (const plan of basePlans) {
    test(`@BNCBS-1238 @BNCBS-1239 @BNCBS-436 @BNCBS-428 Validations around publishing the attributes with ${plan.benefitType}`, async ({ page }) => {
      test.setTimeout(80000);
      await basePlansPage.selectFilterOptions(plan.exchange, plan.carrier, plan.benefitType);
      await basePlansPage.clickSearchFilterButton();
      await basePlansPage.setPlanNameSearchText(plan.planName);
      await basePlansPage.clickSearchFilterButton();
      await basePlansPage.clickFirstPlanYearForPlanName(plan.planName);
      await planAttributesPage.loadData();
      await planAttributesPage.planAttributesListIsVisible();
      await planAttributesPage.updateAttibuteSingleDeductable(plan.twoThousand, 'Valid', plan.fieldName, plan.benefitType);
      await utilities.assertStep(publishPage.quartersFilter, 'visible', 'Quarters multiselect dropdown displayed on Publish values popup')
      await publishPage.selectQuartersDropdown();
      await publishPage.selectUnSelectAll();
      await publishPage.filterQuarters(publishPage.Q1, plan.Q1);
      await publishPage.filterQuarters(publishPage.Q4, plan.Q4);
      await publishPage.enterEffectiveDate(plan.effectiveDate);
      await publishPage.clickPublishOnPopup();
      await publishPage.clickConfirm();
      await utilities.assertStep(publishPage.successMsg, 'visible', 'Success confirmation displayed after publish');
      // await basePlansPage.setPlanNameSearchText(plan.planName);
      // await basePlansPage.clickSearchFilterButton();
      // await basePlansPage.clickFirstPlanYearForPlanName(plan.planName);
      // await planAttributesPage.validateStatus(plan.effectiveDate);
      // await utilities.assertStep(planAttributesPage.valueOfSD(plan.fieldName), 'text', '$1,000 is displayed for single deductible', plan.Thousand);
      // await planAttributesPage.handleDatePicker();
      // await utilities.assertStep(planAttributesPage.valueOfSD(plan.fieldName), 'text', '$2,000 is displayed for single deductible', plan.twoThousand);
    });
  }
});