import MapBox from '@mapbox/mapbox-sdk';
import nconf from 'nconf';

export default MapBox({ accessToken: nconf.get() })
