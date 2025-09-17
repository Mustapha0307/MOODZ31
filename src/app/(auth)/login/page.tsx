import Link from "next/link";
import React from "react";
import LoginForm from "./LoginForm";

export default function LoginPage(){
    return(
        <section className="w-screen h-screen flex flex-col justify-center items-center  gap-4 p-2">
            <div className="bg-white shadow-md rounded-md p-5">
                <h1 className="font-bold text-3xl text-slate-700 mb-5 text-center">
                    Sign in to your account
                </h1>
                <LoginForm/>
            </div>
        </section>
    )
}