import { test, type Locator, type Page, expect } from '@playwright/test';
import { HomePageMockData } from '../mocks/baseplanMockData';
import credentials from '../fixtures/credentials.json';


let homePageMockData: HomePageMockData;
export class BasePlanPage {
  readonly page: Page;
  readonly basePlansList: Locator;
  readonly exchangeFilter: Locator;
  readonly carrierFilter: Locator;
  readonly benefitTypeFilter: Locator;
  readonly selectFiltersButton: Locator;
  readonly planNameSearchInput: Locator;
  readonly basePlanGridPagination: Locator;
  private readonly basePlanGrid: Locator;
  private readonly cdkPanelOverlay: Locator;
  readonly gridRowExpandClosedIcon: Locator;
  readonly gridRowExpandOpenedIcon: Locator;
  readonly gridPlanTypeFilter: Locator;
  readonly sbcLinkInGrid: Locator;
  readonly gridPlanTypeFilterSearch: Locator;
  readonly planTypeInputSearch: Locator;
  readonly plantTypeInputSearchNoMatch: Locator;
  readonly planTypeFilterSelectAll: Locator;
  readonly planTypeFilterSelect;
  readonly planTypeFilterSelectHmo;
  readonly basePlanNameInput: Locator;
  readonly basePlanNameInputErrorIcon: Locator;
  readonly basePlanNameInputSaveIcon: Locator;
  readonly basePlanNameInputCancelIcon: Locator;
  readonly basePlanNameInputSaveIconDisable: Locator;
  readonly basePlanNameUpdateError: Locator;
  readonly basePlanNameUpdateSuccess: Locator;
  readonly successCloseButton: Locator;
  readonly errorCloseButton: Locator;
  readonly paginationFirst: Locator;
  readonly paginationPrevious: Locator;
  readonly paginationNext: Locator;
  readonly paginationLast: Locator;
  readonly basePlanGridPaginationPresentation: Locator;
  readonly searchResultBasePlan: Locator;
  readonly basePlanName;
  readonly benefitType;
  readonly carriers;
  readonly planType;
  readonly planYear;
  readonly sbc: Locator;
  readonly expandIcon: Locator;
  readonly nestedFuturePlan;
  readonly nestedPastPlan;
  readonly sbcNotDisp: Locator;
  readonly benefitTypes;
  readonly exchanges;

  constructor(page: Page) {
    this.page = page;
    homePageMockData = new HomePageMockData(this.page);


    this.basePlanName = (basePlanNameFilter: string) => page.locator(`//div[@class="ag-center-cols-clipper"]//div[@row-id="0"]//div[@col-id="basePlanName"]//span[text()="${basePlanNameFilter}"]`);
    this.benefitType = (benefitType: string) => page.locator(`//div[@class="ag-center-cols-clipper"]//div[@row-id="0"]//div[@col-id="benefitType"]//span[text()="${benefitType}"]`);
    this.carriers = (carrier: string) => page.locator(`//div[@class="ag-center-cols-clipper"]//div[@row-id="0"]//div[@col-id="carrier"]//span[text()="${carrier}"]`);
    this.planType = (planType: string) => page.locator(`//div[@class="ag-center-cols-clipper"]//div[@row-id="0"]//div[@col-id="planType"]//span[text()="${planType}"]`);
    this.planYear = (currentPlanYear: string) => page.locator(`//div[@class="ag-center-cols-clipper"]//div[@row-id="0"]//div[@col-id="currentPlanYear"]//span//bpl-plan-year[contains(.,"${currentPlanYear}")]`);
    this.sbc = this.page.locator('//div[@class="ag-center-cols-clipper"]//div[@row-id="0"]//div[@col-id="currentPlanYear_1"]//span//bpl-document-link//a');
    this.basePlansList = this.page.locator('bpl-base-plans');
    this.exchangeFilter = page.locator('trinet-select[name="exchange"]');
    this.carrierFilter = page.locator('trinet-select[name="carrier"]');
    this.benefitTypeFilter = page.locator('trinet-select[name="benefitType"]');
    this.selectFiltersButton = page.getByRole('button', { name: 'Select' });
    this.planNameSearchInput = page.getByPlaceholder('Search by plan name');
    this.cdkPanelOverlay = page.locator('.cdk-overlay-container').getByRole('listbox');
    this.basePlanGrid = page.locator('bpl-base-plans-list trinet-grid');
    this.basePlanGridPagination = this.basePlanGrid.locator('.ag-paging-row-summary-panel[role="status"]');
    this.basePlanGridPaginationPresentation = this.basePlanGrid.locator('.ag-paging-page-summary-panel[role="presentation"]');
    this.gridRowExpandClosedIcon = page.locator('//span[@class="ag-group-contracted"]//span[@role="presentation"]');
    this.gridRowExpandOpenedIcon = page.locator('//span[@class="ag-group-expanded"]//span[@role="presentation"]');
    this.gridPlanTypeFilter = page.locator('.ag-cell-label-container > span > .ag-icon');
    this.planTypeInputSearch = page.getByPlaceholder('Search...');
    this.plantTypeInputSearchNoMatch = page.locator('.ag-filter-no-matches');
    this.planTypeFilterSelectAll = page.getByLabel('(Select All)');
    this.planTypeFilterSelect = (planType: string) => page.getByLabel(planType);
    this.planTypeFilterSelectHmo = (planType: string) => page.locator(`//span[normalize-space()="${planType}"]`);
    this.sbcLinkInGrid = page.getByRole('link', { name: 'Carrier SBC' });
    this.gridPlanTypeFilterSearch = page.getByPlaceholder('Search...');
    this.basePlanNameInput = page.locator('//input[@id="mat-input-1"]');
    this.basePlanNameInputErrorIcon = page.locator('.mat-icon.notranslate.mat-error.material-icons.mat-ligature-font.mat-icon-no-color.ng-tns-c109-14.ng-star-inserted');
    this.basePlanNameInputSaveIconDisable = page.getByText('checkclose');
    this.basePlanNameInputSaveIcon = page.getByText('check');
    this.basePlanNameInputCancelIcon = page.getByText('close');
    this.basePlanNameUpdateError = page.getByText('The plan name could not be saved. Please refresh and try again.');
    this.basePlanNameUpdateSuccess = page.getByText('Your plan name was successfully updated.');
    this.successCloseButton = page.getByRole('button', { name: 'success alert close button' });
    this.errorCloseButton = page.getByRole('button', { name: 'error alert close button' });
    this.paginationFirst = page.getByLabel('First Page');
    this.paginationPrevious = page.getByLabel('Previous Page');
    this.paginationNext = page.getByLabel('Next Page');
    this.paginationLast = page.getByLabel('Last Page');
    this.searchResultBasePlan = page.locator('//span/bpl-plan-year/a').first();
    this.expandIcon = page.locator('//div[@row-id="0"]//span[@class="ag-icon ag-icon-tree-closed"]');
    this.nestedPastPlan = (nestedPastPlan: string) => page.locator(`//div[contains(@class, "ag-row-odd ag-row ag-row-level-1 ag-full-width-row white-par ag-row-position-absolute")]//a[text()="${nestedPastPlan} "]`);
    this.nestedFuturePlan = (nestedFuturePlan: string) => page.locator(`//div[contains(@class, "ag-row-odd ag-row ag-row-level-1 ag-full-width-row white-par ag-row-position-absolute")]//a[text()="' + ${nestedFuturePlan} + '"]`);

    this.sbcNotDisp = page.locator('//div[@class="ag-row-odd ag-row-no-focus ag-row ag-row-level-1 ag-full-width-row white-par ag-row-position-absolute ag-row-last"]//bpl-document-link/span[contains(text(),"Carrier SBC not available")]');
    this.benefitTypes = (id: string) => page.locator(`//trinet-option//span[contains(text(),"${id}")]`);
    this.exchanges = (id: string) => page.locator(`//trinet-option//span[text()=' ${id} ']`);
    //trinet-option//span[normalize-space(text()="TriNet I")]
  }

  public async basePlansListIsVisible(): Promise<any> {
    await expect(this.basePlanGridPagination).toBeVisible();
  }

  public async selectFilterOptions(exchange: string, carrier: string, benefitType: string): Promise<any> {
    await this.selectExchange(exchange);
    await this.selectBenefitType(benefitType);
    await this.selectCarrier(carrier);
  }

  public async selectExchange(value: string): Promise<any> {
    await this.exchangeFilter.waitFor();
    await this.exchangeFilter.click();
    await this.selectCdkOption(value);
  }

  public async selectCarrier(value: string): Promise<any> {
    await this.carrierFilter.waitFor();
    await this.carrierFilter.click();
    await this.selectCdkOption(value);
  }

  public async selectBenefitType(value: string): Promise<any> {
    await this.benefitTypeFilter.click();
    await this.selectCdkOption(value);
  }

  public async setPlanNameSearchText(value: string): Promise<any> {
    await this.planNameSearchInput.focus();
    await this.planNameSearchInput.type(value, { delay: 100 });
  }

  public async clickSearchFilterButton(): Promise<any> {
    await this.selectFiltersButton.click();
  }

  public async getRows(planName: string): Promise<any[]> {
    let rows = await this.page.$$('.ag-row');
    return await Promise.all(rows.map(async row => {
      const textContent = await row.textContent();
      if (textContent && textContent.includes(planName)) {
        return row;
      }
    })).then(results => results.filter(row => row !== undefined));
  }

  public async setValueToPlantTypeSearch(value: string): Promise<any> {
    await this.planTypeInputSearch.fill(value);
  }

  public async isFilterIconVisibleOnPlanTypeColumn(): Promise<any> {
    await expect(this.gridPlanTypeFilter).toBeVisible();
  }

  public async clickOnPlanTypeFilter(): Promise<any> {
    await this.gridPlanTypeFilter.click();
  }

  public async clickOnElementByName(label: string): Promise<any> {
    await this.page.getByText(label).first().click();
  }

  public async noRecordsFoundInGrid(): Promise<any> {
    await expect(this.basePlanGridPagination).toContainText('of 0');
  }

  public async recordsFoundInGrid(): Promise<any> {
    await expect(this.basePlanGridPagination).not.toContainText('of 0');
  }

  public async getCells(row: any): Promise<any> {
    return await row.$$('.ag-cell');
  }

  public async escapeInput(): Promise<any> {
    await this.page.keyboard.press('Escape');
  }

  public async sleep(): Promise<any> {
    await this.page.waitForTimeout(1000);
  }

  public async clickFirstPlanYearForPlanName(basePlanName: string): Promise<any> {
    const gridRowLocator = this.page.locator('.ag-row');
    const gridRowNameFilter = this.page.locator('.ag-cell', { hasText: basePlanName });
    const planYearLocator = this.page.locator('bpl-plan-year a');
    await this.basePlanGrid
      .locator(gridRowLocator)
      .filter({ has: gridRowNameFilter })
      .locator(planYearLocator).first()
      .click();
  }

  private async selectCdkOption(value: string): Promise<any> {
    const option = this.page.locator('trinet-option', { hasText: value });
    const cdkPanelOverlay = this.cdkPanelOverlay.filter({ has: option });
    await expect(cdkPanelOverlay).toBeVisible();
    await cdkPanelOverlay.locator(option).click();
    await expect(cdkPanelOverlay).toBeHidden();
  }
  public async selectSearchResult() {
    await this.searchResultBasePlan.isVisible();
    await this.searchResultBasePlan.click();
  }

  public async validateBenefitTypeDropdownValues() {
    const respose = await this.page.request.get(credentials.APIURI + '/api-hw-benplanlib-plan/v1/industry-category/PEO');
    // await console.log("Response = " + respose.status());
    const respBody = JSON.parse(await respose.text());
    //console.log('length>>>>>>>>>>>' + await respBody.data.length);
    await this.benefitTypeFilter.click();
    for (const response of respBody.data) {
      await test.step(`Validate Benefit type displayed - ${response.benefitType}`, async () => {
        console.log('response.data.benefitType>>>>' + await response.benefitType);
        await expect(this.benefitTypes(response.benefitType)).toBeVisible();
      });
    }
  }

  public async validateExchangeDropdownValues(value: string) {
    const respose = await this.page.request.get(credentials.APIURI + '/ui-hw-benplanlib/assets/data/exchange.json');
    const respBody = JSON.parse(await respose.text());
    //console.log('length>>>>>>>>>>>' + await respBody.data.length);
    await this.exchangeFilter.click();
    for (const response of respBody.data) {
      await test.step(`Validate Benefit type displayed - ${response.name}`, async () => {
        console.log('response.data.benefitType>>>>' + await response.name);
        console.log('response.data.benefitType>>>>' + await this.exchanges(response.name));
        await expect(this.exchanges(response.name)).toBeVisible();
      });
    }
    await this.selectCdkOption(value);
  }
}

