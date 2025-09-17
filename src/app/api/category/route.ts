import { NextResponse } from "next/server"
import { prisma } from "@/utils/prisma"

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { products: true },
  })
  return NextResponse.json(categories)
}




//  <div>
//       {products?.map((product) => (
//         <div key={product.id} className="border p-2 my-2 rounded">
//           <h3>{product.name}</h3>
//           <div className="flex items-center gap-2">
//             <button onClick={() => handlerDecrease(product.id)}>
//               <MinusCircle />
//             </button>
//             <span>{quantities[product.id] || 1}</span>
//             <button onClick={() => handlerIncrease(product.id)}>
//               <PlusCircle />
//             </button>
//           </div>
//         </div>
//       ))}

//       <button
//         onClick={handleSubmit}
//         className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
//       >
//         Submit
//       </button>
//     </div>


//  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
 
//    const handlerIncrease = (productId: string) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [productId]: (prev[productId] || 1) + 1,
//     }));
//   };

//   const handlerDecrease = (productId: string) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [productId]: prev[productId] && prev[productId] > 1 ? prev[productId] - 1 : 1,
//     }));
//   };

//   const handleSubmit = () => {
//     // هنا يخرج كل المنتجات المختارة مع الكميات
//     const selectedProducts = products
//       .filter((p) => quantities[p.id] && quantities[p.id] > 0)
//       .map((p) => ({
//         ...p,
//         qty: quantities[p.id],
//       }));

//     console.log("📝 Products to send:", selectedProducts);
//   }
