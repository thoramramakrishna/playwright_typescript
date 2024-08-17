import { type Page } from '@playwright/test';
import { local } from '../fixtures/env.json';
export class SyncIssuesMockData {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async reRunSyncIssues() {
    //console.log(this.page.url);
    await this.page.route('*/**/v1/attribute/plan/sync', (route, request) => {
      if (request.url().match(local)) {
        if (request.method() === 'POST') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Mock response' }),
          });
        }
      } else {
        console.log('*********************');
        console.log('*********************');
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });
  }

  async getSyncIssues() {
    await this.page.route('*/**/v1/reports/bcr-sync', (route, request) => {
      console.log(request.url());
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          path: './Integration-E2E/assets/sync-issues.json',
        });
      } else {
        console.log('*********************');
        console.log('*********************');
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });
  }

  async getAttributeFromSync() {
    await this.page.route("*/**/v1/plan/003HAC-mock/document?plEffectiveDt=10/01/2022", (route, request) => {
      console.log(request.url());
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "./Integration-E2E/assets/attributes.json"
        });
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });
    await this.page.route("**/attribute/plan/003HAC-mock?effectiveDt=03%2F17%2F2023&plEffectiveDt=10%2F01%2F2022", (route, request) => {
      console.log(request.url());
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "./Integration-E2E/assets/attributes.json"
        });
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });

  }
}