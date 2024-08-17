import { type Page } from '@playwright/test';
import { local } from '../fixtures/env.json';
export class AttributeMockData {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    async getAttributesAndRegionalMapping() {
        //console.log(this.page.url);
        await this.page.route("**/attribute/plan/8acba22f8ad78d41018ad8ddfec000a5?effectiveDt=10%2F01%2F2023&plEffectiveDt=10%2F01%2F2023", (route, request) => {
            console.log(request.url());
            //TODO make it better with regex matching local host
            if (request.url().match(local)) {
                route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    path: "./Integration-E2E/assets/attributes-medical.json"
                });
            } else {
                console.log("*********************");
                console.log("*********************");
                // no need to route from mock as it should be staging and production
                //TODO : extra logic can be put to make sure url is from stage and production
            }
        });


        await this.page.route("**/attribute/plan/8acba22f8ad78d41018ad8ca4c33001d?effectiveDt=10%2F01%2F2023&plEffectiveDt=10%2F01%2F2023", (route, request) => {
            console.log(request.url());
            //TODO make it better with regex matching local host
            if (request.url().match(local)) {
                route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    path: "./Integration-E2E/assets/attributes-dental.json"
                });
            } else {
                console.log("*********************");
                console.log("*********************");
                // no need to route from mock as it should be staging and production
                //TODO : extra logic can be put to make sure url is from stage and production
            }
        });

        await this.page.route("**/attribute/plan/8acba22f8ad78d41018ad8d3d777005d?effectiveDt=10%2F01%2F2023&plEffectiveDt=10%2F01%2F2023", (route, request) => {
            console.log(request.url());
            //TODO make it better with regex matching local host
            if (request.url().match(local)) {
                route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    path: "./Integration-E2E/assets/attributes-vision.json"
                });
            } else {
                console.log("*********************");
                console.log("*********************");
                // no need to route from mock as it should be staging and production
                //TODO : extra logic can be put to make sure url is from stage and production
            }
        });

        await this.page.route("**/plan/8acba22f8ad78d41018ad8ddfec000a5/mapping/legacy?plEffectiveDt=10%2F01%2F2023", (route, request) => {
            //TODO make it better with regex matching local host
            if (request.url().match(local)) {
                route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    path: "./Integration-E2E/assets/medical-regionalplan.json"
                });
            } else {
                console.log("*********************");
                console.log("*********************");
                // no need to route from mock as it should be staging and production
                //TODO : extra logic can be put to make sure url is from stage and production
            }
        });

        await this.page.route("**/plan/8acba22f8ad78d41018ad8ca4c33001d/mapping/legacy?plEffectiveDt=10%2F01%2F2023", (route, request) => {
            //TODO make it better with regex matching local host
            if (request.url().match(local)) {
                route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    path: "./Integration-E2E/assets/dental-regionalplan.json"
                });
            } else {
                console.log("*********************");
                console.log("*********************");
                // no need to route from mock as it should be staging and production
                //TODO : extra logic can be put to make sure url is from stage and production
            }
        });
        await this.page.route("**/plan/8acba22f8ad78d41018ad8d3d777005d/mapping/legacy?plEffectiveDt=10%2F01%2F2023", (route, request) => {
            //TODO make it better with regex matching local host
            if (request.url().match(local)) {
                route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    path: "./Integration-E2E/assets/vision-regionalplan.json"
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
