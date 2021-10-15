import axios from 'axios';


axios.interceptors.request.use((axiosConfig) => {
  axiosConfig.params = {
    ...axiosConfig.params,
    access_token: process.env.REACT_APP_MAPBOX_KEY
  };
  return axiosConfig
})


interface IFeature {
  geometry: {
    coordinates: number[],
    type: string
  },
  id: string,
  text: string,
  relevance: number,
  place_name: string,
}

interface IResponse {
  query: string[],
  features: IFeature[]
}

interface IMapBoxResponse {
  query: string[],
  features: IFeature[]
}

export class SearchService {

  private static toSearchResult(result: IMapBoxResponse): IResponse {
    return {
      query: result.query,
      features: result.features.map(val => ({
        id: val.id,
        geometry: val.geometry,
        relevance: val.relevance,
        place_name: val.place_name,
        text: val.text
      }))
    }
  }

  static async getPlacesFromText(text: string) {
    const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json`)

    return this.toSearchResult(data)
  }

}

