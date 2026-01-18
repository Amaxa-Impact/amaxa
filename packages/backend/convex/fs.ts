import { ConvexFS } from "convex-fs";

import { components } from "./_generated/api";

export const fs = new ConvexFS(components.fs, {
  storage: {
    type: "bunny",
    apiKey: process.env.BUNNY_API_KEY!,
    storageZoneName: process.env.BUNNY_STORAGE_ZONE!,
    region: process.env.BUNNY_REGION,
    cdnHostname: process.env.BUNNY_CDN_HOSTNAME!, // e.g., "myzone.b-cdn.net"
    tokenKey: process.env.BUNNY_TOKEN_KEY,
  },
});
