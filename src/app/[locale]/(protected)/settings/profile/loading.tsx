import { Skeleton } from "@/components/ui/skeleton";

interface SettingsProfileLoadingProps {}

export default function SettingsProfileLoading({}: SettingsProfileLoadingProps) {
  return (
    <figure className="mx-auto flex max-w-xl flex-1 flex-col gap-8">
      <figure className="flex flex-col gap-1 py-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </figure>

      <figure className="flex flex-col gap-4">
        <Skeleton className="h-32" />

        <Skeleton className="h-32" />

        <Skeleton className="h-12" />
      </figure>
    </figure>
  );
}