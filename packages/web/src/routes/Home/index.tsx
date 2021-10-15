import DeckGL from "@deck.gl/react";
import { IconLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
import { StaticMap } from "react-map-gl";
import { useState, useEffect } from "react";

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.7,
  zoom: 11,
  pitch: 0,
  bearing: 0,
};

interface HomeProps {
  origin?: any;
  destination?: any;
}

const Home = (props: HomeProps) => {
  const [time, setTime] = useState(0);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const newLayers: any = [];
    if (props.origin) {
      newLayers.push(
        new IconLayer({
          id: "icon-layer",
          data: [
            {
              name: "Origin",
              coordinates: [props.origin.longitude, props.origin.latitude],
            },
          ],
          pickable: true,
          iconAtlas: process.env.PUBLIC_URL + "/start.png",
          iconMapping: { marker: { x: 0, y: 0, width: 64, height: 64 } },
          getIcon: (d) => "marker",
          sizeScale: 6,
          getPosition: (d: any) => d.coordinates,
          getSize: (d: any) => 5,
          getColor: (d: any) => [Math.sqrt(d.exits), 140, 0],
        }),
      );
    }
    if (props.destination) {
      newLayers.push(
        new IconLayer({
          id: "destination-icon-layer",
          data: [
            {
              name: "Destination",
              coordinates: [props.destination.longitude, props.destination.latitude],
            },
          ],
          pickable: true,
          iconAtlas: process.env.PUBLIC_URL + "/finish.png",
          iconMapping: { marker: { x: 0, y: 0, width: 64, height: 64 } },
          getIcon: (d) => "marker",
          sizeScale: 6,
          getPosition: (d: any) => d.coordinates,
          getSize: (d: any) => 5,
          getColor: (d: any) => [Math.sqrt(d.exits), 140, 0],
        }),
      );
    }

    setLayers(newLayers);
  }, [props.destination, props.origin]);

  return (
    <DeckGL
      style={{ position: "relative" }}
      initialViewState={{
        ...INITIAL_VIEW_STATE,
        longitude: props.origin.longitude || INITIAL_VIEW_STATE.longitude,
        latitude: props.origin.latitude || INITIAL_VIEW_STATE.latitude,
      }}
      controller={true}
      layers={layers}
    >
      <StaticMap mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY} reuseMaps={true} />
    </DeckGL>
  );
};

export default Home;
