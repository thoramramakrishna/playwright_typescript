import { LocatorScreenshotOptions, test, type Locator, type Page } from '@playwright/test';
import { Utilities } from '../utilities/actions'
export class RegionalPlanMappingPage {
  readonly page: Page;
  readonly textToVerify: Locator;
  readonly buttonYes: Locator;
  readonly exchange: Locator;
  readonly planName: Locator;
  readonly planID: Locator;
  readonly quarter: Locator;
  readonly filter: Locator;
  readonly quarterSearchInput: Locator;
  readonly quarterValue: Locator;
  readonly closeIcon: Locator;

  //creating object to use utility class functions
  utilities = new Utilities();

  constructor(page: Page) {
    this.page = page;
    this.textToVerify = page.locator('bpl-plan-attributes > trinet-card > mat-card > h4');
    this.buttonYes = page.locator('div.title-and-icon-container > span');
    this.exchange = page.locator('//div[@class="base-plan-info"][contains(.,"TRINET III ")]');
    this.planName = page.locator('//div[@row-index="0"]//span');
    this.planID = page.locator('//div[@row-index="0"]//div[@col-id="planId"]');
    this.quarter = page.locator('//div[@row-index="0"]//div[@col-id="quarter"]');
    this.filter = page.locator('//span[@ref="eMenu"]//span[@class="ag-icon ag-icon-filter"]');
    this.quarterSearchInput = page.getByPlaceholder('Search...');
    this.quarterValue = page.locator('//div[@aria-posinset="2"]//div[@ref="eLabel"]');
    this.closeIcon = page.locator('//trinet-icon[contains(@class,"icon-close-temp")]');
  }

  async selecYesButton() {
    await this.utilities.executeStep(this.buttonYes, 'click', 'clicking on Yes button');
    await this.page.waitForLoadState();
    await this.page.waitForTimeout(3000);
  }

  async selectQuarterFilter() {
    await this.utilities.executeStep(this.filter, 'click', 'clicking on filter icon');
  }

  async searchQuarter(quarter: string) {
    await this.utilities.executeStep(this.quarterSearchInput, 'clear', 'clearing search field to enter');
    await this.utilities.executeStep(this.quarterSearchInput, 'type', 'search for quarter ' + quarter + '', quarter);
  }

  async closeSplitScreen() {
    await this.utilities.executeStep(this.closeIcon, 'click', 'clicking on close icon of split screen');
  }
}