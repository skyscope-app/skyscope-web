import { LiveFlight } from "@/types/live-flights";
// @ts-expect-error - FIXME: @turf types are not working...
import { point } from "@turf/helpers";

export function liveFlightToGeoJson(data: LiveFlight[]): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
  const features = data.map((flight) => point(flight.currentPosition.coordinates, flight, { id: flight.id }))

  return {
    type: "FeatureCollection",
    features,
  }
}