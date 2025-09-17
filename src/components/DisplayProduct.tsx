"use client";

import { AddItemAction, DeleteItemAction, EditItemAction } from "@/actions/order.Action";
import { AddItemSchema, EditItemSchema } from "@/utils/validationSchemas";
import { tree } from "next/dist/build/templates/app-page";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DisplayProduct() {
  const [product, setProduct] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAdd, setShoawAdd] = useState(false);
  const [showItem, setShowItem] = useState<number | null>(null);
  const [nama, setNama] = useState("");
  const [price, setPrice] = useState<number>();
  const [categoryId, setCategoryId] = useState("");
  const [namaE, setNamaE] = useState("");
  const [priceE, setPriceE] = useState<number>();
  const [categoryIdE, setCategoryIdE] = useState("");

  const togglShowItem = (index: number) => {
    setShowItem(showItem === index ? null : index);
  };

  const fetchProduct = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProduct(data);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/category");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);
  const filteredProduct = selectedCategory
    ? product.filter((p) => p.categoryId === selectedCategory)
    : product;

  const handleAddItem = async () => {
    const validation = AddItemSchema.safeParse({ nama, categoryId, price });
    if (!validation.success)
      return toast.error(validation.error.errors[0].message);

    try {
      await AddItemAction(nama, categoryId, price!).then((res) => {
        if (res.success) {
          toast.success(res.message);
          setNama("");
          setCategoryId("");
          setPrice(0)
          setShoawAdd(false);
          fetchProduct();
        }
      });
    } catch (error) {
      toast.error("Somthing Wrong");
    }
  };
  
  const handleEditItem = async (productId: string) => {
    const validation = EditItemSchema.safeParse({ namaE, categoryIdE, priceE });
    if (!validation.success)
      return toast.error(validation.error.errors[0].message);

    try {
      await EditItemAction(productId,namaE, categoryIdE, priceE!).then((res) => {
        if (res.success) {
          toast.success(res.message);
          setNamaE("");
          setCategoryIdE("");
          setPriceE(0)
          setShowItem(null);
          fetchProduct();
        }
      });
    } catch (error) {
      toast.error("Somthing Wrong");
    }
  };

  const DeleteItem = async(productId: string)=>{

    const Confirm  = confirm("Are You Sur To DELETED This Product!")

    if(!Confirm) return

    await DeleteItemAction(productId).then((res) => {
        if (res.success) {
          toast.success(res.message);
          fetchProduct();
        }
      });

  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-row-reverse w-screen items-center justify-center gap-7">
        <button
          className="p-2 bg-green-700 text-white rounded-lg cursor-pointer "
          onClick={() => setShoawAdd(true)}
        >
          Add Item
        </button>
        <div>
          <label
            htmlFor="category"
            className="block text-sm text-center font-medium text-gray-700 mb-2"
          >
            Select Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
          >
            <option value="" disabled>
              -- Choose a category --
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="px-2">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-md ">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Name
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Price
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProduct.map((product: any, index: number) => (
              <>
                <tr
                  key={product.id}
                  onClick={() => togglShowItem(index)}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {product.nama}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {product.price} DA
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {product.category?.name ?? "No Category"}
                  </td>
                </tr>
                {showItem === index && (
                  <div className="absolute w-screen h-max p-4 bg-black/40 left-0 backdrop-blur-[3px] flex items-center justify-center">
                    <div className="w-[95%] rounded-lg h-max py-12 px-4 bg-white border-amber-500 border-b-5 border-t-2 flex flex-col items-center justify-center gap-7">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Add New Product
                      </h2>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={namaE}
                          onChange={(e) => setNamaE(e.target.value)}
                          placeholder={product.nama}
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Price (DA)
                        </label>
                        <input
                          type="number"
                          value={priceE}
                          onChange={(e) => setPriceE(Number(e.target.value))}
                          placeholder={product.price}
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Category
                        </label>
                        <select
                          value={categoryIdE}
                          onChange={(e) => setCategoryIdE(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2  focus:outline-none focus:ring focus:ring-green-200"
                        >
                          <option value="" disabled>{product.category?.name}</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full flex items-center justify-around">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-lg"
                          onClick={()=>handleEditItem(product.id)}
                        >
                          Submit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                          onClick={() => DeleteItem(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* {showAdd && ( */}
      <div
        className={`${showAdd ? "h-screen w-screen left-0 top-0 " : "hidden opacity-0"} transition-all duration-300 absolute  flex items-center justify-center  bg-black/30 backdrop-blur-[3px]`}
      >
        <div className="h-[60%] w-[80%] bg-white rounded-lg border-amber-500 border-b-5 border-t-2 flex flex-col items-center justify-center gap-7">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Product
          </h2>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Product name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Price (DA)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2  focus:outline-none focus:ring focus:ring-green-200"
            >
              <option value="" disabled>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full flex items-center justify-around">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
              onClick={handleAddItem}
            >
              Submit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setShoawAdd(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {/* //   )} */}
    </div>
  );
}
