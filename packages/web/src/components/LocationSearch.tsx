import { BiCurrentLocation } from "react-icons/bi";
import { FaLocationArrow } from "react-icons/fa";
import { Box, Spinner, Text } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useEffect, useState } from "react";
import { throttle } from "lodash";
import { SearchService } from "../services/Search";

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}
interface LocationSearchProps {
  onLocationChange?: (coords: Coordinates) => unknown;
  title?: string;
}
enum LocationModeEnum {
  AUTO = "Current Location",
  MANUAL = "MANUAL",
}
interface ILocation {
  error: boolean;
  displayName: string;
  mode?: LocationModeEnum;
  coordinates: Coordinates;
}

const initialLocations = [
  { name: "Current Location", icon: <BiCurrentLocation fontSize="small" />, coordinates: {} },
];

export const LocationSearch = (props: LocationSearchProps) => {
  const [location, setLocation] = useState<ILocation>({
    error: false,
    displayName: "",
    coordinates: { latitude: null, longitude: null },
  });
  const [suggestions, setSuggestions] = useState(initialLocations);
  const [isLoading, setIsLoading] = useState(false);

  const getUserLocation = (): Promise<Coordinates> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setLocation({
            coordinates: coords,
            mode: LocationModeEnum.AUTO,
            error: false,
            displayName: "",
          });
          resolve(coords);
        },
        (error) => {
          setLocation({
            coordinates: { latitude: null, longitude: null },
            error: true,
            displayName: "",
          });
          reject(error);
        },
      );
    });

  const chooseLocation = async (e: string) => {
    setIsLoading(true);
    switch (e) {
      case LocationModeEnum.AUTO:
        const coordinates = await getUserLocation();
        setLocation({
          mode: LocationModeEnum.AUTO,
          error: false,
          displayName: "",
          coordinates,
        });
        break;

      default:
        const find = suggestions.find((location) => location.name === e);

        setLocation({
          mode: LocationModeEnum.MANUAL,
          error: false,
          displayName: e,
          coordinates: find?.coordinates as Coordinates,
        });
        break;
    }
    setIsLoading(false);
  };

  const searchLocations = async (e: any) => {
    try {
      const val = e.target.value.trim();

      if (!val) {
        return;
      }

      const { features } = await SearchService.getPlacesFromText(val);
      console.log(features);
      setSuggestions(
        [initialLocations[0]].concat(
          features.map((feature) => ({
            name: feature.place_name,
            icon: <FaLocationArrow fontSize="small" />,
            coordinates: {
              longitude: feature.geometry.coordinates[0],
              latitude: feature.geometry.coordinates[1],
            },
          })),
        ),
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const throttled = throttle(searchLocations, 1500, { leading: false, trailing: true });
  const throttledSearchLocations = (e: any) => {
    setSuggestions(initialLocations);
    setIsLoading(true);
    throttled(e);
  };

  useEffect(() => {
    if (props.onLocationChange) {
      props.onLocationChange(location.coordinates);
    }
  }, [location]);

  return (
    <Box>
      <Text ml="7" fontSize="small" display="flex" alignItems="start">
        {props.title}
      </Text>
      <Box d="flex" alignItems="center">
        <Box
          mr="2"
          cursor="pointer"
          onClick={chooseLocation.bind(null, LocationModeEnum.AUTO)}
          color={location.mode === LocationModeEnum.AUTO ? "blue.500" : undefined}
        >
          <BiCurrentLocation />
        </Box>
        <AutoComplete suggestWhenEmpty>
          <Box position="relative">
            <AutoCompleteInput
              variant="filled"
              onChange={throttledSearchLocations}
              placeholder={
                location.mode === LocationModeEnum.AUTO ? LocationModeEnum.AUTO : "Search Location"
              }
              value={location.mode === LocationModeEnum.AUTO ? "" : location.displayName}
            />
            {isLoading && <Spinner position="absolute" right="10px" top="12px" />}
          </Box>
          {!isLoading && (
            <AutoCompleteList>
              {suggestions.map((option, oid) => (
                <AutoCompleteItem
                  key={`option-${oid}`}
                  onClick={() => chooseLocation(option.name)}
                  value={option.name}
                  align="start"
                  display="flex"
                  alignItems="center"
                >
                  {option.icon}
                  <Text ml="1" fontSize="small" isTruncated>
                    {option.name}
                  </Text>
                </AutoCompleteItem>
              ))}
            </AutoCompleteList>
          )}
        </AutoComplete>
      </Box>
    </Box>
  );
};
