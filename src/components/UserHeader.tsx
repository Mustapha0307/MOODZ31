import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";


export default async function UserHeader() {
    const session = await auth();
  return (
    <header>
      <h1 className="text-3xl text-center font-bold ">Welcome {session?.user.name}</h1>
        <p className="text-sm text-center  text-slate-500  capitalize">
        please sign out when you are done
        </p>
    </header>
  );
}