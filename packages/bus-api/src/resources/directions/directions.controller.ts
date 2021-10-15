import * as DirectionsService from './directions.service';
import { Request, Response } from 'express';
import * as yup from 'yup';



export async function getAvailableLocations(req: Request, res: Response) {
  try {
    const schema = yup.object({
      origin: yup.object({
        lat: yup.number().max(90).min(-90).required(),
        long: yup.number().max(180).min(-180).required(),
      }),
      destination: yup.object({
        lat: yup.number().max(90).min(-90).required(),
        long: yup.number().max(180).min(-180).required(),
      })
    }).required();

    const places = await schema.validate(req.query);
    const directions = await DirectionsService.getDirections(places);

    res.json({
      directions,
    })
  } catch (error) {
    res.json({ error })
  }
}

