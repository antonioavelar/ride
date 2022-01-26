import Coordinates from '../../ts/interfaces/Coordinates';

interface Stop {
  coordinates: Coordinates,
  arrivalTime: Date
}

interface Start {
  coordinates: Coordinates,
  departureTime: Date
}

export interface CreateCourseDto {
  start: Start,
  stop: Stop
}

export interface GetCoursesDto {
  start?: Coordinates,
  stop?: Coordinates,
  kilometers: number
}


