import React from "react";
import Link from "next/link";

import { signOut } from "@amaxa/auth";
import { Button } from "@amaxa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";

export default function LoginForm() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button variant="outline" className="w-full" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            Have question&apos;s about how we use your data?{" "}
            <Link href="/data-privacy" className="underline">
              Read our privacy statement here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
