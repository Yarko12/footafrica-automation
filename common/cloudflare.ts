import { expect, test, type Page } from '@playwright/test';

const CLOUDFLARE_TIMEOUT_MS = 45_000;

/**
 * Waits until the Cloudflare interstitial is gone and the site header is visible.
 * Retries through the challenge page and through reloads it triggers.
 */
export async function waitForCloudflareToPass(page: Page): Promise<void> {
  test.setTimeout(test.info().timeout + CLOUDFLARE_TIMEOUT_MS);

  try {
    await expect(async () => {
      const title = await page.title();
      expect(title).not.toMatch(/just a moment|attention required/i);

      await expect(
        page.getByRole('heading', { name: /performing security verification/i })
      ).toBeHidden({ timeout: 1_000 });

      await expect(page.getByRole('banner').first()).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: CLOUDFLARE_TIMEOUT_MS });
  } catch (error) {
    const title = await page.title().catch(() => '');
    throw new Error(
      `Cloudflare challenge did not pass within ${CLOUDFLARE_TIMEOUT_MS}ms (title: "${title}"). Check MAGIC_COOKIE and the QA user-agent whitelist.`,
      { cause: error }
    );
  }
}
