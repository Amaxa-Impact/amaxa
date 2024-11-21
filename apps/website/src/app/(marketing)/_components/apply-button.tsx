import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

import { Button } from "@amaxa/ui/button";

export function ApplyButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleClick() {
    let url = window.origin + pathname;
    if (searchParams.toString()) {
      url = url + `?${searchParams.toString()}`;
    }
    posthog.capture("apply_button_clicked", {
      current_url: url,
    });
    router.push("https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F");
  }

  return (
    <a>
      <Button className="h-12 px-5" onClick={handleClick}>
        Apply now
      </Button>
    </a>
  );
}
