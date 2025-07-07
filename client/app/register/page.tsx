import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { RegisterForm } from "./_components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex h-dvh">
      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="text-foreground font-medium tracking-tight">
              Create your Monty account
            </div>
            <div className="text-muted-foreground mx-auto max-w-xl">
              Join thousands of investors who trust Monty with their portfolio
              management. Create your account to get started.
            </div>
          </div>
          <div className="space-y-4">
            <RegisterForm />
            <Button className="w-full" variant="outline">
              Continue with Google
            </Button>
            <p className="text-muted-foreground text-center text-xs font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

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
                Welcome to Monty!
              </h1>
              <p className="text-primary-foreground/80 text-xl">
                Your AI-powered investment companion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
