import prismadb from "@/lib/prismadb"

export const getTotalRevenue = async (storeId: string) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    const totalRevenue = orders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, orderItem) => {
            return orderSum + orderItem.product.price.toNumber()
        }, 0)

        return total + orderTotal;
    }, 0);

    return totalRevenue;
}