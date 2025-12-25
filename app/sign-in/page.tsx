import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-6 sm:px-8">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Sign In
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back to Recipe Guru
            </p>
          </div>
          <SignInForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

