import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAircraftImage } from "@/lib/flights";
import { cn } from "@/lib/utils";
import { getScopedI18n } from "@/locales/server";
import { Aircraft } from "@/types/live-flights";
import { AircraftCardImage } from "./aircraft-card-image";

interface AircraftCardProps {
  className?: string;
  data?: Aircraft;
}

export async function AircraftCard({ className, data }: AircraftCardProps) {
  const t = await getScopedI18n("flightDetails.aircraftDetails.aircraft");

  const aircraftImage = data?.registration
    ? await getAircraftImage(data.registration)
    : null;

  return (
    <Card className={cn("relative flex overflow-clip", className)}>
      <CardHeader className="z-10 w-full gap-0.5 bg-gradient-to-r from-background via-background/90 to-background/5 p-4 dark:from-background dark:via-background/95 dark:to-background/85">
        <CardTitle>
          {data?.icao || "TBN"} / {data?.wakeTurbulence || "TBN"}
        </CardTitle>
        <CardDescription>
          {data?.equipment || "TBN"} / {data?.transponderTypes}
        </CardDescription>

        <div className="mt-4 flex flex-col gap-0.5">
          <span className="text-sm text-accent-foreground">
            {data?.registration || "TBN"}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("registration")}
          </span>
        </div>
      </CardHeader>
      <AircraftCardImage data={aircraftImage} />
    </Card>
  );
}