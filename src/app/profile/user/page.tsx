// "use client";
import { auth } from "@/auth";
import { SessionProvider, useSession } from "next-auth/react";
import SignOutButton from "@/components/SignOutButton";
import UserHeader from "@/components/UserHeader";
import OrderDo from "@/components/OrderDo";
import { Ban, Clock, Lock, PauseCircle, Power, ShieldClose, ShieldOff } from "lucide-react";

export default async function Profile() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center py-4">
      {session?.user.isTwoStepEnabled ? (
        <>
          <header className="w-[100dvw] h-[10dvh] flex items-center justify-center p-2 bg-white rounded-b-lg shadow-md mb-3">
            <SessionProvider>
              <UserHeader />
            </SessionProvider>
          </header>
          <p className="capitalize text-red-400">
            Please do order step by step
          </p>
          <section className="flex flex-col justify-center items-center gap-7">
            <OrderDo />
            <div className="p-4 flex justify-center bg-red-100 w-[80%] rounded-lg shadow shadow-red-600 border-x-1 border-red-500 border-b-3 border-t-2">
              <SignOutButton />
            </div>
          </section>
        </>
      ) : (
        <>
         <header className="w-[100dvw] h-[10dvh] flex items-center justify-center p-2 bg-white rounded-b-lg shadow-md mb-3">
            <SessionProvider>
              <UserHeader />
            </SessionProvider>
          </header>
          <div className="h-[90dvh] w-screen bg--700 flex flex-col items-center justify-center">
            {/* <PauseCircle className="w-full h-[70%] text-red-300"/>
            <Power className="w-full h-[70%] text-red-300"/>
            <Lock className="w-full h-[70%] text-red-300"/> */}
            <ShieldOff className="w-full h-[70%] text-red-300"/>
            {/* <Ban className="w-full h-[70%] text-red-300"/>
            <Clock className="w-full h-[70%] text-red-300"/> */}
            <h1 className="text-5xl font-bold text-red-700 mb-7">You Are Off Duty</h1>
            <SignOutButton/>
          </div>
        </>
      )}
    </main>
  );
}
