import { Router } from 'express';
import * as LocationsController from '../locations/locations.controller';

const router = Router();


router
  .get('/locations', LocationsController.getAvailableLocations)
  .post('/locations', LocationsController.createNewLocations)

export default router;
