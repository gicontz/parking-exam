import 'dotenv/config';

function checkRequiredEnv(...names: string[]) {
  const missingEnv: string[] = [];

  names.forEach((name) => {
    if (!process.env[name]) {
      missingEnv.push(name);
    }
  });

  if (missingEnv.length > 0) {
    throw new Error(`Missing environment variables: ${missingEnv}.`);
  }
}

checkRequiredEnv(
  'NODE_ENV',
  'PORT',
  'BASE_URL',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
);

let baseUrl = process.env.BASE_URL as string;
baseUrl = baseUrl.slice(0, baseUrl.endsWith('/') ? -1 : undefined);

const NODE_ENV: string = process.env.NODE_ENV as string;
const app = {
  PORT: parseInt(process.env.PORT as string, 10),
  BASE_URL: baseUrl,
  WHITELIST: (process.env.WHITELIST as string).split(',') as Array<string>,
};

const db = {
  HOST: process.env.DB_HOST as string,
  PORT: parseInt(process.env.DB_PORT as string, 10),
  NAME: process.env.DB_NAME as string,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
};

export default { NODE_ENV, app, db };
