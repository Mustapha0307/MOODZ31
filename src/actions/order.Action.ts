"use server";

import { prisma } from "@/utils/prisma";

export const selectTableAction = async (tableID: string, userId: string) => {
  const table = await prisma.table.findUnique({
    where: { id: tableID },
  });
  if (!table) return;

  await prisma.table.update({
    where:{id: table.id},
    data:{
      status: "INDISPO",
    }
  })

  const orderExst = await prisma.order.findFirst({
    where: { tableId: tableID, UserId: userId, status: "NEW" },
  });

  if (orderExst) {
    await prisma.order.update({
      where: { id: orderExst.id },
      data: {
        tableId: tableID,
        UserId: userId,
        updateAt: new Date(),
        status: "NEW",
      },
    });
    return { success: true, message: `Table Selected: ${table.number}` };
  }

  const orderExstEdit = await prisma.order.findFirst({
    where: { tableId: tableID, UserId: userId, status: "IN_PROGRESS" },
  });
  if (orderExstEdit) {
    await prisma.order.update({
      where: { id: orderExstEdit.id },
      data: {
        tableId: tableID,
        UserId: userId,
        updateAt: new Date(),
      },
    });
  }

  if (!orderExst && !orderExstEdit) {
    await prisma.order.create({
      data: {
        tableId: tableID,
        UserId: userId,
        status: "NEW",
      },
    });
    return { success: true, message: `Table Selected: ${table.number}` };
  }
};

export const createOrderItemsAction = async (
  userId: string,
  items: { productId: string; qty: number; unitCents: number }[],
  orderId?: string
) => {
  // نلقاو الطلب المفتوح لهذا النادل
  const order = await prisma.order.findFirst({
    where: {
      UserId: userId,
      status: "NEW",
    },
  });

  if (!order) {
    return { success: false, message: "No active order found" };
  }

  // ندخلو كامل المنتجات دفعة وحدة
  await prisma.orderItem.createMany({
    data: items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      qty: item.qty,
      unitCents: item.unitCents,
    })),
  });

  // const editOrder = await prisma.order.findFirst({
  //   where: {
  //     id: orderId,
  //     status: "IN_PROGRESS",
  //   },
  // });

  return { success: true, message: "Order items created successfully" };
};

export const ValidOrderAction = async (userId: string, note: string) => {
  const order = await prisma.order.findFirst({
    where: {
      UserId: userId,
      status: "NEW",
    },
  });

  if (!order) {
    return { success: false, message: "No active order found" };
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: order.id },
  });

  const totaleCent = orderItems.reduce((acc: any, item: any) => {
    return acc + item.qty * item.unitCents;
  }, 0);

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "IN_PROGRESS",
      notes: note,
      totalCents: totaleCent,
    },
  });

  return { success: true, message: "Order Has Sent Successfully" };
};

export const EditOrderAction = async (orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      status: "IN_PROGRESS",
    },
  });

  if (!order) {
    return { success: false, message: "No active order found" };
  }
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "NEW",
    },
  });
  return { success: true, message: "Order Open. Valid When You Done " };
};

export const AddItemAction = async (
  nama: string,
  categoryId: string,
  price: number
) => {
  await prisma.product.create({
    data: {
      nama,
      price,
      categoryId,
    },
  });
  return { success: true, message: "Item Has Add Successfully" };
};
export const EditItemAction = async (
  productId: string,
  namaE: string,
  categoryIdE: string,
  priceE: number
) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) return { success: false, message: "Product not found" };

  await prisma.product.update({
    where: { id: productId },
    data: {
      nama: namaE,
      price: priceE,
      categoryId: categoryIdE,
    },
  });
  return { success: true, message: "Item Has Edited Successfully" };
};

export const DeleteItemAction = async (productId: string) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) return { success: false, message: "Product not found" };

  await prisma.product.delete({
    where: { id: productId }
  });
   return { success: true, message: "Item Has Deleted Successfully" };

};

export const ReadyOrderAction = async(orderId: string)=>{
  if(!orderId) return { success: false, message: "Order not found"}

  await prisma.order.update({
    where:{id: orderId},
    data:{
      status: "READY"
    }
  })
return { success: true, message: "Order Is Ready" };  
}
export const ServeredOrderAction = async(orderId: string)=>{
  const order = await prisma.order.findUnique({where:{id: orderId}})
if(!order) return { success: false, message: "Order not found"}

  await prisma.order.update({
    where:{id: order.id},
    data:{
      status: "SERVERED"
    }
  })

  await prisma.table.update({
    where:{id: order.tableId},
    data:{
      status: "DISPO"
    }
  })

return { success: true, message: "Order Is Servred Successfully" };  
}
export const CanceledOrderAction = async(orderId: string)=>{
 const order = await prisma.order.findUnique({where:{id: orderId}})
if(!order) return { success: false, message: "Order not found"}

  await prisma.order.update({
    where:{id: order.id},
    data:{
      status: "CANCELED"
    }
  })

  await prisma.table.update({
    where:{id: order.tableId},
    data:{
      status: "DISPO"
    }
  })

return { success: true, message: "Order Is Canceled" };  
}
