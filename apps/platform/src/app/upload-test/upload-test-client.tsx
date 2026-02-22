"use client";

import { useState } from "react";
import { useAuthFromAuthKit } from "@/components/convex-client-provider";
import { env } from "@/env";
import { Authenticated, Unauthenticated, useAction } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";

interface UploadResponse {
  blobId: string;
}

function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const commitFile = useAction(api.files.commitFile);
  const identity = useAuthFromAuthKit();

  const siteUrl = env.NEXT_PUBLIC_CONVEX_URL.replace(/\.cloud$/, ".site");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const accessToken = await identity.fetchAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const response = await fetch(`${siteUrl}/fs/upload`, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${accessToken}`,
        },
        body: file,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const payload = (await response.json()) as UploadResponse;
      await commitFile({
        blobId: payload.blobId,
        filename: file.name,
      });

      alert("Upload complete!");
    } catch (error) {
      alert("Upload failed: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return <input disabled={uploading} onChange={handleUpload} type="file" />;
}

export function UploadTestClient() {
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
