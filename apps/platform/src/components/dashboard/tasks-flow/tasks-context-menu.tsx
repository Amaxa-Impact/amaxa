"use client";

import { IconCopy, IconPlus, IconTrash } from "@tabler/icons-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@amaxa/ui/context-menu";

import type { ContextMenuState } from "./types";

interface TasksContextMenuProps {
  contextMenu: ContextMenuState;
  onClose: () => void;
  onAddTask: (position: { x: number; y: number }) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
}

export function TasksContextMenu({
  contextMenu,
  onClose,
  onAddTask,
  onDeleteTask,
  onDeleteEdge,
}: TasksContextMenuProps) {
  return (
    <div
      className="fixed z-50"
      style={{ left: contextMenu.x, top: contextMenu.y }}
    >
      <ContextMenu onOpenChange={(open) => !open && onClose()} open>
        <ContextMenuTrigger>
          <div className="h-0 w-0" />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          {contextMenu.nodeId ? (
            <>
              <ContextMenuItem onClick={onClose}>
                <IconCopy className="mr-2 h-4 w-4" />
                Duplicate Task
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => {
                  if (contextMenu.nodeId) {
                    onDeleteTask(contextMenu.nodeId);
                  }
                  onClose();
                }}
                variant="destructive"
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Delete Task
              </ContextMenuItem>
            </>
          ) : null}

          {!contextMenu.nodeId && contextMenu.edgeId ? (
            <ContextMenuItem
              onClick={() => {
                if (contextMenu.edgeId) {
                  onDeleteEdge(contextMenu.edgeId);
                }
                onClose();
              }}
              variant="destructive"
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete Connection
            </ContextMenuItem>
          ) : null}

          {contextMenu.nodeId || contextMenu.edgeId ? null : (
            <ContextMenuItem
              onClick={() => {
                onAddTask({ x: contextMenu.x, y: contextMenu.y });
                onClose();
              }}
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Add Task Here
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
