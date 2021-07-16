import * as mongoose from "mongoose";
import Course from 'ts/interfaces/Course';

const schema = new mongoose.Schema<Course>({
  geometry: {
    type: { type: String },
    coordinates: []
  },
  start: {
    placeId: String,
    departureTime: Date
  },
  stop: {
    placeId: String,
    arrivalTime: Date
  }
});
schema.index({ geometry: '2dsphere' });


const LocationsModel = mongoose.model<Course>('Courses', schema);

export default LocationsModel;
