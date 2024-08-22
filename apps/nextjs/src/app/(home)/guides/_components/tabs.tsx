import React from "react";

import { Tabs, TabsTrigger } from "~/components/route-tabs";

export function GuidesTabs() {
  return (
    <div>
      <Tabs defaultValue="" baseUrl="/guides">
        <TabsTrigger value="action-guides">Action Guides</TabsTrigger>
        <TabsTrigger value="funds">Fundraising Guides</TabsTrigger>
      </Tabs>
    </div>
  );
}
