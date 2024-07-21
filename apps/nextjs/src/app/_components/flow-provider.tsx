"use client";

import React from "react";
import { ReactFlowProvider } from "@xyflow/react";

import { TooltipProvider } from "@amaxa/ui/tooltip";

import "reactflow/dist/style.css";


// wrapping with ReactFlowProvider is done outside of the component
function FlowProvider({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </TooltipProvider>
  );
}

export default FlowProvider;
