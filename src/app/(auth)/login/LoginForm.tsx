"use client";
import { IoMdLogIn } from "react-icons/io";
import { useState } from "react";
import { LoginSchema } from "@/utils/validationSchemas";
import { loginAction } from "@/actions/auth.action";
import Alert from "@/components/Alert";
import Spinner from "@/components/Spinner";
import SocialProviders from "@/components/SocialProviders";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [clientError, setClientError] = useState("");
  const [serverError, setserverError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showTwoStep, setShowTwoStep] = useState(false);
  const [code, setCode] = useState("");

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success)
      return setClientError(validation.error.errors[0].message);

    setLoading(true);

    loginAction({ email, password })
      .then((result) => {
        if (result.success) {
          setClientError("");
          setserverError("");
          setServerSuccess(result.message || "");
          router.push("/profile/user")
          
        }
        
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setserverError("Something went wrong");
      });
  };

  return (
    <form onSubmit={formSubmitHandler}>
      {showTwoStep ? (
        <>
          <div className="flex flex-col mb-3">
            <label htmlFor="code" className="p-1 text-slate-500 font-blod">
              Two Factor Code
            </label>
            <input
              type="text"
              id="code"
              className="border border-slate-500 rounded-lg px-2 py-1 text-xl"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col mb-3">
            <label htmlFor="email" className="p-1 text-slate-500 font-blod">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-slate-500 rounded-lg px-2 py-1 text-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col mb-3">
            <label htmlFor="password" className="p-1 text-slate-500 font-blod">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-slate-500 rounded-lg px-2 py-1 text-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </>
      )}

      {(clientError || serverError) && (
        <Alert type="error" message={clientError || serverError} />
      )}
      {serverSuccess && <Alert type="success" message={serverSuccess} />}
      <button
        type="submit"
        disabled={loading}
        className="disabled:bg-gray-300 flex items-center justify-center bg-slate-800 hover:bg-slate-900 mt-4 text-white cursor-pointer rounded-lg w-full p-2 text-xl"
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <IoMdLogIn className="me-1 text-2xl" />
            {showTwoStep ? "Confirm the code" : "Login"}
          </>
        )}
      </button>

    </form>
  );
}
