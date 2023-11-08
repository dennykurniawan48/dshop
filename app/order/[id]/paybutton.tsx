'use client'
import React from 'react'

type DetailOrder = {
    productId: string;
    price: number;
    qty: number;
    productName: string;
    image: string;
  };

function PayButton(props:{data: any}) {
  return (
    <>
    {props.data.statusId === "payment" && <div className="flex flex-col space-y-2 text-sm text-gray-500">
          <button type="button" onClick={() => {
            const details: DetailOrder[] = props.data.detailorder.map((item:any) => ({
              productId: item.id,
              price: item.price,
              qty: item.qty,
              image: item.products.image1,
              productName: item.products.name
            }));
            fetch(`/api/checkout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                stateId: props.data.stateId,
                shippingMethodId: props.data.deliveryId,
                discount: Math.round(props.data.discount * 100) / 100,
                deliveryCost: props.data.deliveryCost,
                details,
                zipCode: props.data.zipCode,
                address: props.data.address,
                fullName: props.data.fullName,
                total: props.data.total,
                coupon: props.data.couponCode
              }),
            })
              .then((res) => {
                if (res.ok) {
                  return res.json();
                } else {
                  return res
                    .json()
                    .then((json) => Promise.reject(json));
                }
              })
              .then((json) => {
                //dispatch(deleteAllItems());
                window.location = json.url;
              })
              .catch((e) => {
                console.log(e.error);
              });
          }} className="px-6 py-3 bg-purple-600 text-white font-bold">Pay Now</button>
        </div>}
        </>
  )
}

export default PayButton