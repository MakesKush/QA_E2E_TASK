export const config = {
  baseURL: 'https://qa6.negsim.com',
  globalTimeout: 20000,
  defaultTimeout: 10000,
  registrationTimeout: 120000,
  mailTimeout: 45000,
  username: 'calum.coburn@negotiations.com',
  password: '*****',
  headless: process.env.HEADLESS === 'true',
};

export function getMailcatcherCredentials(): { username: string; password: string; origin: string } {
  const username = process.env.MAILCATCHER_USERNAME;
  const password = process.env.MAILCATCHER_PASSWORD;

  if (!username || !password) {
    throw new Error('Set MAILCATCHER_USERNAME and MAILCATCHER_PASSWORD before running registration tests');
  }

  return { username, password, origin: config.baseURL };
}
