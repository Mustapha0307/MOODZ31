"use client"

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
type Provider = "github" | "google";

export default function SocialProviders(){

    const socialHandler = (provider: Provider) =>{
        signIn(provider, { redirectTo: "/profile"})
    };
    return(
            <div className="flex items-center justify-center gap-6 mt-6">
            <div className="border bg-blue-100 hover:bg-blue-200 rounded px-4 py-4 cursor-pointer w-12 flex justify-center items-center">
                <FcGoogle onClick={() => socialHandler('google')} className="text-4xl"/>
            </div>
             <div className="border bg-slate-100 hover:bg-slate-200 rounded px-4 py-4 cursor-pointer w-12 flex justify-center items-center">
                <FaGithub onClick={() => socialHandler('github')} className="text-4xl"/>
            </div>
        </div>
    )
}