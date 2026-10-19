import { test, expect } from '../fixtures/page';
import { waitForCloudflareToPass } from '../common/cloudflare';

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
    test.setTimeout(120_000);

    const loginForm = page.locator('#signIn');
    const loginButton = page.getByRole('button', { name: 'Connexion' });

    await expect(async () => {
        if (!(await loginForm.isVisible())) {
            await loginButton.click({ timeout: 5_000 });
        }
        await expect(loginForm).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 60_000 });

    await loginForm.getByLabel('E-mail').fill('sokil20@meta.ua');
    await loginForm.getByLabel('Mot de passe').fill('Volta12s');

    await loginForm.getByRole('button', { name: 'Se connecter' }).click();

    await waitForCloudflareToPass(page);

    await expect(loginButton).toBeHidden();
});

test('Add comment to first news', async ({ page }) => {
    test.setTimeout(180_000);

    const commentText = 'Goal!';

    const firstNews = page.locator('.news-list_main .news-item-col_big .news-item-col__link').first();
    await expect(firstNews).toBeVisible();
    await firstNews.click();
    await expect(page).toHaveURL(/\/actualites\/.+-\d+\/$/);

    const comments = page.locator('#comments');
    const loginButton = page.locator('.comments__not-auth .js-login-button');
    await loginButton.scrollIntoViewIfNeeded();

    const loginForm = page.locator('#signIn');
    await expect(async () => {
        if (!(await loginForm.isVisible())) {
            await loginButton.click({ timeout: 5_000 });
        }
        await expect(loginForm).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 60_000 });

    await loginForm.getByLabel('E-mail').fill('sokil20@meta.ua');
    await loginForm.getByLabel('Mot de passe').fill('Volta12s');
    await loginForm.getByRole('button', { name: 'Se connecter' }).click();

    await waitForCloudflareToPass(page);

    const commentInput = comments.locator('#add-comment');
    await commentInput.scrollIntoViewIfNeeded();
    await expect(commentInput).toBeVisible({ timeout: 30_000 });
    await commentInput.fill(commentText);

    await comments.getByRole('button', { name: 'Envoyer' }).click();

    const commentsList = comments.locator('.js-comments-list');
    await expect(commentsList.getByText(commentText, { exact: true }).first()).toBeVisible({ timeout: 15_000 });

    // Edit the comment: "Goal!" -> "Goal!!!!"
    // Edit/Delete buttons are shown only on your own comments, for ~10 minutes after posting
    const editedText = commentText + '!!!';
    const myComment = commentsList
        .locator('div')
        .filter({ has: page.getByText(commentText, { exact: true }) })
        .filter({ has: page.locator('.js-edit-controls') })
        .last();

    await myComment.locator('.js-edit-comment').click();

    // "Modifier" opens an inline edit form in place of the comment
    const editInput = commentsList.locator('textarea.js-comment-input');
    await expect(editInput).toHaveValue(commentText);
    await editInput.fill(editedText);
    await commentsList.getByRole('button', { name: 'Enregistrer les modifications' }).click();

    const editedComment = commentsList.getByText(editedText, { exact: true });
    await expect(editedComment).toBeVisible({ timeout: 15_000 });

    // Delete the edited comment
    const commentToDelete = commentsList
        .locator('div')
        .filter({ has: page.getByText(editedText, { exact: true }) })
        .filter({ has: page.locator('.js-edit-controls') })
        .last();

    page.once('dialog', (dialog) => dialog.accept());
    await commentToDelete.locator('.js-delete-comment').click();

    await expect(editedComment).toHaveCount(0, { timeout: 15_000 });
});