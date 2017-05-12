'use strict';

import path from 'path';
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

  env.publicPath = path.join(__dirname, 'public');
  env.runMode = RUN_MODE;

  return env;
}

export default settings;