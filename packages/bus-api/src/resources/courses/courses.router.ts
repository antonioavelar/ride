import { Router } from 'express';
import * as coursesController from './courses.controller';

const router = Router();


router
  .post('/courses', coursesController.createCourse)
  .get('/courses', coursesController.getCourses)

export default router;
