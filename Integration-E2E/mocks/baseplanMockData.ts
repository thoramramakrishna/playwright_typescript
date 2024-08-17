import { type Page } from '@playwright/test';
import { local } from '../fixtures/env.json';
export class HomePageMockData {

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async getBasePlansAndFilters() {
    //console.log(this.page.url);
    await this.page.route("**/carrier?exchange=TriNet%20III&benefitType=Dental", (route, request) => {
      console.log(request.url());
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "./Integration-E2E/assets/carrier-dental.json"
        });
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });


    await this.page.route("**/carrier?exchange=TriNet%20III&benefitType=Vision", (route, request) => {
      console.log(request.url());
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "./Integration-E2E/assets/carrier-vision.json"
        });
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });



    await this.page.route("**/carrier?exchange=TriNet%20III&benefitType=Medical", (route, request) => {
      console.log(request.url());
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "./Integration-E2E/assets/carrier-medical.json"
        });
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });


    await this.page.route("**/PEO", (route, request) => {
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "./Integration-E2E/assets/benefit-type.json"
        });
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });

    await this.page.route("**/plan?exchange=TriNet%20III&carrier=Aetna&industryCatId=3", (route, request) => {
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "./Integration-E2E/assets/base-plans-vision.json"
        });
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });


    await this.page.route("**/plan?exchange=TriNet%20III&carrier=Aetna&industryCatId=2", (route, request) => {
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "./Integration-E2E/assets/base-plans-dental.json"
        });
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });

    await this.page.route("**/plan?exchange=TriNet%20III&carrier=Aetna&industryCatId=1", (route, request) => {
      //TODO make it better with regex matching local host
      if (request.url().match(local)) {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          path: "./Integration-E2E/assets/base-plans-medical.json"
        });
      } else {
        console.log("*********************");
        console.log("*********************");
        // no need to route from mock as it should be staging and production
        //TODO : extra logic can be put to make sure url is from stage and production
      }
    });

    await this.page.route("**/plan/8acba22f8ad78d41018ad8ddfec000a5", (route, request) => {
      if (request.url().match(local)) {
        if (request.method() === "PUT") {
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

    await this.page.route("**/plan/8acba22f8ad78d41018ad8ca4c33001d", (route, request) => {
      if (request.url().match(local)) {
        if (request.method() === "PUT") {
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
    
    await this.page.route("**/plan/8acba22f8ad78d41018ad8d3d777005d", (route, request) => {
      if (request.url().match(local)) {
        if (request.method() === "PUT") {
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

  async loadOptions() {
  
  }
}
