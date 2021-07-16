import Coordinates from 'ts/interfaces/Coordinates';
import LocationsModel from '../locations/locations.model';

import * as turf from '@turf/turf';
import Place from 'ts/interfaces/Place';


export async function getAvailableLocations(location: Coordinates) {
  const GeoJSON = turf.point([location.long, location.lat]);

  const places = await LocationsModel.find({
    location: {
      $near: {
        $geometry: GeoJSON.geometry,
        $maxDistance: 5000,
        $minDistance: 0
      },
    }
  });

  return places;
}



export async function createLocation(location: Coordinates): Promise<Place> {
  const placeGeoJson = turf.point([location.long, location.lat]);

  const newPlace = await LocationsModel.create({ location: placeGeoJson.geometry });

  return newPlace;
}
