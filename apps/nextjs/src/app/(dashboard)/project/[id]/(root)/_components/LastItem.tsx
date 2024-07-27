"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";

import { captilize } from "~/lib/utils";

function GetLastBreadCrumb(props: { id: string }) {
  const { id } = props;
  const pathname = usePathname();
  let ending = pathname[-1];

  if (!ending || ending === id) {
    ending = "Overview Page";
  }

  return <div>{captilize(ending)}</div>;
}

export default memo(GetLastBreadCrumb);
