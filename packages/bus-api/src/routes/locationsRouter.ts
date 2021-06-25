import { Router } from 'express';
import * as LocationsController from '../controllers/locationsController';

const router = Router();


router
  .get('/locations', LocationsController.getAvailableLocations)
  .post('/locations', LocationsController.createNewLocations)

export default router;