import DeckGL from "@deck.gl/react";
import { IconLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
import { StaticMap } from "react-map-gl";
import {
  Popover,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverArrow,
  PopoverBody,
  Image,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import RideSDK from "../../helpers/ride";

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
  const [cursor, setCursor] = useState("auto");
  const [layers, setLayers] = useState([]);
  const [tooltip, setTooltip] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    location: {
      type: "",
      coordinates: { latitude: null, longitude: null },
    },
  });

  const onLayerHover = (hover) => {
    setCursor("pointer");

    if (!hover.object) {
      setCursor("auto");
      return;
    }
  };

  const hideTooltip = () => {
    setTooltip({
      ...tooltip,
      isOpen: false,
    });
  };

  const onResize = () => {
    setTooltip({ ...tooltip, isOpen: false });
  };

  const showTooltip = (click) => {
    setCursor("pointer");

    if (!click.object) {
      hideTooltip();
      setCursor("auto");
      return;
    }

    // if its already open, no need to change
    if (tooltip.isOpen) {
      return;
    }

    setTooltip({
      ...tooltip,
      isOpen: true,
      x: click.x + 20,
      y: click.y,
      location: {
        type: click.object?.name,
        coordinates: { longitude: click?.coordinate[0], latitude: click?.coordinate[1] },
      },
    });
  };

  useEffect(() => {
    const newLayers: any = [];

    (async () => {
      if (props.origin.latitude && props.destination.latitude) {
        const data = await RideSDK.getCourses({
          start: { lat: props.origin.latitude, long: props.origin.longitude },
          stop: { lat: props.destination.latitude, long: props.destination.longitude },
        });
      }
    })();

    if (props.origin) {
      newLayers.push(
        new IconLayer({
          id: "origin-icon-layer",
          data: [
            {
              name: "Origin",
              coordinates: [props.origin.longitude, props.origin.latitude],
            },
          ],
          pickable: true,
          iconAtlas: process.env.PUBLIC_URL + "/location.png",
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
          iconAtlas: process.env.PUBLIC_URL + "/location.png",
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
      onClick={showTooltip}
      onHover={onLayerHover}
      onResize={onResize}
      getCursor={({ isDragging }) => (isDragging ? "grabbing" : cursor)}
      initialViewState={{
        ...INITIAL_VIEW_STATE,
        longitude: props.origin.longitude || INITIAL_VIEW_STATE.longitude,
        latitude: props.origin.latitude || INITIAL_VIEW_STATE.latitude,
      }}
      controller={true}
      layers={layers}
    >
      <StaticMap mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY} reuseMaps={true} />

      <Popover isOpen={tooltip.isOpen}>
        <PopoverContent left={tooltip.x} top={tooltip.y}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader textAlign="start" display="flex" alignItems="center">
            {" "}
            <Image height="8" src={process.env.PUBLIC_URL + "/start.png"}></Image>
            <Text fontSize="lg">(lg) In love with React & Next</Text>
          </PopoverHeader>
          <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
        </PopoverContent>
      </Popover>
    </DeckGL>
  );
};

export default Home;
