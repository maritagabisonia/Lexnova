import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Register</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Create a student account to register for programs.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </section>
  );
}
