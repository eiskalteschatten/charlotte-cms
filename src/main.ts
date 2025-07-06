import 'dotenv/config';

import './app';
import { setupSequelize } from './db/sequelize';

async function setup(): Promise<void> {
  await setupSequelize();
}

setup();
