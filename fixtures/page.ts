import { test as base } from '@playwright/test';
import { waitForCloudflareToPass } from '../common/cloudflare';

export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);
    page.goto = (async (url, options) => {
      const response = await goto(url, options);
      await waitForCloudflareToPass(page);
      return response;
    }) as typeof page.goto;

    await page.goto('/');
    await use(page);
  },
});

export { expect } from '@playwright/test';