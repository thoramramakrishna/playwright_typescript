import { test, expect, type Page } from 'playwright-test-coverage';
import { HomePage } from '../pages/home-page';
import { BasePlanPage } from '../pages/base-plan.page';
import { PlanAttributesPage } from '../pages/plan-attributes.page';
import basePlans from '../fixtures/publish.json';
import { AttributeMockData } from 'Integration-E2E/mocks/attributeMockData';
import { Utilities } from '../utilities/actions';
import { BNCBS430 } from '../fixtures/plan-headers.json'
import credentials from '../fixtures/credentials.json';


type Attribute = {
  displayName: string;
  dataType: string;
  validValue: string;
  invalidValue: string;
  validationType: string;
  validationRule: string;
};
let homePageMockData: AttributeMockData;

test.describe('Base Plans - Attributes', () => {
  for (const basePlan of basePlans) {
    test.describe(`Plan Type - ${basePlan.benefitType}`, () => {
      let homepage: HomePage;
      let basePlansPage: BasePlanPage;
      let planAttributesPage: PlanAttributesPage;
      let attributes: Attribute[];
      let pageX;
      let utilities: Utilities;

      test.beforeEach(async ({ page }: { page: Page }) => {
        test.setTimeout(120000);
        attributes = (await import(`../assets/${basePlan.benefitType.toLowerCase()}.json`))?.default;
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
        await basePlansPage.selectFilterOptions(basePlan.exchange, basePlan.carrier, basePlan.benefitType);
        await basePlansPage.setPlanNameSearchText(basePlan.planName);
        await basePlansPage.clickSearchFilterButton();
        await basePlansPage.clickFirstPlanYearForPlanName(basePlan.planName);
        await planAttributesPage.loadData();
        await planAttributesPage.planAttributesListIsVisible();
        await planAttributesPage.planAttributesListIsLoaded();
      });


      test(`@BNFT-39613(@BNCBS-430) Validate Plan Name, Plan year and SBC Carrier on attribute screen for  ${basePlan.benefitType}`, async () => {
        await utilities.assertStep(planAttributesPage.basePlanName, 'text', 'Validated ' + basePlan.planName + ' is displayed', BNCBS430.planName+basePlan.planName);
        await utilities.assertStep(planAttributesPage.basePlanYear, 'text', 'Validated ' + BNCBS430.planYear + ' is displayed', BNCBS430.planYear);
        await utilities.assertStep(planAttributesPage.sbcFromCarrier, 'text', 'Validated ' + BNCBS430.sbcCarrier + ' is displayed', BNCBS430.sbcCarrier);
      });
      

      test(`@BNCBS-1312 @BNCBS-310 @BNCBS-311 Attribute List is loaded with expected attributes for ${basePlan.benefitType}`, async () => {
        for (const attribute of attributes) {
          await expect(planAttributesPage.getAttributeRow(attribute.displayName), `Attribute list should contain "${attribute.displayName}"`).toBeVisible();
        }
      });

      test.describe(`Attribute Editing for ${basePlan.benefitType}`, () => {
        test('Clicking "@Edit" on attribute row enables attribute input', async () => {
          for (const attribute of attributes) {
            const attributeRow = planAttributesPage.getAttributeRow(attribute.displayName);
            await planAttributesPage.clickAttributeEditAction(attributeRow);
            await expect(planAttributesPage.getAttributeInput(attributeRow), `Attribute input should be visible - ${attribute.displayName}`).toBeVisible();
            await planAttributesPage.clickAttributeEditAction(attributeRow);
          }
        });

        test(`@BNCBS-927 check attribute soft validations and publish enable/disable on attributes screen for ${basePlan.benefitType}`, async () => {
          for (const attribute of attributes) {
            if (attribute.validationType === 'soft' && (attribute?.displayName === 'HSA' || attribute?.displayName === 'National Network Specifics')) {
              const attributeRow = planAttributesPage.getAttributeRow(attribute.displayName);
              await planAttributesPage.clickAttributeEditAction(attributeRow);
              const attributeInput = planAttributesPage.getAttributeInput(attributeRow);
              await planAttributesPage.fillAttributeInput(attributeInput, attribute.invalidValue);
              await expect(planAttributesPage.getAttributeField(attributeRow)).toHaveCSS('color', 'rgb(244, 123, 39)');
              if (attribute.validationRule) {
                await expect(planAttributesPage.publishAttributesButton).toBeEnabled();
              } else {
                await expect(planAttributesPage.publishAttributesButton).toBeDisabled();
              }
              await planAttributesPage.fillAttributeInput(attributeInput, attribute.validValue);
              //await planAttributesPage.clickStatusAttribute(attributeRow);
              await expect(planAttributesPage.publishAttributesButton).toBeEnabled();
            }
          }
        });

        test(`@BNCBS-927 check attribute soft validations and click on the publish button for ${basePlan.benefitType}`, async () => {
          test.skip(basePlan.benefitType === 'Dental' || basePlan.benefitType === 'Vision', 'Still working on it');
          for (const attribute of attributes) {
            if (attribute.validationType === 'soft' && attribute.displayName === 'Family Deductible') {
              const attributeRow = planAttributesPage.getAttributeRow(attribute.displayName);
              await planAttributesPage.clickAttributeEditAction(attributeRow);
              const attributeInput = planAttributesPage.getAttributeInput(attributeRow);
              await planAttributesPage.fillAttributeInput(attributeInput, attribute.invalidValue);
              await expect(planAttributesPage.getAttributeField(attributeRow)).toHaveCSS('color', 'rgb(244, 123, 39)');
              await planAttributesPage.clickPublishButton();
              await expect(planAttributesPage.attributeValidationWarning).toBeVisible();
              await expect(planAttributesPage.attributeValidationWarning).toContainText('The attribute values entered do not match the expected format. You can continue to publish with these values, or cancel and re-check.');
              await expect(planAttributesPage.publishAllValues).toBeVisible();
              await planAttributesPage.clickCancelButton();
            }
          }
        });

        test(`Clicking "Edit All" enables all attribute inputs for ${basePlan.benefitType}`, async () => {
          await planAttributesPage.clickEditAll();
          for (const attribute of attributes) {
            const attributeRow = planAttributesPage.getAttributeRow(attribute.displayName);
            await expect(
              planAttributesPage.getAttributeInput(attributeRow),
              `Attribute input should be visible - ${attribute.displayName}`
            ).toBeVisible();
          }
        });

        test(`@BNCBS-411 @BNCBS-1263 Attribute Validation - Invalid values disables "Publish" button for ${basePlan.benefitType}`, async () => {
          await planAttributesPage.clickEditAll();
          for (const attribute of attributes) {
            const attributeRow = planAttributesPage.getAttributeRow(attribute.displayName);
            const attributeInput = planAttributesPage.getAttributeInput(attributeRow);
            await planAttributesPage.fillAttributeInput(attributeInput, attribute.invalidValue);
            await expect(attributeInput, `Should mark "${attribute.displayName}" as "invalid" - "${attribute.invalidValue}"`).toHaveClass(/ng-invalid/);
          }
          await expect(planAttributesPage.publishAttributesButton).toBeDisabled();
        });

        test(`@BNCBS-411 Attribute Validation - Valid values enables "Publish" button for ${basePlan.benefitType}`, async () => {
          await planAttributesPage.clickEditAll();
          for (const attribute of attributes) {
            const attributeRow = planAttributesPage.getAttributeRow(attribute.displayName);
            const attributeInput = planAttributesPage.getAttributeInput(attributeRow);
            await planAttributesPage.fillAttributeInput(attributeInput, attribute.validValue);
            await expect(attributeInput, `Should mark "${attribute.displayName}" as "valid" - "${attribute.invalidValue}"`).toHaveClass(/ng-valid/);
          }
          await expect(planAttributesPage.publishAttributesButton).toBeEnabled();
        });
      });

      test.describe(`Plan Year for ${basePlan.benefitType}`, () => {
        test(`Should be in expected format for ${basePlan.benefitType}`, async () => {
          const planYear = await planAttributesPage.getPlanYear();
          expect(planYear.startDate).not.toBeNull();
          expect(planYear.startDate, 'Plan Year Start Date should match MM/DD/YYYY format').toMatch(/\d{2}\/\d{2}\/\d{4}/);
          expect(planYear.endDate).not.toBeNull();
          expect(planYear.endDate, 'Plan Year End Date should match MM/DD/YYYY format').toMatch(/\d{2}\/\d{2}\/\d{4}/);
        });

        test(`Effective Date should default to Plan Year Start Date for ${basePlan.benefitType}`, async () => {
          const planYear = await planAttributesPage.getPlanYear();
          expect(planYear.startDate).not.toBeNull();
          expect(planYear.startDate).not.toBeUndefined();
          await expect(planAttributesPage.effectiveDate).toBeVisible();
          await expect(planAttributesPage.effectiveDate).toHaveValue(<string>planYear?.startDate);
        });
      });
    });
  }
});
