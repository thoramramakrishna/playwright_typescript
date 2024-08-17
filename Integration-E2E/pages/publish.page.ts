import { LocatorScreenshotOptions, test, type Locator, type Page } from '@playwright/test';
import { Utilities } from '../utilities/actions';
import { PublishPageMockData } from 'Integration-E2E/mocks/publishMockData';
let publishMockData: PublishPageMockData;
export class PublishPage {
  readonly page: Page;
  readonly quartersFilter: Locator;
  readonly uncheckSelectAll: Locator;
  readonly Q1: Locator;
  readonly Q4: Locator;
  readonly effectiveDateField: Locator;
  readonly publishButton: Locator;
  readonly successMsg: Locator;
  readonly confirm: Locator;
  readonly maskwrapper: Locator;

  //creating object to use utility class functions
  utilities = new Utilities();

  constructor(page: Page) {
    this.page = page;
    publishMockData = new PublishPageMockData(this.page);
    this.quartersFilter = page.locator('//span[text()="Q1, Q2, Q3, Q4, Q5"]');
    this.uncheckSelectAll = page.locator('//span[contains(.,"Select All")]');
    this.Q1 = page.locator('//span[contains(.," Q1 ")]');
    this.Q4 = page.locator('//span[contains(.," Q4 ")]');
    this.effectiveDateField = page.locator('//input[@class="mat-input-element mat-form-field-autofill-control mat-datepicker-input ng-pristine ng-valid cdk-text-field-autofill-monitored ng-touched"]');
    this.publishButton = page.locator('//trinet-dialog-actions/div/button[contains(.,"Publish")]');
    this.maskwrapper = page.locator('//*[@id="mat-hint-124"]')
    this.successMsg = page.locator('//div[contains(text(),"Success!")]');
    this.confirm = page.locator('//div[@class="right"]//button[@class="mat-focus-indicator mat-button-base mat-flat-button mat-primary"]')
  }

  async selectQuartersDropdown() {
    await this.utilities.executeStep(this.quartersFilter, 'click', 'clicking on quarters filter dropdown');
  }
  async selectUnSelectAll() {
    await this.utilities.executeStep(this.uncheckSelectAll, 'click', 'clicking on unselect all');
  }

  async filterQuarters(quarterName: Locator, quarter: string) {
    await this.utilities.executeStep(quarterName, 'click', 'check or select quarter' + quarter);
  }

  async enterEffectiveDate(effectiveDate: string) {
    await this.page.getByRole('combobox', { name: 'select' }).press('Tab');
    await this.page.getByRole('textbox', { name: 'Effective Date' }).click();
    await this.page.getByRole('textbox', { name: 'Effective Date' }).fill(effectiveDate);
  }

  async clickPublishOnPopup() {
    await this.utilities.executeStep(this.publishButton, 'click', 'click on publish to apply the changes');
  }

  async clickConfirm() {
    await this.utilities.executeStep(this.confirm, 'click', 'click on confirm to apply the changes');
    if (process.env.RUN_TIME == 'stage') {
      await console.log('---------stage-----------------');
    } else {
      await publishMockData.publishPostMessage();
    }

  }
}