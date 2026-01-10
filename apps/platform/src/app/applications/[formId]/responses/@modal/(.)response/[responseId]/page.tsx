"use client";

import { useParams } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import type { Id } from "@/convex/_generated/dataModel";
import { ResponseModal } from "../../../_components/response-modal";

export default function ResponseModalPage() {
  const { responseId, formId } = useParams<{
    responseId: Id<"applicationResponses">;
    formId: Id<"applicationForms">;
  }>();

  return (
    <Modal className="max-h-[85vh] w-[95vw] max-w-6xl overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ResponseModal formId={formId} responseId={responseId} />
    </Modal>
  );
}
