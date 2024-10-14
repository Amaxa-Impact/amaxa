import { Loader2 } from "lucide-react";

import { Button } from "@amaxa/ui/button";

export default function Component() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/undraw_pending_approval_xuu9-SijgfHAu6eaJd2HZssLqinPtdimNF9.svg"
          alt="Pending Approval Illustration"
          className="mx-auto h-64 w-64"
        />
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Hang tight!
        </h1>
        <p className="text-lg text-gray-600">
          Your account is currently under review. We'll notify you once it's
          approved.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Estimated wait time: 24-48 hours</span>
        </div>
      </div>
    </div>
  );
}
