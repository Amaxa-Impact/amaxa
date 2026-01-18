import type { CursorPresenceData } from "@/components/dashboard/tasks-flow/types";
import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";

export interface PresenceData<D> {
  created: number;
  latestJoin: number;
  user: string;
  data: D;
  present: boolean;
}

const HEARTBEAT_PERIOD = 3000; // 3 seconds for faster presence detection
const CURSOR_UPDATE_THROTTLE = 50; // 50ms = 20 updates per second max

/**
 * usePresence is a React hook for reading & writing presence data.
 *
 * Uses Convex's real-time subscriptions for live updates.
 * Throttles cursor updates to prevent overwhelming the server.
 */
export const usePresence = (
  room: string,
  user: string,
  initialData: CursorPresenceData,
) => {
  const dataRef = useRef<CursorPresenceData>(initialData);
  const lastUpdateRef = useRef<number>(0);
  const pendingUpdateRef = useRef<CursorPresenceData | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const presence = useQuery(api.presence.list, { room });

  const othersPresence = presence
    ?.filter((p) => p.user !== user && p.present)
    .map((p) => ({
      ...p,
      data: p.data,
    })) as PresenceData<CursorPresenceData>[] | undefined;

  const updatePresenceMutation = useMutation(api.presence.update);
  const heartbeatMutation = useMutation(api.presence.heartbeat);

  useEffect(() => {
    void updatePresenceMutation({ room, user, data: initialData });

    return () => {
      /* empty */
    };
  }, [room, user, initialData, updatePresenceMutation]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void heartbeatMutation({ room, user });
    }, HEARTBEAT_PERIOD);

    return () => clearInterval(intervalId);
  }, [heartbeatMutation, room, user]);

  const updateData = useCallback(
    (patch: Partial<CursorPresenceData>) => {
      const newData = { ...dataRef.current, ...patch };
      dataRef.current = newData;

      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateRef.current;

      if (timeSinceLastUpdate >= CURSOR_UPDATE_THROTTLE) {
        lastUpdateRef.current = now;
        void updatePresenceMutation({ room, user, data: newData });
      } else {
        pendingUpdateRef.current = newData;

        timeoutRef.current ??= setTimeout(() => {
          if (pendingUpdateRef.current) {
            lastUpdateRef.current = Date.now();
            void updatePresenceMutation({
              room,
              user,
              data: pendingUpdateRef.current,
            });
            pendingUpdateRef.current = null;
          }
          timeoutRef.current = null;
        }, CURSOR_UPDATE_THROTTLE - timeSinceLastUpdate);
      }
    },
    [room, user, updatePresenceMutation],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [dataRef.current, othersPresence, updateData] as const;
};

export default usePresence;
