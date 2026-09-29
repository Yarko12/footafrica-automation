import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/** Read an environment variable (name is normalized to uppercase). */
export function getOption(name: string, defaultValue: string = ''): string {
  return process.env[name.toUpperCase()] ?? defaultValue;
}

type Cookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
};

export function getMagicCookie(): Cookie {
  return {
    name: getOption('MAGIC_COOKIE_NAME'),
    value: getOption('MAGIC_COOKIE_VALUE'),
    domain: '.foot-africa.com',
    path: '/',
  };
}

export function getStorageStateFileName(project: string): string {
  return path.resolve(process.cwd(), `.state/${project}.json`);
}

export function isSlackEnabled(project: string, env: string): boolean {
  const value = getOption(`${project}_${env}_slack_enabled`, '0');
  return ['1', 'true', 'on'].includes(value.toLowerCase());
}

export function isHeadless(): boolean {
  const value = getOption('headless', '0');
  return ['1', 'true', 'on'].includes(value.toLowerCase());
}