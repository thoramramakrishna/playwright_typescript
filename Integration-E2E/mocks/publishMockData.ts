import { type Page } from '@playwright/test';
import { local } from '../fixtures/env.json';
export class PublishPageMockData {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async publishPostMessage() {
    //console.log(this.page.url);
    await this.page.route("**/attribute/plan/8acba22f8ad78d41018ad8ddfec000a5", (route, request) => {
      if (request.url().match(local)) {
        if (request.method() === "POST") {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ message: "Mock response" })
          });
        }
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });

    await this.page.route("**/attribute/plan/8acba22f8ad78d41018ad8ca4c33001d", (route, request) => {
      if (request.url().match(local)) {
        if (request.method() === "POST") {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ message: "Mock response" })
          });
        }
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });

    await this.page.route("**/attribute/plan/8acba22f8ad78d41018ad8d3d777005d", (route, request) => {
      if (request.url().match(local)) {
        if (request.method() === "POST") {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ message: "Mock response" })
          });
        }
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });
  }

}
