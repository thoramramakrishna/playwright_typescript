import { Locator, Page } from '@playwright/test';
import { Utilities } from '../utilities/actions';

export class SyncIssuesPage {
  readonly page: Page;
  readonly syncIssuesList: Locator;
  readonly reRunButton: Locator;
  readonly backButton: Locator;
  readonly sucessMessage: Locator;
  readonly failedPlanYearLink: Locator;
  utilities = new Utilities();

  constructor(page: Page) {
    this.page = page;
    this.syncIssuesList = page.locator('bpl-sync-issues');
    this.reRunButton = page.getByRole('button', { name: 'Rerun' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.sucessMessage = page.locator('trinet-alert');
    this.failedPlanYearLink = page.locator(
      '//span[text()="AETNA PPO"]/../../following-sibling::div//bpl-plan-year-link'
    );
  }

  public async clickReRunSyncIssuesButton(): Promise<any> {
    await this.reRunButton.click();
  }

  public async selectFailedSyncStatusRows(): Promise<any> {
    const gridRowLocator = this.page.locator('.ag-row');
    const gridRowNameFilter = this.page.locator('.ag-cell', { hasText: 'Failed' });
    const planYearLocator = this.page.locator('.ag-selection-checkbox');
    for (let row of await this.syncIssuesList
      .locator(gridRowLocator)
      .filter({ has: gridRowNameFilter })
      .locator(planYearLocator)
      .all()) {
      await this.utilities.executeStep(
        row,
        'click',
        'clicking on the input checkbox on failed sync issues row '
      );
    }
  }
}
