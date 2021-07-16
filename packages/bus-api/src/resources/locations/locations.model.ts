import * as mongoose from "mongoose";
import Place from 'ts/interfaces/Place';

const schema = new mongoose.Schema<Place>({
  location: {
    type: { type: String },
    coordinates: []
  }
});

schema.index({ location: '2dsphere' });

const LocationsModel = mongoose.model<Place>('Places', schema);

export default LocationsModel;