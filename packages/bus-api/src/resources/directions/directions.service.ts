import axios from 'axios';
import * as nconf from 'nconf';
import Coordinates from 'ts/interfaces/Coordinates';


axios.interceptors.request.use((axiosConfig) => {
  axiosConfig.params = {
    ...axiosConfig.params,
    access_token: nconf.get('MAPBOX_API_KEY')
  };
  return axiosConfig
})

/**
 * @todo Add proper caching
 * @param places 
 * @returns 
 */
export async function getDirections(places: { origin: Coordinates, destination: Coordinates }) {
  const { data } = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${places.origin.long},${places.origin.lat};${places.destination.long},${places.destination.lat}`, {
    params: {
      geometries: 'geojson'
    }
  })

  return data;
}

