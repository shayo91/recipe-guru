import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Edit Profile
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Update your profile information
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <EditProfileForm profile={profile} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

