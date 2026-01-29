import { withAuth } from "@workos-inc/authkit-nextjs";

import { HomeClient } from "./_components/home-client";

export default async function HomePage() {
  const { accessToken } = await withAuth({
    ensureSignedIn: true,
  });

  return <HomeClient token={accessToken} />;
}
