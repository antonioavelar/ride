import { Types } from 'mongoose'
import PlacesModel from '../models/Place';
import CoursesModel from '../models/Courses';

import * as turf from '@turf/turf';
import Course from 'ts/interfaces/Course';

export async function createCourse(course: Course): Promise<Course> {
    const places = await PlacesModel.find({
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
