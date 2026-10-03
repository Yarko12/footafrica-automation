import fs from 'fs';
import path from 'path';
import { test as setup } from '@playwright/test';
import { getMagicCookie, getStorageStateFileName } from '../common/config';

setup('Accept agreement (with pre-set cookies)', async ({ page }, testInfo) => {
  const projectName = testInfo.project.name.replace('-setup', '');
  const storageFile = getStorageStateFileName(projectName);

  fs.mkdirSync(path.dirname(storageFile), { recursive: true });
  fs.writeFileSync(storageFile, '{}');

  const context = page.context();
  await context.addCookies([getMagicCookie()]);

  await page.goto('/');

  const acceptButton = page.getByRole('button', { name: 'Прийняти всі' });
  if (await acceptButton.isVisible()) {
    await acceptButton.click();
  }

  await context.storageState({ path: storageFile });
});