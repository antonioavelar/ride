import * as turf from '@turf/turf';

import { Types } from 'mongoose'
import LocationsModel from '../locations/locations.model';
import CoursesModel from './courses.model';
import Course from 'ts/interfaces/Course';
import Place from 'ts/interfaces/Place'
import Mapbox from 'helpers/MapBox'

export async function createCourse(course: Course): Promise<Course> {
  const places = await LocationsModel.find({
    _id: {
      $in: [
        Types.ObjectId(course.start.placeId),
        Types.ObjectId(course.stop.placeId),
      ],
    }
  });

  if (places.length < 2) {
    throw Error("INVALID_LOCATIONS");
  }



  const newCourse: Course = await CoursesModel.create({
    start: course.start,
    stop: course.stop,
    geometry: turf.lineString([
      places[0].location.coordinates,
      places[1].location.coordinates]
    ).geometry
  })

  return newCourse;
}


export async function addStopToCourse(stop: Place) {

}
