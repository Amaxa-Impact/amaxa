import type { Metadata } from "next";

import { UploadTestClient } from "./upload-test-client";

export const metadata: Metadata = {
  title: "Upload Test",
  description: "Internal file upload test page",
};

export default function UploadTestPage() {
  return <UploadTestClient />;
}
