"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      type="button"
      className="text-white bg-red-700 hover:bg-red-800 cursor-pointer p-2 rounded-lg"
    >
      SignOut
    </button>
  );
}
