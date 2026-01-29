"use client";

import { useState } from "react";
import { useAuthFromAuthKit } from "@/components/convex-client-provider";
import { env } from "@/env";
import { Authenticated, Unauthenticated, useAction } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";

function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const commitFile = useAction(api.files.commitFile);
  const identity = useAuthFromAuthKit();

  // Derive the .site URL from your Convex URL
  const siteUrl = env.NEXT_PUBLIC_CONVEX_URL.replace(/\.cloud$/, ".site");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const accessToken = await identity.fetchAccessToken();
      if (!accessToken) throw new Error("Not authenticated");
      const res = await fetch(`${siteUrl}/fs/upload`, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${accessToken}`,
        },
        body: file,
      });

      const { blobId } = await res.json();

      // 2. Commit the file to a path
      await commitFile({
        blobId,
        filename: file.name,
      });
      alert("Upload complete!");
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };
  return <input type="file" onChange={handleUpload} disabled={uploading} />;
}

export default function Page() {
  return (
    <>
      <Authenticated>
        <FileUpload />
      </Authenticated>
      <Unauthenticated>
        <p>Please log in to upload files.</p>
      </Unauthenticated>
    </>
  );
}
