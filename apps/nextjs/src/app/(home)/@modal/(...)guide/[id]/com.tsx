import React from "react";

import "react-notion/src/styles.css";

import type { BlockMapType } from "react-notion";
import { NotionRenderer } from "react-notion";

import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";

export const Com = async (props: { id: string }) => {
  const data = (await fetch(
    `https://notion-api.splitbee.io/v1/page/${props.id}`,
  ).then((res) => res.json())) as BlockMapType;

  return (
    <Card className="container mx-auto my-8 h-[750px] w-[1000px] items-start overflow-y-scroll px-4 md:px-6 lg:px-8">
      <CardHeader>
        <CardTitle className="text-3xl">Action Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <NotionRenderer blockMap={data} />
      </CardContent>
    </Card>
  );
};
