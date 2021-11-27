import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const DEV_CONFIG_FILENAME = 'development.yml';
const PROD_CONFIG_FILENAME = 'production.yml';

export default () => {
  const configFileName =
    process.env.NODE_ENV === 'prod'
      ? PROD_CONFIG_FILENAME
      : DEV_CONFIG_FILENAME;

  const defaultConfig = yaml.load(
    readFileSync(join(__dirname, configFileName), 'utf8'),
  );

  return defaultConfig as Record<string, any>;
};
