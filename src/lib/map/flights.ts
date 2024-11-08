import { UserIntegrations } from "@/app/[locale]/(map)/_components/map";
import {
  AIRCRAFT_SPRITE_ICON_MAPPING,
  FLIGHT_ICON_ACCENT_COLOR,
  FLIGHT_ICON_EMERGENCY_ACCENT_COLOR,
  FLIGHT_ICON_USER_ACCENT_COLOR,
  MAP_LAYERS,
  MAP_SPRITES,
} from "@/config/map";
import { FLIGHTS_REFETCH_INTERVAL_IN_MILLISECONDS } from "@/constants/api";
import { MapFilterKey, useMapFiltersStore } from "@/stores/map-filters-store";
import { useMapNetworkLayersStore } from "@/stores/map-network-layers-store";
import { useSelectedFlightStore } from "@/stores/selected-flight-store";
import { LiveFlight, LiveFlights } from "@/types/live-flights";
import { Network } from "@/types/networks";
import { useQuery } from "@tanstack/react-query";
import { IconLayer } from "deck.gl";
import { useRouter } from "next/navigation";
import { getNetworkFlights } from "../flights";
import {
  convertHeadingToAngle,
  hexToRGBAArray,
  isEmergencyTransponder,
} from "../utils";

interface getNetworkFlightsLayerProps {
  userIntegrations: UserIntegrations;
}

const isUserFlight = (
  network: Network,
  pilotId: LiveFlight["pilotId"],
  userIntegrations: UserIntegrations
) => {
  switch (network) {
    case "vatsim":
      return pilotId === userIntegrations.vatsimId;
    case "ivao":
      return pilotId === userIntegrations.ivaoId;
    default:
      return false;
  }
};

export const getIconBasedOnAircraftType = (flight: LiveFlight) => {
  const FALLBACK_AIRCRAFT_TYPE = "medium";
  const aircraftType = flight.aircraftType;
  return aircraftType?.toLowerCase() || FALLBACK_AIRCRAFT_TYPE;
};

export const getNetworkFlightsLayer = ({
  userIntegrations,
}: getNetworkFlightsLayerProps) => {
  const router = useRouter();
  const { isIvaoFlightsLayerVisible, isVatsimFlightsLayerVisible } =
    useMapNetworkLayersStore();
  const { selectedFlight } = useSelectedFlightStore();
  const { filters } = useMapFiltersStore();

  const { data: vatsimFlightsData } = useQuery({
    queryKey: ["vatsim-flights"],
    queryFn: () => getNetworkFlights("vatsim"),
    refetchInterval: FLIGHTS_REFETCH_INTERVAL_IN_MILLISECONDS,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: ivaoFlightsData } = useQuery({
    queryKey: ["ivao-flights"],
    queryFn: () => getNetworkFlights("ivao"),
    refetchInterval: FLIGHTS_REFETCH_INTERVAL_IN_MILLISECONDS,
    retry: 3,
    retryDelay: 1000,
  });

  const joinedData = [
    ...(vatsimFlightsData || []),
    ...(ivaoFlightsData || []),
  ] as LiveFlights;

  const isFiltered = (data: LiveFlight) => {
    const noActiveFilters = Object.values(filters).every(f => f.length === 0);

    if (noActiveFilters) return true;

    const activeFilters = Object.keys(filters).filter(
      f => filters[f as MapFilterKey].length > 0
    );

    const isCallsignInFilter = filters.callsign
      .map(f => data.callsign.toLowerCase().includes(f.toLowerCase()))
      .includes(true);

    const isOriginInFilter = filters.origin
      .map(f => data.departure?.toLowerCase().includes(f.toLowerCase()))
      .includes(true);

    const isDestinationInFilter = filters.destination
      .map(f => data.arrival?.toLowerCase().includes(f.toLowerCase()))
      .includes(true);

    const isAirportInFilter = filters.airport
      .map(
        f =>
          data.arrival?.toLowerCase().includes(f.toLowerCase()) ||
          data.departure?.toLowerCase().includes(f.toLowerCase())
      )
      .includes(true);

    const isAircraftTypeInFilter = filters.aircraft
      .map(f => data.aircraft?.toLowerCase().includes(f.toLowerCase()))
      .includes(true);

    const isRegistrationInFilter = filters.registration
      .map(f =>
        data.aircraftRegistration?.toLowerCase().includes(f.toLowerCase())
      )
      .includes(true);

    const isSquawkInFilter = filters.squawk
      .map(f => data.transponder.toLowerCase().includes(f.toLowerCase()))
      .includes(true);

    const isOriginOrDestinationOrAirportInFilter =
      isOriginInFilter || isDestinationInFilter || isAirportInFilter;

    const filterMatches = activeFilters.map(f => {
      switch (f) {
        case "callsign":
          return isCallsignInFilter;
        case "origin":
          return isOriginOrDestinationOrAirportInFilter;
        case "destination":
          return isOriginOrDestinationOrAirportInFilter;
        case "airport":
          return isOriginOrDestinationOrAirportInFilter;
        case "aircraft":
          return isAircraftTypeInFilter;
        case "registration":
          return isRegistrationInFilter;
        case "squawk":
          return isSquawkInFilter;
        default:
          return true;
      }
    });

    return filterMatches.every(f => f);
  };

  const shouldBeVisible = (data: LiveFlight) => {
    if (selectedFlight?.id === data.id) return false;

    switch (data.network) {
      case "vatsim":
        return isVatsimFlightsLayerVisible && isFiltered(data);
      case "ivao":
        return isIvaoFlightsLayerVisible && isFiltered(data);
    }
  };

  const getIconAccentColor = (data: LiveFlight) => {
    const opacity = shouldBeVisible(data) ? undefined : 0;
    const isEmergency = isEmergencyTransponder(data.transponder);

    const isUser = isUserFlight(data.network, data.pilotId, userIntegrations);

    if (isEmergency) {
      return hexToRGBAArray(FLIGHT_ICON_EMERGENCY_ACCENT_COLOR, opacity);
    } else if (isUser) {
      return hexToRGBAArray(FLIGHT_ICON_USER_ACCENT_COLOR, opacity);
    } else {
      return hexToRGBAArray(FLIGHT_ICON_ACCENT_COLOR[data.network], opacity);
    }
  };

  const handleClick = (d: any) => {
    const flight: LiveFlight = d.object;
    if (!flight) return;

    router.push(`/flights/${flight.id}?skipFlyTo=true`, {
      scroll: false,
    });
  };

  return new IconLayer({
    id: MAP_LAYERS.NETWORK_FLIGHTS_LAYER_ID,
    data: joinedData,
    iconAtlas: MAP_SPRITES.AIRCRAFT_ICONS,
    iconMapping: AIRCRAFT_SPRITE_ICON_MAPPING,
    getIcon: getIconBasedOnAircraftType,
    sizeUnits: "common",
    sizeMinPixels: 14,
    sizeMaxPixels: 32,
    sizeScale: 1,
    getPosition: (d: LiveFlight) => [d.lng, d.lat],
    getAngle: (d: LiveFlight) => convertHeadingToAngle(d.heading),
    billboard: false,
    getColor: getIconAccentColor,
    autoHighlight: true,
    pickable: true,
    onClick: handleClick,
  });
};
