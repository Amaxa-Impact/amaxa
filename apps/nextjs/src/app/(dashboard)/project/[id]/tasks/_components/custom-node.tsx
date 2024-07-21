"use client"
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Avatar, AvatarFallback, AvatarImage } from "@amaxa/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@amaxa/ui/popover";
import { NodeType } from "~/lib/types/flowcart";
import { ChangeStatus } from "./change-status";

const getCardClassName = (status: string) => {
  switch (status) {
    case "done":
      return "opacity-95 border-green-600 bg-green-200 text-gray-700";
    case "canceled":
      return "opacity-95 border-red-600 bg-red-100 text-gray-600";
    default:
      return null;
  }
};

const TaskNode = ({ data, isConnectable }: NodeProps<NodeType>) => {
  const authorInitials = data.assigne.name
    ?.split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
      />
      <Card className={`${getCardClassName(data?.status!)} min-w-[200px]`}>
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-2">
            <p>{data.title}</p>
            <p>&#8226;</p>
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col">
                <div className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{authorInitials}</AvatarFallback>
                  </Avatar>
                  <p className="text-xl font-bold">{data.assigne.name}</p>
                </div>
              </PopoverContent>
            </Popover>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex w-full flex-col">
          <ChangeStatus id={data.id} defaultValue={data.status} />
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ right: '-8px', top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
};

export default memo(TaskNode);
