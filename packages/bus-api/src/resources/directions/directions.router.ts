import { Router } from 'express';
import * as LocationsController from './directions.controller';

const router = Router();


router
  .get('/directions', LocationsController.getAvailableLocations)

export default router;
