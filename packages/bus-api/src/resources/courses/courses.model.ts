import * as mongoose from "mongoose";
import Course from 'ts/interfaces/Course';
import Coordinates from 'ts/interfaces/Coordinates';

const schema = new mongoose.Schema<Course>({
  geometry: {
    type: { type: String, required: true },
    coordinates: { type: Array, required: true },
    properties: {
      type: Object
    },
  },
  ownerId: { type: String, required: true },
  start: {
    geometry: {
      type: { type: String, required: true },
      coordinates: { type: Array, required: true },
    },
    properties: {
      type: Object
    },
  },
  stop: {
    geometry: {
      type: { type: String, required: true },
      coordinates: { type: Array, required: true },
    },
    properties: {
      type: Object
    },
  }
});

schema.index({
  'start.geometry': '2dsphere',
});
schema.index({
  'stop.geometry': '2dsphere'
})


const LocationsModel = mongoose.model<Course>('Courses', schema);

export default LocationsModel;
