"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Handle, NodeProps, Position } from "reactflow";

import { Card, CardTitle } from "@amaxa/ui/card";

import { NodeData } from "./types";

const CustomNode = ({ id, data }: NodeProps<NodeData>) => {
  return (
    <>
      <Link href={`/task/${id}`}>
        <Card className="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
          <CardTitle className="flex">
            <div className="ml-2">
              <div className="text-lg font-bold">{data.title}</div>
              <div className="text-gray-500">{data.assigneName}</div>
            </div>
          </CardTitle>
        </Card>
      </Link>
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 bg-primary"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 bg-primary"
      />
    </>
  );
};

export default memo(CustomNode);
