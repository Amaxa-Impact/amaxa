import { withAuth } from "@workos-inc/authkit-nextjs";

import { HomeClient } from "./_components/home-client";

export default async function HomePage() {
  await withAuth({
    ensureSignedIn: true,
  });

  return <HomeClient />;
}
