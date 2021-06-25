import { Router } from 'express';
import coursesRouter from './coursesRouter';
import locationsRouter from './locationsRouter';

export default Router().use(coursesRouter, locationsRouter);