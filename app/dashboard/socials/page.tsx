import { auth } from "@clerk/nextjs/server";

export default async function SocialsPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-amber-100 to-indigo-200 p-10">
      <h1 className="text-4xl font-bold mb-4">Social Links</h1>
      <p className="text-slate-700">User ID: {userId}</p>
      <p className="mt-4">Social link forms will go here.</p>
    </div>
  );
}