import React from "react";

import { BeamSection } from "~/components/beam-section";
import PlatformHero from "~/components/platform-hero";
import { SphereMask } from "~/components/sphere-mask";

export default function Page() {
  return (
    <div>
      <PlatformHero />
      <SphereMask />
      <BeamSection />
    </div>
  );
}
