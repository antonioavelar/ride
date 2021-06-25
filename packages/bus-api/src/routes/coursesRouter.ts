import { Router } from 'express';
import * as coursesController from '../controllers/coursesController';

const router = Router();


router
  .post('/courses', coursesController.createCourse)


export default router;