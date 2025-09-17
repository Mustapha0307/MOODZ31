"use client";
import { ActiveAccountAction, DeleteAccountAction, RegisterAction, UnactiveAccountAction } from "@/actions/auth.action";
import Alert from "@/components/Alert";
import HeaderUser from "@/components/HeaderUser";
import Spinner from "@/components/Spinner";
import { RegisterSchema } from "@/utils/validationSchemas";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, CircleSlash, RefreshCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { GoListOrdered } from "react-icons/go";

export default function UserPage() {
  const [active, setActive] = useState(false);
  const [user, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [clientError, setClientError] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const user = { name, email, password };
    const validation = RegisterSchema.safeParse(user);
    if (!validation.success)
      return setClientError(validation.error.errors[0].message);

    setLoading(true);
    RegisterAction(user)
      .then((result) => {
        if (result.success) {
          setName("");
          setEmail("");
          setPassword("");
          setClientError("");
          setServerError("");
          setServerSuccess(result.message);
          toast.success(result.message);
        }
        if (!result.success) {
          setServerSuccess("");
          setServerError(result.message);
          toast.error(result.message);
        }
        setServerSuccess("")
        setLoading(false);
        setActive(false);
        fetchUsers();
      })
      .catch(() => {
        setLoading(false);
        setServerError("Something went wrong");
        toast.error("Something went wrong");
      });
  };
   const activeAccount = async (userId: string)=> {
    try {
      await ActiveAccountAction(userId);
      toast.success("Account activated successfully");
      await fetchUsers();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
   const unactiveAccount = async (userId: string)=> {
    try {
      await UnactiveAccountAction(userId);
      toast.success("Account unactivated successfully");
      await fetchUsers();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
   const deleteUser = async (userId: string)=> {
     const Confirm = confirm("Are You Sur To DELETED this user !?");
    if (!Confirm) return;
    try {
      await DeleteAccountAction(userId).then((result) => {
        if (result.success) {
          toast.success(result.message);
          fetchUsers();
        }
        if (!result.success) {
          toast.error(result.message);
        }
      });
    } catch (err) {
      return { sucess: false, message: "There's problem try again" };
    }
  }

  return (
    <main className="flex min-h-screen flex-col w-screen items-center gap-7 px-2 py-4">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold bg-white text-center w-full py-2 px-7 rounded-lg shadow-md">
          Admin User Management
        </h1>
        <p className="text-gray-400 capitalize">Here you can manage users.</p>
      </div>
       <header className="w-full flex flex-col justify-between items-center p-4 bg-white rounded-lg shadow-md">
      <button className="p-2 bg-blue-500 rounded-full shadow-md absolute right-[5dvw] top-[5dvh] " onClick={()=>fetchUsers()}><RefreshCcw className="w-6 h-6 text-blue-300"/></button>
      <div className="w-full flex justify-around items-center mb-4">
        <div className="flex flex-col items-center bg-green-500 p-4 rounded-lg">
          <h2 className="font-semibold text-green-100">Users Active</h2>
          <p className="text-green-300 font-bold">{user.filter((user:any)=> user.isTwoStepEnabled === true).length}</p>
        </div>
        <div className="flex flex-col items-center bg-red-500 p-4 rounded-lg">
          <h2 className="font-semibold text-red-100">Users Unactive</h2>
          <p className="text-red-300 font-bold">{user.filter((user: any)=> user.isTwoStepEnabled === false).length}</p>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center">
        <button
          className=" px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 cursor-pointer"
          onClick={() => setActive(true)}
        >
          Add New User
        </button>
        <h2 className="h-full flex items-center gap-0.5 w-full text-gray-400 justify-end">
          Users:{" "}
          <small className="h-full text-blue-500 flex items-end justify-center mt-1 font-bold text-md">
            {user.length}
          </small>
        </h2>
      </div>
    </header>
      <div className="max-h-[60dvh] rounded-lg shadow-md p-2 bg-white">

      <div className="overflow-x-auto overflow-y-hidden w-full">
        <table className=" px-1 py-2 flex text-sm text-left w-[96dvw]">
          <thead className="bg-gray-100 rounded-full text-center text-slate-600 w-full font-bold uppercase tracking-wider px-1 py-2">
            <tr className="flex  items-center justify-center">
              <td className="px-4 py-3 w-2.5 ">#</td>
              <td className="px-4 py-3 w-[40dvw]">Name </td>
              <td className="px-4 py-3 w-[22dvw]">Active</td>
              <td className="px-4 py-3 w-[22dvw]">Delete</td>
            </tr>
          </thead>
        </table>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[40dvh] w-full">
        <table className="overflow-y-auto px-1 py-2 w-[96dvw]">
          <tbody className="divide-y max-h-[50dvh] divide-gray-200 bg-white px-1 py-2 rounded-md gap-2 flex flex-col">
            {user.map((user: any, index: number) => (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 text-center flex items-center justify-center shadow-sm rounded-lg ${user.isTwoStepEnabled ? "bg-green-50 order-0" : "bg-orange-50 order-1"}`}
              >
                <td className="px-4 py-3 w-2.5 font-medium">{index + 1}</td>
                <td className="px-4 py-3 w-[40dvw] cursor-pointer hover:text-blue-700">
                  {user.name}
                </td>
                <td className="px-4 py-3 w-[22dvw]">
                  <button
                    className={`text-2xl font-bold p-1 rounded-full ${user.isTwoStepEnabled ? "text-green-500 bg-green-200" : "text-orange-500 bg-orange-200"}`}
                    onClick={()=> user.isTwoStepEnabled ? unactiveAccount(user.id) : activeAccount(user.id)}
                    >
                    {user.isTwoStepEnabled ? <CheckCircle /> : <CircleSlash />}
                  </button>
                </td>
                <td className="px-4 py-3 w-[22dvw]">
                  <button className="text-2xl font-bold p-1 rounded-full text-red-500 bg-red-"
                  onClick={()=> deleteUser(user.id)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      {active && (
        <div className="w-[96dvw] flex flex-col items-center z-1 absolute top-[25dvh] justify-center gap-4">
          <div className="w-full bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">Add New User</h2>
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={formSubmitHandler}
            >
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border border-gray-300 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <div className="w-full flex flex-col items-center justify-center gap-4">
                {(clientError || serverError) && (
                  <Alert type="error" message={clientError || serverError} />
                )}
                {serverSuccess && (
                  <Alert type="success" message={serverSuccess} />
                )}
                {loading ? (
                  <Spinner />
                ) : (
                  <div className="w-full flex gap-2">
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-500"
                    >
                      Add User
                    </button>
                    <button
                      type="button"
                      className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-500"
                      onClick={() => setActive(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-blue-500 text-white p-2 rounded capitalize absolute top-5  transition-all duration-500 left-3">
        <Link href={"/profile/admin/orders"}><GoListOrdered/></Link>
      </div>
    </main>
  );
}
