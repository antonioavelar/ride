import { LineString } from '@turf/turf';

export default interface Course {
    geometry?: LineString,
    start: {
        placeId: string
        departureTime: Date
    },
    stop: {
        placeId: string
        arrivalTime: Date
    }
}