import { test, expect } from '../fixtures/page';

test('URL and title are valid', async ({ page }) => {
  await expect(page).toHaveURL('https://foot-africa.com/');
  await expect(page).toHaveTitle(
    'Foot Africa : Actu foot en Afrique et dans le monde - transferts, dossiers et dernières infos du foot'
  );
});

test('Language switcher contains FR, AR and EN locales', async ({ page }) => {
  const languageSwitcher = page.locator('.locale-switcher');

  await expect(languageSwitcher).toBeVisible();
  await expect(languageSwitcher.locator('.locale-switcher__locale')).toHaveText('FR');

  const arabicLocale = languageSwitcher.locator('a[data-locale="ar"]');
  await expect(arabicLocale).toHaveText('AR - Arabe');
  await expect(arabicLocale).toHaveAttribute('href', '/ar/');

  const englishLocale = languageSwitcher.locator('a[data-locale="en"]');
  await expect(englishLocale).toHaveText('EN - Anglais');
  await expect(englishLocale).toHaveAttribute('href', '/en/');
});

test('News menu item is visible and has correct URL', async ({ page }) => {
  const locator = page.getByRole('banner').getByRole('link', { name: 'Nouvelles', exact: true });

  await expect(locator).toBeVisible();
  await expect(locator).toHaveAttribute('href', '/actualites/');
});

test('Click on News and check transition', async ({ page }) => {
    const locator = page
        .getByRole('banner')
        .getByRole('link', { name: 'Nouvelles', exact: true });

    await locator.click();

    await expect(page).toHaveURL('https://foot-africa.com/actualites/');
    await expect(page).toHaveTitle('Info Foot - Les dernières actualités du football africain');
});

test('Check authorisation on site', async ({ page }) => {
    await page.getByRole('button', { name: 'Connexion' }).click();

    const loginForm = page.locator('#signIn');
    await expect(loginForm).toBeVisible({ timeout: 15_000 });

    await loginForm.getByLabel('E-mail').fill('sokil20@meta.ua');
    await loginForm.getByLabel('Mot de passe').fill('Volta12s');

    await loginForm.getByRole('button', { name: 'Se connecter' }).click();

    await expect(
        page.getByRole('button', { name: 'Connexion' })
    ).toBeHidden();
});