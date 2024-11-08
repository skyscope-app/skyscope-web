import { getProfile } from "@/lib/profile";
import { SetUserIdServerComponent } from "@logsnag/next";
import { ReactNode } from "react";
import { Map } from "./_components/map";
import { MapFooter } from "./_components/map/map-footer";
import { MobileSidebar } from "./_components/mobile-sidebar";
import { Sidebar } from "./_components/sidebar";
import { Spotlight } from "./_components/spotlight";

interface AppRootLayoutProps {
  children: ReactNode;
}

export default async function AppRootLayout({ children }: AppRootLayoutProps) {
  const user = await getProfile();

  return (
    <div className="relative flex h-screen w-screen flex-col justify-end md:flex-row md:justify-normal">
      <Spotlight />
      <Sidebar user={user} />
      <SetUserIdServerComponent userId={user?.id ?? null} />

      {children}

      <Map
        userIntegrations={{
          ivaoId: user?.ivaoId,
          vatsimId: user?.vatsimId,
        }}
      >
        <MapFooter />
      </Map>

      <MobileSidebar />
    </div>
  );
}
