import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RegisterForm } from "./_components/register-form";

export default function RegisterPage() {
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
                Create your account
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Join thousands of investors using Monty
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <RegisterForm />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
