"use client";

import { useQuery } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";

export default function Page() {
  const files = useQuery(api.files.getFileUrl, { path: "" });
  return (
    <div>
      <h1>File</h1>
    </div>
  );
}
