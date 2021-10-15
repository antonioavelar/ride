import { Router } from 'express';
import * as coursesController from './courses.controller';
import sessionMiddleware from '../../middlewares/session';

const router = Router();


router
  .use('/courses', sessionMiddleware)
  .post('/courses', coursesController.createCourse)
  .get('/courses', coursesController.getCourses)

export default router;
