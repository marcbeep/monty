import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-secondary">
      <div className="w-full max-w-md">
        <Card className="bg-surface-primary border-0 shadow-lg">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-16 h-16 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Monty Logo"
                width={48}
                height={48}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-light text-foreground tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Sign in to your Monty account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginForm />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
