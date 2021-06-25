import * as CoursesService from '../services/coursesService';
import { Request, Response } from 'express';
import * as yup from 'yup';
import Course from 'ts/interfaces/Course';


export async function createCourse(req: Request, res: Response, next: Function) {
  try {
    const schema = yup.object({
      start: yup.object({
        placeId: yup.string().length(24).required(),
        departureTime: yup.date().required(),
      }).required(),
      stop: yup.object({
        placeId: yup.string().length(24).required(),
        arrivalTime: yup.date().required(),
      }).required(),
    }).required();

    const location = await schema.validate(req.body);
    const course = await CoursesService.createCourse(location);

    res.json({
      course,
    })
  } catch (error) {
    next(error)
  }
}
