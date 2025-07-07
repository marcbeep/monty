import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex h-dvh">
      <div className="bg-primary hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <div className="mx-auto w-12 h-12 rounded-xl overflow-hidden bg-primary-foreground/10 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Monty Logo"
                width={32}
                height={32}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-5xl font-light">
                Welcome back
              </h1>
              <p className="text-primary-foreground/80 text-xl">
                Login to continue with Monty
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="text-foreground font-medium tracking-tight">
              Login to Monty
            </div>
            <div className="text-muted-foreground mx-auto max-w-xl">
              Welcome back to your AI-powered investment dashboard. Enter your
              credentials to continue.
            </div>
          </div>
          <div className="space-y-4">
            <LoginForm />
            <Button className="w-full" variant="outline">
              Continue with Google
            </Button>
            <p className="text-muted-foreground text-center text-xs font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
