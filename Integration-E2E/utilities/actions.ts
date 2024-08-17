import { test, expect, type Locator, type Page } from '@playwright/test';
export class Utilities {
    async executeStep(element: Locator, action: String, description: string, data?: string) {
        await test.step(description, async () => {
            switch (action) {
                case "click":
                    await element.click({force: true});
                    break;
                case "clear":
                    await element.clear();
                    break;
                    case "type":
                        if (data) {
                            await element.type(data);
                        }
                        break;    
                case "fill":
                    if (data) {
                        await element.fill(data);
                    }
                    break;
                case "type":
                    if (data) {
                        await element.type(data, { delay: 100 });
                    }
                    break;
                case "tap":
                    await element.tap();
                    break;
                case "hover":
                    await element.hover();
                    break;
            }
        })

    }
    async assertStep(element: Locator, action: String, description: string, data?: string) {
        await test.step(description, async () => {
            switch (action) {
                case "visible":
                    await expect(element).toBeVisible();
                    break;
                case "enabled":
                        await expect(element).toBeEnabled();
                        break;    
                case "text":
                    if (data) {
                        await expect(element).toContainText(data);
                    }
                    break;
            }
        })

    }

}
