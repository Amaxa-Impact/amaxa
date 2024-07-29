import { signIn } from "@amaxa/auth"
import { Button } from "@amaxa/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@amaxa/ui/card"
import { Input } from "@amaxa/ui/input"
import { Label } from "@amaxa/ui/label"
import Link from "next/link"
import { env } from "~/env"


export default function LoginForm() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {
              env.NODE_ENV === "development" ? (
                <>

                  <form
                    action={async (data) => {
                      "use server"
                      await signIn("email", {
                        password: data.get("password"),
                        redirectTo: "/"
                      })
                    }}
                  >
                    <div className="gap-4 flex flex-col">
                      <Label htmlFor="password"> Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </form>
                </>
              ) : null
            }

            <form
              action={async (data) => {
                "use server"
                await signIn("google", { redirectTo: "/" })
              }}
            >
              <Button variant="outline" className="w-full" type="submit">
                Login with Google
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
  )
}
