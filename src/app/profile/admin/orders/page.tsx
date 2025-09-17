"use client";
import { CanceledOrderAction, ReadyOrderAction, ServeredOrderAction } from "@/actions/order.Action";
import { RefreshCcw, User2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoHome } from "react-icons/go";

export default function OrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const fetchorders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    console.log("API data: ", data);
    setOrders(data);
  };
  useEffect(() => {
    fetchorders();
  }, []);

  const readyOrder = async(orderId: string)=>{
    try {

      await ReadyOrderAction(orderId).then((res) => {
        if (res.success) {
          toast.success(res.message);
          fetchorders();
        }
      });
      
    } catch (error) {
      toast.error("Somthing wrong")
    }
  }
  
  const serveredOrder = async(orderId: string)=>{
    try {

      await ServeredOrderAction(orderId).then((res) => {
        if (res.success) {
          toast.success(res.message);
          fetchorders();
        }
      });
      
    } catch (error) {
      toast.error("Somthing wrong")
    }
  }
  
  const canceledOrder = async(orderId: string)=>{
    const Confirm = confirm("Are You Sur to Canceled")
    if(!Confirm) return
    try {

      await CanceledOrderAction(orderId).then((res) => {
        if (res.success) {
          toast.success(res.message);
          fetchorders();
        }
      });
      
    } catch (error) {
      toast.error("Somthing wrong")
    }
  }


  const orderMap = orders.filter((order) => order.status === "IN_PROGRESS" || order.status === "READY")
  const orderWait = orders.filter((order) => order.status === "IN_PROGRESS");
  const orderCanceled = orders.filter((order) => order.status === "CANCELED");
  const orderServerd = orders.filter((order) => order.status === "SERVERED");

  return (
    <main className="flex min-h-screen flex-col w-screen items-center overflow-auto gap-7 px-2 py-4">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold bg-white text-center w-full p-2 rounded-lg shadow-md">
          Admin Order Management
        </h1>
        <p className="text-gray-400 capitalize">Here you can manage orders.</p>
      </div>
      <header className="w-full flex flex-col justify-between items-center p-4 bg-white rounded-lg shadow-md">
        <Link
          className="p-2 bg-blue-500 rounded-full shadow-md absolute right-[5dvw] top-[5dvh] "
          href={"/profile/admin/Home"}
        >
          <GoHome className="w-6 h-6 text-blue-300" />
        </Link>
        <div className="w-full flex justify-around gap-2 items-center mb-4">
          <div className="flex flex-col items-center bg-green-500 p-4 rounded-lg">
            <h2 className="font-semibold text-green-100"> Delivred</h2>
            <p className="text-green-300 font-bold">
              {orderServerd.length}
            </p>
          </div>
          <div className="flex flex-col items-center bg-orange-500 p-4 rounded-lg">
            <h2 className="font-semibold text-orange-100"> Waiting</h2>
            <p className="text-orange-300 font-bold">{orderWait.length}</p>
          </div>
          <div className="flex flex-col items-center bg-red-500 p-4 rounded-lg">
            <h2 className="font-semibold text-red-100"> Canceled</h2>
            <p className="text-red-300 font-bold">{orderCanceled.length}</p>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center">
          <div className="flex flex-col items-center bg-blue-500 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-100">All Orders</h2>
            <p className="text-blue-300 font-bold">{orders.length}</p>
          </div>
        </div>
      </header>

      <div className="mt-3 max-h-screen min-h-[58dvh] bg-white w-full rounded-md shadow p-4 grid md:grid-cols-3 grid-cols-1 gap-x-7 gap-y-4 items-start overflow-auto">
        {orderMap.map((order) => (
          <div key={order.id} className="max-h-[70dvh] min-h-[50dvh] bg-gray-100 w-full flex flex-col gap-3 py-2 px-4 rounded-md overflow-hidden shadow-md mb-4 ">
            <h2 className="h-[7dvh] w-full bg-white flex rounded ring-2 ring-inset ring-gray-300 items-center justify-center text-slate-700 font-bold text-3xl">
              Table {order.table.number}
            </h2>
            <div className=" min-h-[20dvh] max-h-[40dvh] p-2 w-full bg-white rounded ring-1 ring-inset flex flex-col overflow-y-hidden ring-gray-300">
              <div className="flex justify-between bg-gray-600 rounded-lg mb-1 text-white p-2 gap-2">
                <span>QTY</span>
                <span>Name</span>
                <span>Product</span>
              </div>
              <div className="min-h-[20dvh] max-h-[30dvh] overflow-y-auto">
              {order.items.map((items: any) => (
                <>
                  <div key={items.id} className="flex justify-between p-2 gap-2 bg-green-800/30 rounded-lg mb-2  text-slate-700">
                    <span>{items.qty}</span>
                    <span>{items.product.nama}</span>
                    <span>{items.unitCents}</span>
                  </div>
                </>
              ))}
              </div>
              {order.notes && (
                <span className="mt-1 bg-orange-400/30 w-full text-orange-700 p-1 rounded-sm flex flex-col items-center justify-center ">
                  <strong className="text-center text-orange-500">
                    Note
                    <br />
                  </strong>
                  {order.notes}
                </span>
              )}
            </div>
            <p className=" flex  justify-around  text-slate-700">
              <span>
                <strong>Total: </strong>
                <small className="text-green-400">{order.totalCents}</small>
              </span>
              <span>
                <strong>From Waiter: </strong>
                <small className="text-green-400 ms-0">
                  {order.waiter.name}
                </small>
              </span>
            </p>

            {order.status === "IN_PROGRESS" && (
              <button className="flex bg-green-600 py-2 px-4 w-max rounded text-green-50 self-center " onClick={()=>readyOrder(order.id)}>
                Ready
              </button>
            )}
            {order.status === "READY" && (
              <div className="w-full p-2 flex items-center justify-around">
                <button className="flex bg-green-600 py-2 px-4 w-max rounded text-green-50 self-center "  onClick={()=>serveredOrder(order.id)}>
                  Servred
                </button>
                <button className="flex bg-red-600 py-2 px-4 w-max rounded text-red-50 self-center"  onClick={()=>canceledOrder(order.id)}>
                  Canceled
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-blue-500 text-white p-2 rounded capitalize absolute top-5  transition-all duration-500 left-3">
        <Link href={"/profile/admin/users"}>
          <User2Icon />
        </Link>
      </div>
    </main>
  );
}
