export const APP_NAME = 'Kishi';
export const APP_TAGLINE = 'Your passwords. Under your protection.';

export const DEFAULT_AUTO_LOCK_MINUTES = 15;
export const DEFAULT_CLIPBOARD_CLEAR_SECONDS = 30;

export const AUTO_LOCK_OPTIONS = [
  { label: '10 seconds (Testing / Demo)', value: 10 * 1000 },
  { label: '1 minute', value: 1 * 60 * 1000 },
  { label: '5 minutes', value: 5 * 60 * 1000 },
  { label: '15 minutes (Recommended)', value: 15 * 60 * 1000 },
  { label: '30 minutes', value: 30 * 60 * 1000 },
  { label: '1 hour', value: 60 * 60 * 1000 },
];

export const CLIPBOARD_TIMEOUT_OPTIONS = [
  { label: '15 seconds', value: 15 * 1000 },
  { label: '30 seconds (Default)', value: 30 * 1000 },
  { label: '60 seconds', value: 60 * 1000 },
];
