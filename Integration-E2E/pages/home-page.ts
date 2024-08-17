import { test, type Locator, type Page } from '@playwright/test';
import { HomePageMockData } from '../mocks/baseplanMockData';
import { SyncIssuesMockData } from 'Integration-E2E/mocks/syncIssuesMockData';

let homePageMockData: HomePageMockData;
let syncIssues: SyncIssuesMockData;
export class HomePage {
  readonly page: Page;
  readonly managePlanAttributes: Locator;
  readonly viewSyncIssues: Locator;
  readonly tileContent: Locator;
  readonly tileHeader: Locator;
  readonly benefitGateway: Locator;
  readonly policyUpdate: Locator;


  constructor(page: Page) {
    this.page = page;
    homePageMockData = new HomePageMockData(this.page);
    syncIssues = new SyncIssuesMockData(this.page);
    this.managePlanAttributes = page.getByRole('link', { name: 'Manage Plan Attributes' });
    this.viewSyncIssues = page.getByRole('link', { name: /BCR Sync Status.*/i });
    this.tileContent = page.locator('//mat-card[@class="mat-card mat-focus-indicator"]//trinet-card-content[contains(.,"Check Benefits Plan Central Repository Tool sync status.")]');
    this.tileHeader = page.locator('//h3[contains(.,"BCR Sync Status")]');
    this.benefitGateway = page.locator('//a[text()="Benefits Gateway"]');
    this.policyUpdate = page.locator('//span[@aria-label="close-policy-update"]');
  }

  public async clickManageAttributesButton(): Promise<any> {
    await this.page.waitForLoadState();
    await console.log('++++++++++++++++++++++');
    await this.managePlanAttributes.click();
    await this.page.waitForLoadState();

    if (process.env.RUN_TIME == 'stage') {
      await console.log('---------stage-----------------');
      await this.page.waitForTimeout(5000);
    } else {
      await homePageMockData.getBasePlansAndFilters();
    }
  }

  public async clickViewSyncIssuesButton(): Promise<any> {
    await this.viewSyncIssues.click();
    await syncIssues.getSyncIssues();
    await syncIssues.reRunSyncIssues();
    await syncIssues.getAttributeFromSync();
    await this.page.waitForTimeout(1000);
  }

  public async goto(): Promise<any> {
    await this.page.goto('/');
    await this.managePlanAttributes.isVisible();
  }
  async loginNavigateToBPL(username: string, password: string) {
    test.setTimeout(100000);
    await this.page.goto('/');
    await this.page.getByLabel('Please enter your Login ID').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
    await this.page.waitForTimeout(10000);
    await this.policyUpdate.click();
    const page1Promise = this.page.waitForEvent('popup');
    await this.page.getByRole('link', { name: 'ꅦ TriNet Admin Apps will open in a new window' }).click();
    const page1 = await page1Promise;
    await page1.waitForLoadState();
    await page1.goto('/ui-superadmin/#/dashboard');
    await page1.waitForLoadState();
    const page2Promise = page1.waitForEvent('popup');
    await page1.locator('#Benefits').getByRole('link', { name: 'Benefits Gateway' }).click();
    const page2 = await page2Promise;
    const [newTab] = await Promise.all([
      page2.waitForEvent('popup'),
      await page2.locator('//div[text()="Plan Library Gateway "]/../div/following-sibling::div/a').click()
    ]);
    return newTab;
  }
}