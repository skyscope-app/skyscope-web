"use client";

import { MAPBOX_ACCESS_TOKEN } from "@/config/map";
import {
  getAirportsLayer,
  getBaseMapUrl,
  getMapCursor,
  getNetworkATCsLayer,
  getNetworkFlightsLayer,
  getSelectedFlightPathLayer,
  getTooltipContentBasedOnLayer,
} from "@/lib/map";
import { useBaseMapStore } from "@/stores/base-map-store";
import { useMapViewStateStore } from "@/stores/map-view-state-store";
import "@/styles/map.css";
import { UserProfile } from "@/types/profile";
import { DeckGL } from "deck.gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ReactNode, useState } from "react";
import BaseMap from "react-map-gl";
import { MapSkeleton } from "./map-skeleton";
import { MapToolbar } from "./map-toolbar";

export type UserIntegrations = {
  ivaoId: UserProfile["ivaoId"];
  vatsimId: UserProfile["vatsimId"];
};

interface MapProps {
  children?: ReactNode;
  userIntegrations: UserIntegrations;
}

export function Map({ children, userIntegrations }: MapProps) {
  const { baseMap } = useBaseMapStore();
  const [isMapLoading, setIsMapLoading] = useState(true);
  const { viewState } = useMapViewStateStore();

  const layers = [
    getNetworkATCsLayer({
      userIntegrations,
    }),
    getSelectedFlightPathLayer({
      userIntegrations,
    }),
    getNetworkFlightsLayer({
      userIntegrations,
    }),
    getAirportsLayer(),
  ];

  return (
    <>
      <figure
        className="absolute inset-0 flex h-full w-full"
        onContextMenu={(event) => event.preventDefault()}
      >
        <MapSkeleton isMapLoading={isMapLoading} />
        <MapToolbar />
        <DeckGL
          pickingRadius={10}
          controller={{
            doubleClickZoom: false,
          }}
          getTooltip={getTooltipContentBasedOnLayer}
          initialViewState={viewState}
          layers={layers}
          getCursor={getMapCursor}
        >
          <BaseMap
            attributionControl={false}
            reuseMaps={true}
            mapStyle={getBaseMapUrl(baseMap)}
            antialias={true}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            onLoad={() => setIsMapLoading(false)}
          />
          {children}
        </DeckGL>
      </figure>
    </>
  );
}