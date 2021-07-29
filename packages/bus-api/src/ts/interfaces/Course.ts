import { LineString, Geometry, Properties } from '@turf/turf';
import Coordinates from './Coordinates';

export default interface Course {
  geometry?: LineString,
  start: {
    geometry: Geometry,
    properties: Properties,
  },
  stop: {
    geometry: Geometry,
    properties: Properties,
  }
}

