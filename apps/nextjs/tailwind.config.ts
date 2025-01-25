import { fontFamily } from "tailwindcss/defaultTheme";
import { withUt } from "uploadthing/tw";

import baseConfig from "@amaxa/tailwind-config/web";

export default withUt({
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
    },
  },
});
