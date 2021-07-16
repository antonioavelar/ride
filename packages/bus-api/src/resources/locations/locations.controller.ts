import * as CoursesService from './locations.service';
import { Request, Response } from 'express';
import * as yup from 'yup';
import Place from 'ts/interfaces/Place';


export async function getAvailableLocations(req: Request, res: Response) {
  try {
    const schema = yup.object({
      lat: yup.number().max(90).min(-90).required(),
      long: yup.number().max(180).min(-180).required(),
    }).required();

    const location = await schema.validate(req.query);
    const places: Place[] = await CoursesService.getAvailableLocations(location);

    res.json({
      places,
    })
  } catch (error) {
    res.json({ error })
  }
}

export async function createNewLocations(req: Request, res: Response) {
  try {
    const schema = yup.object({
      location: yup.object({
        coordinates: yup.object({
          lat: yup.number().max(90).min(-90).required(),
          long: yup.number().max(180).min(-180).required(),
        }).required(),
      }).required(),
    }).required();

    const { location } = await schema.validate(req.body);
    const place: Place = await CoursesService.createLocation(location.coordinates);

    res.json({
      place,
    })
  } catch (error) {
    res.json({ error })
  }
}
