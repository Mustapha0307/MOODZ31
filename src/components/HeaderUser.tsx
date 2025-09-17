"use client";

import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeaderUser(setActive: any) {
  const [users, setUsers] = useState([]);
  const { active } = setActive;

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <header className="w-full flex flex-col justify-between items-center p-4 bg-white rounded-lg shadow-md">
      <button className="p-2 bg-blue-500 rounded-full shadow-md absolute right-[5dvw] top-[5dvh] " onClick={()=>fetchUsers()}><RefreshCcw className="w-6 h-6 text-blue-300"/></button>
      <div className="w-full flex justify-around items-center mb-4">
        <div className="flex flex-col items-center bg-green-500 p-4 rounded-lg">
          <h2 className="font-semibold text-green-100">Users Active</h2>
          <p className="text-green-300 font-bold">{users.filter((user:any)=> user.isTwoStepEnabled === true).length}</p>
        </div>
        <div className="flex flex-col items-center bg-red-500 p-4 rounded-lg">
          <h2 className="font-semibold text-red-100">Users Unactive</h2>
          <p className="text-red-300 font-bold">{users.filter((user: any)=> user.isTwoStepEnabled === false).length}</p>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center">
        <button
          className=" px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 cursor-pointer"
          onClick={() => active(true)}
        >
          Add New User
        </button>
        <h2 className="h-full flex items-center gap-0.5 w-full text-gray-400 justify-end">
          Users:{" "}
          <small className="h-full text-blue-500 flex items-end justify-center mt-1 font-bold text-md">
            {users.length}
          </small>
        </h2>
      </div>
    </header>
  );
}
