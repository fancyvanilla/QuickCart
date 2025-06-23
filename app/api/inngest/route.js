import { serve } from "inngest/next";
import { createUserOrderEvent, inngest } from "@/config/innges";
import { syncUserCreationEvent, syncUserDeletionEvent, syncUserUpdateEvent } from "@/config/innges";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreationEvent,
    syncUserUpdateEvent,
    syncUserDeletionEvent,
    createUserOrderEvent
  ],
});
