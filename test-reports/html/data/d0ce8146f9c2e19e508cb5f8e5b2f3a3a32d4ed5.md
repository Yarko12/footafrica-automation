# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\example.spec.ts >> Language switcher contains FR, AR and EN locales
- Location: tests\example.spec.ts:10:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.locale-switcher')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.locale-switcher')

```

```yaml
- main:
  - heading "foot-africa.com" [level=1]
  - heading "Performing security verification" [level=2]
  - paragraph: This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.
- contentinfo:
  - text: "Ray ID:"
  - code: a423a731bfe2c27f
  - text: Performance and Security by
  - link "Cloudflare, opens in a new tab":
    - /url: https://www.cloudflare.com?utm_source=challenge&utm_campaign=m
    - text: Cloudflare
  - link "Privacy, opens in a new tab":
    - /url: https://www.cloudflare.com/privacypolicy/
    - text: Privacy
```

# Test source

```ts
  1  | import { test, expect } from '../fixtures/page';
  2  | 
  3  | test('URL and title are valid', async ({ page }) => {
  4  |   await expect(page).toHaveURL('https://foot-africa.com/');
  5  |   await expect(page).toHaveTitle(
  6  |     'Foot Africa : Actu foot en Afrique et dans le monde - transferts, dossiers et dernières infos du foot'
  7  |   );
  8  | });
  9  | 
  10 | test('Language switcher contains FR, AR and EN locales', async ({ page }) => {
  11 |   const languageSwitcher = page.locator('.locale-switcher');
  12 | 
> 13 |   await expect(languageSwitcher).toBeVisible();
     |                                  ^ Error: expect(locator).toBeVisible() failed
  14 |   await expect(languageSwitcher.locator('.locale-switcher__locale')).toHaveText('FR');
  15 | 
  16 |   const arabicLocale = languageSwitcher.locator('a[data-locale="ar"]');
  17 |   await expect(arabicLocale).toHaveText('AR - Arabe');
  18 |   await expect(arabicLocale).toHaveAttribute('href', '/ar/');
  19 | 
  20 |   const englishLocale = languageSwitcher.locator('a[data-locale="en"]');
  21 |   await expect(englishLocale).toHaveText('EN - Anglais');
  22 |   await expect(englishLocale).toHaveAttribute('href', '/en/');
  23 | });
  24 | 
  25 | test('News menu item is visible and has correct URL', async ({ page }) => {
  26 |   const locator = page.getByRole('banner').getByRole('link', { name: 'Nouvelles', exact: true });
  27 | 
  28 |   await expect(locator).toBeVisible();
  29 |   await expect(locator).toHaveAttribute('href', '/actualites/');
  30 | });
  31 | 
  32 | test('Click on News and check transition', async ({ page }) => {
  33 |     const locator = page
  34 |         .getByRole('banner')
  35 |         .getByRole('link', { name: 'Nouvelles', exact: true });
  36 | 
  37 |     await locator.click();
  38 | 
  39 |     await expect(page).toHaveURL('https://foot-africa.com/actualites/');
  40 |     await expect(page).toHaveTitle('Info Foot - Les dernières actualités du football africain');
  41 | });
```