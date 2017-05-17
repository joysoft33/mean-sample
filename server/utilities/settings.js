'use strict';

import config from '../config/env';

const RUN_MODE = process.env.NODE_ENV || 'development';

function settings() {

  let env = {};

  switch (RUN_MODE) {
    case 'development':
    case 'production':
      env = config[RUN_MODE];
      break;
  }

  env.publicPath = 'dist/public';
  env.rootPath = 'dist';
  env.runMode = RUN_MODE;

  return env;
}

export default settings;