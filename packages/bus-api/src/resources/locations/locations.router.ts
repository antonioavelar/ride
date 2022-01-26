import { Router } from 'express';
import * as LocationsController from '../locations/locations.controller';
import sessionMiddleware from '../../middlewares/session';

const router = Router();


router
  .use('/locations', sessionMiddleware)
  .get('/locations', LocationsController.getAvailableLocations)
  .post('/', LocationsController.createNewLocations)

export default router;
