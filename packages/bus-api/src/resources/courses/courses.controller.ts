import CoursesService from './courses.service';
import { Request, Response } from 'express';
import * as yup from 'yup';
import { CreateCourseDto } from './courses.dto';


export async function createCourse(req, res: Response, next: Function) {
  try {
    const schema = yup.object({
      start: yup.object({
        coordinates: yup.object({
          lat: yup.number().max(90).min(-90).defined(),
          long: yup.number().max(180).min(-180).defined(),
        }),
        departureTime: yup.date().defined(),
      }).defined(),
      stop: yup.object({
        coordinates: yup.object({
          lat: yup.number().max(90).min(-90).defined(),
          long: yup.number().max(180).min(-180).defined(),
        }),
        arrivalTime: yup.date().defined(),
      }).defined(),
    }).defined();

    const location: CreateCourseDto = await schema.validate(req.body);

    const course = await CoursesService.createCourse(location, req.user);

    res.json({
      course,
    })
  } catch (error) {
    next(error)
  }
}


export async function getCourses(req: Request, res: Response, next: Function) {
  try {
    const schema = yup.object().shape({
      stop: yup.object({
        lat: yup.number().max(90).min(-90),
        long: yup.number().max(180).min(-180)
      }).defined(),
      start: yup.object({
        lat: yup.number().max(90).min(-90),
        long: yup.number().max(180).min(-180),
      }).defined(),
      kilometers: yup.number().integer().max(10).min(1).default(1),
    }).required();

    const data = await schema.validate(req.query);

    const courses = await CoursesService.getCourses(data);

    res.json({
      courses,
    })

  } catch (error) {
    next(error)
  }
}

