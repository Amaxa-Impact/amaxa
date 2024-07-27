import React from "react";

import { Button } from "@amaxa/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@amaxa/ui/dialog";

export default function PermissionsModal({
  projectId,
  userId,
  defaultPermissions,
}: {
  projectId: string;
  userId: string;
  defaultPermissions: string[];
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          View Permissions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          Permissions for {userId} in {projectId}
        </DialogHeader>
      </DialogContent>
      <div>
        {defaultPermissions.map((permission) => `Permission: ${permission}`)}
      </div>
    </Dialog>
  );
}
