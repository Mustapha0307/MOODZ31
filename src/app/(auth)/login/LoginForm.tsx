"use client";
import { IoMdLogIn } from "react-icons/io";
import { useState } from "react";
import { LoginSchema } from "@/utils/validationSchemas";
import { loginAction } from "@/actions/auth.action";
import Alert from "@/components/Alert";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { auth } from "@/auth";

export default function LoginForm() {
  const router = useRouter();
  const { update } = useSession();

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
      .then(async (result) => {
        if (result.success) {
          setClientError("");
          setserverError("");
          setServerSuccess(result.message || "");

          // إعادة جلب session باش تتحدث
          await update();

          // بعد التحديث جيب session جديدة
          const newSession = await update();

          setTimeout(() => {
            console.log("Role: ", newSession?.user.role);
            if (newSession?.user.role === "USER") {
              router.replace("/profile/user");
            }
            if (newSession?.user.role === "ADMIN") {
              router.replace("/profile/admin/Home");
            }
          }, 2000);
        } else {
          setClientError(result.message || "Invalid credentials");
        }
      })
      .catch(() => {
        setserverError("Something went wrong front");
        setServerSuccess("");
      })
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 3000)
      );
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
