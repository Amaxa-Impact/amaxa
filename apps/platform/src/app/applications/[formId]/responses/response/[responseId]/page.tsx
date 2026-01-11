import type { Id } from "@amaxa/backend/_generated/dataModel";

import { ResponseDetailPage } from "../../_components/response-detail-page";

export default async function ResponsePage({
  params,
}: {
  params: Promise<{
    formId: Id<"applicationForms">;
    responseId: Id<"applicationResponses">;
  }>;
}) {
  const { formId, responseId } = await params;
  return <ResponseDetailPage formId={formId} responseId={responseId} />;
}
