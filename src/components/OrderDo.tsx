"use client";

import {
  createOrderItemsAction,
  EditOrderAction,
  selectTableAction,
  ValidOrderAction,
} from "@/actions/order.Action";
import { ValidOrderSchema } from "@/utils/validationSchemas";
import {
  ArrowBigLeftDashIcon,
  EditIcon,
  Key,
  LucideRefreshCcw,
  MinusCircle,
  PlusCircle,
  Trash2,
  XCircle,
  XSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { set } from "zod";

export default function OrderDo() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [qty, setQty] = useState(1);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [validOrder, setValidOrder] = useState(true);
  const [validOrderN, setValidOrderN] = useState(true);
  const [orderID, setOrderID] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [tableId, setTableId] = useState("");
  const [showOrder, setShowOrder] = useState(false);
  const [colorLine, setColorLine] = useState<number | null>(null);
  const [showAction, setShowAction] = useState(false);

  const fetchorders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };
  useEffect(() => {
    fetchtables();
    fetchcategories();
    fetchorders();
    fetchproducts();
  }, []);

  const hasItems = orders.some(
    (o: any) => o.tableId === tableId && o.items.length === 0
  );

  const handlerIncrease = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handlerDecrease = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]:
        prev[productId] && prev[productId] > 1 ? prev[productId] - 1 : 0,
    }));
  };

  const handleSubmit = async (orderID: string) => {
    // هنا يخرج كل المنتجات المختارة مع الكميات
    const items = products
      .filter((p) => quantities[p.id] && quantities[p.id] > 0)
      .map((p) => ({
        productId: p.id,
        qty: quantities[p.id],
        unitCents: p.price,
      }));
      console.log("Order ID: ",orderID);

    await createOrderItemsAction(userId!, items, orderID).then((res) => {
      if (res?.success) {
        toast.success("Order Items successfully Add");
        setCategory(false);
        setSelectProduct(true);
        setQuantities({}); // Reset quantities after submission
        setValidOrder(false);
        fetchtables();
      }
      if (!res?.success) toast.error(res?.message || "Failed to submit order");
    });
  };

  const handleEditOrder = async (tableId: string) => {
    const orderEdit = orders.find(
      (o: any) => tableId === o.tableId && o.status === "NEW"
    );
    console.log(orderEdit.id);

    setShowOrder(true);

    if (!orderEdit) {
      return toast.error("No order Find Please Try Again");
    }

    toast.success("Order Find");
  };

  const showactiontoggle = (index: number) => {
    setColorLine(colorLine === index ? null : index);
    setShowAction(true);
  };

  // const editItemsOrder = async(itemsId: string, index: number)=>{
  //   setShowAction(;
  // }

  const [tables, setTables] = useState<any[]>([]);
  const [table, setTable] = useState(false);
  const [SelectTable, setSelectTable] = useState("");

  const fetchtables = async () => {
    // console.log("Clicked");
    const res = await fetch("/api/tables");
    const data = await res.json();
    // console.log("API data: ",data);
    setTables(data);
  };

  const refreshTables = () => {
    fetchtables();
    fetchcategories();
    fetchproducts();
    toast.success("Refreshed");
  };

  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchcategories = async () => {
    // console.log("Clicked");
    const res = await fetch("/api/category");
    const data = await res.json();
    console.log("API data: ", data);
    setCategories(data);
  };

  const [products, setProducts] = useState<any[]>([]);
  const [selectProduct, setSelectProduct] = useState(true);

  const fetchproducts = async () => {
    // console.log("Clicked");
    const res = await fetch("/api/products");
    const data = await res.json();
    console.log("API data: ", data);
    setProducts(data);
  };

  const selectTable = (tableId: string, TN: string) => {
    console.log("Selected table ID:", tableId);
    setTableId(tableId);
    setTable(true);
    setCategory(false);
    setSelectTable(TN);
    selectTableAction(tableId, userId).then((res) => {
      if (res?.success) {
        toast.success(res.message);
      }
    });
    fetchtables();
    // You can add more logic here, such as navigating to another page or updating state
  };

  const selectCategory = (categoryId: string) => {
    console.log("Selected category ID:", categoryId);
    setSelectedCategory(categoryId);
    setSelectProduct(false);

    setCategory(true);
    // You can add more logic here, such as navigating to another page or updating state
  };

  const EditTable = async (orderId: string) => {
    await EditOrderAction(orderId).then((res) => {
      if (res?.success) {
        toast.success(res.message);
        setCategory(false);
        setSelectProduct(true);
        setTable(true);
        setOrderID(orderId);
      }
      if (!res?.success) toast.error(res?.message || "Failed to submit order");
    });
  };

  const [note, setNote] = useState("");

  const handleNotes = () => {
    setValidOrderN(false);
  };
  const handleValid = async () => {
    try {
      const validation = ValidOrderSchema.safeParse({ note });
      if (!validation.success)
        return toast.error(validation.error.errors[0].message);

      await ValidOrderAction(userId, note).then((res) => {
        if (res?.success) {
          toast.success(res.message);
        }
      });

      setSelectTable("");
      setTimeout(() => {
        setValidOrderN(true);
        setValidOrder(true);
        setCategory(true);
        setTable(false);
        fetchtables();
      }, 300);
    } catch (error) {
      return toast.error("Something Wrong");
    }
  };

  const openTable = tables.filter((table) =>
    table.orders.some((order: any) => order.status === "NEW")
  );
  const editTable = tables.filter((table) =>
    table.orders.some((order: any) => order.status === "IN_PROGRESS")
  );

  const backToTable = async () => {
    setCategory(true);
    setTable(false);
    setSelectProduct(true);
    setShowOrder(false);
    setSelectTable("");
  };
  const backTocategory = async () => {
    setCategory(false);
    setTable(true);
    setSelectProduct(true);
  };

  return (
    <main className={`${showOrder ? "overflow-hidden" : "overflow-auto"}`}>
      <div
        className="absolute top-[4dvh] right-[2dvw] bg-blue-600 rounded-full text-white p-2"
        onClick={refreshTables}
      >
        <LucideRefreshCcw />
      </div>
      <div className="">
        <h1 className="text-2xl font-bold my-4 text-center">
          {SelectTable ? "Complete Order" : "Available Tables"}
        </h1>
        <div className="bg-green-900/80 text-white rounded-3xl shadow-md w-[98dvw] p-4 transtion-all duration-300">
          {/* TABLES */}
          {SelectTable ? (
            <>
              <p className="text-md text-slate-700 text-center p-2 mb-2 bg-white rounded-full">
                <strong>Order for Table:</strong> {SelectTable}
              </p>
              <div
                onClick={() => handleEditOrder(tableId)}
                className="p-2 flex items-center justify-center mb-2 gap-1 rounded-full bg-blue-600 aria-disabled:hidden"
                aria-disabled={hasItems}
              >
                <EditIcon className="text-blue-400" />
                <p className="text-blue-50">Edit This Order</p>
              </div>
            </>
          ) : (
            <></>
          )}

          {showOrder && (
            <div className="h-screen w-screen absolute top-0 left-0 z-10 bg-black/30 grid place-items-center  backdrop-blur-[3px]">
              <h2 className="text-3xl text- text-center absolute top-[2dvh]">
                Resume Order
              </h2>
              <div className="w-[80%] max-h-[70%] overflow-y-auto bg-white absolute top-[10dvh] py-4  px-2 rounded-lg">
                {orders
                  .filter(
                    (o: any) => tableId === o.tableId && o.status === "NEW"
                  )
                  .map((o: any) => (
                    <>
                      <div key={o.id} className="w-full h-[80%] relative ">
                        {o.items.map((items: any, index: number) => (
                          <>
                            <div
                              className={`flex justify-between p-2 gap-2  ${colorLine === index ? "bg-orange-800/30" : "bg-green-800/30"} rounded-lg mb-2 text-slate-700`}
                              // onClick={()=>editItemsOrder(items.id)}
                              onClick={() => showactiontoggle(index)}
                              key={items.id}
                            >
                              <span>{items.qty}</span>
                              <span>{items.product.nama}</span>
                              <span>{items.unitCents}</span>
                            </div>
                          </>
                        ))}
                      </div>
                    </>
                  ))}
              </div>
              {showAction && (
                <div className="w-[80%] h-[10dvh] bg-white absolute bottom-[12dvh] rounded-lg flex items-center justify-around transition-all duration-300">
                  <button className="bg-red-500 px-4 py-2 rounded">
                    <Trash2 />
                  </button>
                  <button
                    className="bg-yellow-500 px-4 py-2 rounded"
                    onClick={() => setShowOrder(false)}
                  >
                    <XCircle />
                  </button>
                  <button className="bg-orange-500 px-4 py-2 rounded">
                    <MinusCircle />
                  </button>
                  <button className="bg-blue-500 px-4 py-2 rounded">
                    <PlusCircle />
                  </button>
                </div>
              )}
              {/* <div className="w-[80%] h-[10dvh] bg-white absolute bottom-[12dvh] rounded-lg flex items-center justify-around transition-all duration-300">
              </div> */}
            </div>
          )}

          <div className="aria-disabled:hidden" aria-disabled={table}>
            <ul className="list-none relative flex flex-col gap-3 aria-disabled:hidden">
              {tables
                .filter(
                  (table) =>
                    table.status === "DISPO" || table.orders < 1
                )
                .map((table: any) => (
                  <div
                    className="bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url('/Moodz.jpg')` }}
                    onClick={() => selectTable(table.id, table.number)}
                    key={table.id}
                  >
                    <li
                      className={`bg-green-200/30 p-2 w-full h-[12dvh] order-${table.number} rounded-lg backdrop-blur-[3px] backdrop-brightness-50 flex items-center justify-between shadow-green-100 shadow-md`}
                    >
                      <h2 className="text-6xl opacity-50 font-semibold self-start ml-2 italic">
                        Table:
                      </h2>
                      <p className="text-3xl opacity-50 mr-2 font-medium italic">
                        {table.number}
                      </p>
                    </li>
                  </div>
                ))}
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="aria-disabled:hidden" aria-disabled={category}>
            <ul className="list-none relative flex flex-col gap-3">
              <button
                className="bg-white w-max h-max p-2 rounded-full text-green-900 "
                onClick={backToTable}
              >
                <ArrowBigLeftDashIcon />
              </button>
              {categories.map((category: any) => (
                <div
                  className="bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url('/Moodz.jpg')` }}
                  onClick={() => selectCategory(category.id)}
                  key={category.id}
                >
                  <li
                    
                    className="bg-green-200/30 p-2 w-full h-[12dvh]  rounded-lg backdrop-blur-[3px] backdrop-brightness-50 flex items-center justify-between shadow-green-100 shadow-md"
                  >
                    <h2 className="text-3xl  font-semibold selfstart ml-2 italic">
                      {category.name}
                    </h2>
                    <p className="text-3xl opacity-50 mr-2 font-medium italic">
                      {category.products.length}
                    </p>
                  </li>
                </div>
              ))}
            </ul>
          </div>
          {/* PRODUCTS */}
          <div className="aria-disabled:hidden" aria-disabled={selectProduct}>
            <ul className="list-none relative flex flex-col gap-3">
              <button
                className="bg-white w-max h-max p-2 rounded-full text-green-900 "
                onClick={backTocategory}
              >
                <ArrowBigLeftDashIcon />
              </button>
              {products
                .filter((cp) => cp.categoryId === selectedCategory)
                .map((product: any) => (
                  <>
                    <div
                      className="bg-cover bg-center rounded-2xl p-2"
                      style={{ backgroundImage: `url('/Moodz.jpg')` }}
                      key={product.id}
                    >
                      <li
                        
                        className="bg-green-200/30 p-2 w-full h-[12dvh]  rounded-lg backdrop-blur-[3px] backdrop-brightness-50 flex items-center justify-between shadow-amber-500 shadow-md"
                      >
                        <h2 className="text-3xl  font-semibold selfstart ml-2 italic">
                          {product.nama}
                        </h2>
                        <p className="text-3xl opacity-50 mr-2 font-medium italic">
                          {product.price}
                        </p>
                        <span className="h-full flex flex-col justify-around gap-1">
                          <PlusCircle
                            onClick={() => handlerIncrease(product.id)}
                          />
                          <p className="bg-white text-center font-bold rounded-full text-slate-700">
                            {quantities[product.id] || 0}
                          </p>
                          <MinusCircle
                            onClick={() => handlerDecrease(product.id)}
                          />
                        </span>
                      </li>
                    </div>
                  </>
                ))}
            </ul>
          </div>
        </div>

        {/* OPEN TABLE */}

        <div
          className="p-2 bg-orange-400 mt-4 rounded-3xl shadow-lg aria-disabled:hidden"
          aria-disabled={Object.keys(openTable).length === 0 || table}
        >
          <h1 className="text-3xl font-bold text-orange-900 text-center mb-2">
            Open Table
          </h1>
          <div className="aria-disabled:hidden" aria-disabled={table}>
            <ul className="list-none relative flex flex-col gap-3 ">
              {openTable.map((table) => (
                <div
                  className="bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url('/Moodz.jpg')` }}
                  onClick={() => selectTable(table.id, table.number)}
                  key={table.id}
                >
                  <li
                    
                    className={`bg-green-200/30 p-2 w-full h-[12dvh] text-orange-500 order-${table.number} rounded-lg backdrop-blur-[3px] backdrop-brightness-50 flex items-center justify-between shadow-green-100 shadow-md`}
                  >
                    <h2 className="text-6xl opacity-50 font-semibold self-start ml-2 italic">
                      Table:
                    </h2>
                    <p className="text-3xl opacity-50 mr-2 font-medium italic">
                      {table.number}
                    </p>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>

        {/* EDIT TABLE */}

        <div
          className="p-2 mt-4 rounded-3xl shadow-lg aria-disabled:hidden"
          aria-disabled={Object.keys(editTable).length === 0 || table}
        >
          <h1 className="text-3xl font-bold text-green-900 text-center mb-2">
            Edit Table
          </h1>
          <div className="aria-disabled:hidden" aria-disabled={table}>
            <ul className="list-none relative flex flex-col gap-3">
              {editTable.map((table) => (
                <div
                  className="bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url('/Moodz.jpg')` }}
                  onClick={() => EditTable(table.orders[0]?.id)}
                  key={table.id}
                >
                  <li
                    
                    className={`bg-green-200/30 p-2 w-full h-[12dvh] text-green-500 order-${table.number} rounded-lg backdrop-blur-[3px] backdrop-brightness-50 flex items-center justify-between shadow-green-100 shadow-md`}
                  >
                    <h2 className="text-6xl opacity-50 font-semibold self-start ml-2 italic">
                      Table:
                    </h2>
                    <p className="text-3xl opacity-50 mr-2 font-medium italic">
                      {table.number}
                    </p>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="flex mt-2 justify-center px-12 mr-2  aria-disabled:hidden"
          aria-disabled={Object.keys(quantities).length === 0}
        >
          <button
            className="p-2 l bg-green-700/80 rounded-lg backdrop-blur-[3px] w-full text-white font-bold"
            onClick={() => handleSubmit(orderID)}
          >
            Submit
          </button>
        </div>
        <div
          className="flex mt-2 justify-center px-12 mr-2  aria-disabled:hidden"
          aria-disabled={hasItems}
        >
          <button
            className="p-2 l bg-blue-700/80 rounded-lg backdrop-blur-[3px] w-full text-white font-bold"
            onClick={handleNotes}
          >
            Valid Order
          </button>
        </div>
        {!validOrderN && (
          <div className="absolute h-screen w-screen top-0 left-0  bg-black/40 backdrop-blur-[3px] flex items-center justify-center ">
            <div className="flex flex-col w-[80%] h-[50%] items-center justify-center gap-12 rounded-lg border-amber-500 border-b-4 border-t-2 p-4 shadow-md shadow-amber-200 bg-white/80 backdrop-blur-sm">
              <h1 className="text-3xl font-bold text-slate-600">Notes</h1>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write Notes If You Have"
                className="text-center p-2 border-amber-500 rounded-full text-amber-800 shadow-sm border-1"
              />
              <button
                className="p-2 l bg-blue-700/80 rounded-lg backdrop-blur-[3px] w-full text-white font-bold"
                // type="submit"
                onClick={handleValid}
              >
                Sent Order
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
