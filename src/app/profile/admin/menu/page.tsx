import DisplayProduct from "@/components/DisplayProduct";
import { User2Icon } from "lucide-react";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { GoHome, GoListOrdered } from "react-icons/go";

export default function MenuPage() {
  return (
    <main className="flex min-h-screen flex-col w-screen items-center overflow-auto gap-7 px-2 py-4">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold bg-white text-center w-full p-2 rounded-lg shadow-md">
          Admin Menu Management
        </h1>
        <p className="text-gray-400 capitalize">Here you can manage Menu.</p>
      </div>
      <Link
        className="p-2 bg-blue-500 rounded-full shadow-md absolute right-[5dvw] top-[5dvh] "
        href={"/profile/admin/Home"}
      >
        <GoHome className="w-6 h-6 text-blue-300" />
      </Link>

      <div className="bg-blue-500 text-white p-2 rounded capitalize absolute top-17  transition-all duration-500 left-3">
        <Link href={"/profile/admin/orders"}>
          <GoListOrdered />
        </Link>
      </div>

      <div className="bg-blue-500 text-white p-2 rounded capitalize absolute top-5  transition-all duration-500 left-3">
        <Link href={"/profile/admin/users"}>
          <User2Icon />
        </Link>
      </div>

      <DisplayProduct />
    </main>
  );
}
