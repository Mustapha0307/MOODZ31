import { auth } from "@/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function HomePage() {

  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-2">
      <h1 className="text-3xl font-bold py-3 bg-white px-2 w-[92dvw] rounded text-center text-slate-600 shadow">Admin Home Page</h1>
      <p className="text-gray-400 font-bold text-xl capitalize">Welcome {session?.user.name} to your dashboard!</p>
      <div className="flex flex-col gap-y-12 mt-8">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-xl hover:shadow-md focus:shadow-md shadow-blue-400">
          <a href="/profile/admin/users" className="">
            Manage Users
          </a>
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow-xl hover:shadow-md focus:shadow-md shadow-green-400">
          <a href="/profile/admin/orders" className="">
            Manage Orders
          </a>
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 shadow-xl hover:shadow-md focus:shadow-md shadow-orange-400">
          <a href="/profile/admin/menu" className="">
            Manage Menu
          </a>
        </button>
      </div>
      <div className="m-auto bg-white shadow-lg p-6 rounded-lg shadow-gray-300 ">
        <SignOutButton />
      </div>
    </main>
  );
}
