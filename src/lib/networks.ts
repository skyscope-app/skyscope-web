import {
  API_BASE_URL,
  FLIGHTS_REFETCH_INTERVAL_IN_SECONDS,
} from "@/constants/api";
import { LiveFlights } from "@/types/live-flights";

export async function getVatsimFlights(): Promise<LiveFlights | null> {
  const url = `${API_BASE_URL}/networks/vatsim/flights`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: FLIGHTS_REFETCH_INTERVAL_IN_SECONDS,
      tags: ["vatsim-live-flights"],
    },
  };

  const result = await fetch(url, options);
  const data = await result.json();

  if (result.status !== 200) {
    console.error("Error fetching Vatsim flights", data);
    return null;
  }

  return data;
}