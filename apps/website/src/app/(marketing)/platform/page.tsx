import React from "react";

import { BeamSection } from "~/components/platform/beam-section";
import PlatformHero from "~/components/platform/platform-hero";
import { SphereMask } from "~/components/platform/sphere-mask";

export default function Page() {
  return (
    <div>
      <PlatformHero />
      <SphereMask />
      <BeamSection />
    </div>
  );
}
