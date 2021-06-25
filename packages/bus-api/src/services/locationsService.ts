import Coordinates from 'ts/interfaces/Coordinates';
import PlacesModel from '../models/Place';

import * as turf from '@turf/turf';
import Place from 'ts/interfaces/Place';


export async function getAvailableLocations(location: Coordinates) {
  const GeoJSON = turf.point([location.long, location.lat]);

  const places = await PlacesModel.find({
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

  const newPlace = await PlacesModel.create({ location: placeGeoJson.geometry });

  return newPlace;
}
