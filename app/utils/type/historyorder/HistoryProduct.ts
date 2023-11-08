type HistoryProduct = {
    id: string,
    fullName: string,
    address: string,
    discount: number,
    couponCode: string,
    deliveryCost: number,
    zipCode: string,
    total: number,
    stateId: string,
    userId: string,
    statusId: string,
    deliveryId: string,
    paid: boolean,
    createdAt: string,
    updatedAt: string,
    detailorder: [
        {
            price: number,
            qty: number,
            products: {
                image1: string,
                name: string,
                categories: {
                    id: string,
                    name: string,
                    thumbnail: string
                }
            }
        }
    ],
    status: {
        id: string,
        status_name: string
    }
}