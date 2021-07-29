import * as turf from '@turf/turf';

import { Types } from 'mongoose'
import LocationsModel from '../locations/locations.model';
import CoursesModel from './courses.model';
import { CreateCourseDto, GetCoursesDto } from './courses.dto';
import Place from 'ts/interfaces/Place'
import Mapbox from 'helpers/MapBox'
import Course from 'ts/interfaces/Course';
import { Session } from '@ory/kratos-client';

export default class CoursesService {

  static async createCourse(course: CreateCourseDto, user: Session): Promise<Course> {
    const startCoordinates = [course.start.coordinates.long, course.start.coordinates.lat];
    const stopCoordinates = [course.stop.coordinates.long, course.stop.coordinates.lat];

    const start = turf.point(startCoordinates);
    const stop = turf.point(stopCoordinates);

    const newCourse = await CoursesModel.create({
      ownerId: user.identity.id,
      start: {
        geometry: start.geometry
      },
      stop: {
        geometry: stop.geometry
      },
      geometry: turf.lineString([
        startCoordinates,
        stopCoordinates,
      ]).geometry
    })

    return newCourse;
  }


  static async getCourses(options: GetCoursesDto) {
    const stopPointFeature = turf.point([
      options.stop.long,
      options.stop.lat,
    ]);
    const startPointFeature = turf.point([
      options.start.long,
      options.start.lat,
    ]);

    const nearbyStartPosition = await CoursesModel
      .find({
        'start.geometry': {
          $near: {
            $geometry: {
              type: startPointFeature.type,
              coordinates: startPointFeature.geometry.coordinates,
            },
            $maxDistance: options.kilometers * 1000,
          }
        },
      });

    const nearbyStop = await CoursesModel
      .find({
        _id: { $in: nearbyStartPosition.map(val => val._id) },
        'stop.geometry': {
          $near: {
            $geometry: {
              type: stopPointFeature.type,
              coordinates: stopPointFeature.geometry.coordinates,
            },
            $maxDistance: options.kilometers * 1000,
          }
        },
      });

    return nearbyStop;
  }

}

