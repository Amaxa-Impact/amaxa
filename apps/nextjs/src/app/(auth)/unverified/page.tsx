/** eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@amaxa/ui/button";

import { checkAuth } from "~/lib/auth";

export default async function Component() {
  const auth = await checkAuth();

  if (auth?.user.status === "Unverified" || auth?.user.status === "Pending") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-neutral-900">
        <div className="w-full max-w-md space-y-8 text-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/undraw_pending_approval_xuu9-SijgfHAu6eaJd2HZssLqinPtdimNF9.svg"
            alt="Pending Approval Illustration"
            className="mx-auto h-64 w-64"
          />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Hang tight!
          </h1>
          {/* j */}
          <p className="text-lg text-gray-100 dark:text-gray-600">
            Your account is currently under review. We'll notify you once it's
            approved.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-200 dark:text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Estimated wait time: 24-48 hours</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-neutral-900">
      <div className="w-full max-w-md space-y-8 text-center">
        <img
          src="/veri.svg"
          alt="Approved Illustration"
          className="mx-auto h-64 w-64"
        />
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Your account is approved!
        </h1>
        <p className="text-lg  text-gray-600 dark:text-gray-100">
          Your account is now approved and you can start using Amaxa.
        </p>
        <div className="pt-4">
          <Link href="/" className={buttonVariants({ variant: "primary" })}>
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
