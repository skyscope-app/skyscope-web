import { env } from "@/env";

export const IS_IN_DEVELOPMENT = env.NEXT_PUBLIC_NODE_ENV === "development";
export const BUILD_VERSION = "v1.45.2 beta";
