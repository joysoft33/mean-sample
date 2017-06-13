'use strict';

import config from '../config/env';

let RUN_MODE = process.env.NODE_ENV;

/**
 * Export the main app settings
 */
export default function() {

  let env = {};

  if (RUN_MODE === 'production') {
    env = config.production;
  } else {
    RUN_MODE = 'development';
    env = config.development;
  }

  env.publicPath = 'dist/public';
  env.rootPath = 'dist';
  env.runMode = RUN_MODE;

  return env;
}