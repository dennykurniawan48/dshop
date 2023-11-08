"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { AppDispatch, useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import {
  decreaseItem,
  deleteAllItems,
  increaseItem,
} from "../store/feature/cartSlice";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { json } from "stream/consumers";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

type ResponseItem = {
  id: string;
  isActive: boolean;
  name: string;
  price: number;
  image1: string;
  availableStock: number;
};

type ResponseJson = {
  data: ResponseItem[];
};

type CartItem = {
  id: string;
  isActive: boolean;
  name: string;
  price: number;
  image1: string;
  availableStock: number;
  qty: number;
};

type Shipping = {
  id: string;
  name: string;
  duration: string;
  price: number;
};

type ResponseShipping = {
  data: Shipping[];
};

type State = {
  id: string;
  name: string;
};

type Country = {
  id: string;
  name: string;
  state: State[];
};

type ResponseCountry = {
  data: Country[];
};

type DetailOrder = {
  productId: string;
  price: number;
  qty: number;
  productName: string;
  image: string;
};

type ResponseCheckout = {
  deliveryCost: number;
  deliveryId: string;
  discount: number;
  id: string;
  stateId: string;
  userId: string;
};

enum CheckoutState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

function Page() {
  const cart = useAppSelector((state) => state.cart.items);
  const [data, setData] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState<Shipping[]>([]);
  const [country, setCountry] = useState<Country[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [showCart, setShowCart] = useState(true);
  const [showShipping, setShowShipping] = useState(true);
  const [showDelivery, setShowDelivery] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [discount, setDiscount] = useState(false);
  const [checkoutState, setCheckoutState] = useState(CheckoutState.IDLE);
  const router = useRouter();
  const [urlCheckout, setUtlCheckout] = useState("");
  const { data: session, status } = useSession();
  const [couponCode, setCouponCode] = useState("");
  const [errorCoupon, setErrorCoupon] = useState(false);
  const [total, setTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0)

  useEffect(() => {
    if (checkoutState === CheckoutState.SUCCESS) {
      router.replace(`${urlCheckout}`);
    }
  }, [checkoutState]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const data = await fetch("/api/cart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      });
      // convert the data to json
      const json: ResponseJson = await data.json();

      const productPrice: ResponseItem[] = json.data;

      const idToQtyMap: { [id: string]: number } = {};

      // Populate the mapping object
      for (const item of cart) {
        idToQtyMap[item.id] = item.qty;
      }

      const resultArray: CartItem[] = productPrice.map((item) => {
        const id = item.id;
        const qty = idToQtyMap[id] || 0; // Handle cases where id is not found in array2
        return { ...item, qty: qty };
      });

      setData(resultArray);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, [cart]);

  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const data = await fetch("/api/shipping");
      // convert the data to json
      const json: ResponseShipping = await data.json();

      setSelectedShipping(json.data[0].id);

      setShipping(json.data);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const data = await fetch("/api/country");
      // convert the data to json
      const json: ResponseCountry = await data.json();

      setCountry(json.data);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  useEffect(() => {
    setTotal(calculateTotalCart(data))
  }, [data])

  useEffect(() => {
    const cost = (shipping.find((item) => item.id === selectedShipping)?.price ?? 0)
    setFinalTotal(Math.floor(((discount ? (total / 2) : total) + cost)*100)/100)
  }, [discount, total, selectedShipping])

  return (
    <div className="flex w-full flex-col">
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <Header />
      </div>
      <div className="flex w-full flex-col lg:flex-row justify-center p-16 mt-28">
        <div className="flex flex-col w-full md:w-4/6 mr-4 lg:mr-44">
          <h1 className="font-bold text-3xl mb-4">Your Cart</h1>
          <div className="w-full border border-gray-500 flex flex-row space-x-4 p-4">
            <button
              onClick={() => {
                setShowCart((state) => !state);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <span>Order Items</span>
          </div>

          {showCart && (
            <div className="w-full border border-1 border-gray-500 p-4 flex flex-col">
              {cart.length > 0 &&
                data.map((item) => (
                  <div className="w-full flex space-x-4" key={item.id}>
                    <img src={item.image1} className="w-24 h-24" />
                    <div className="w-full flex flex-col justify-center space-y-4">
                      <span className="text-xl font-bold">{item.name}</span>
                      <div className="w-full flex justify-between">
                        <span className="text-lg font-bold text-gray-500">
                          $
                          {(
                            Math.round(item.qty * item.price * 100) / 100
                          ).toFixed(2)}
                        </span>
                        <div className="w-24 px-4 py-2 border border-purple-600 rounded-md flex justify-between items-center">
                          <button
                            onClick={() => {
                              dispatch(decreaseItem(item.id));
                            }}
                          >
                            -
                          </button>
                          <input
                            className="w-12 outline-none text-center"
                            value={item.qty}
                          />
                          <button
                            onClick={() => {
                              if (item.qty < item.availableStock) {
                                dispatch(increaseItem(item.id));
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {cart.length === 0 && (
                <div className="w-full flex justify-center">
                  <span className="text-2xl text-gray-500">Cart is empty</span>
                </div>
              )}
            </div>
          )}

          <div className="w-full border border-gray-500 flex flex-row space-x-4 p-4 mt-8">
            <button
              onClick={() => {
                setShowShipping((state) => !state);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <span>Shipping Information</span>
          </div>

          {showShipping && (
            <div className="w-full flex flex-col border border-1 border-gray-500 p-4">
              <div className="w-full flex space-x-6">
                <div className="w-1/2 flex flex-col">
                  <label>Country</label>
                  <select
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedState("");
                    }}
                    className="w-full px-4 py-2 border rounded-md border-gray-500 focus:border-purple-600"
                  >
                    <option value={""}>Choose Country</option>
                    {country.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2 flex flex-col">
                  <label>State</label>
                  <select
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                    }}
                    className="w-full px-4 py-2 border rounded-md border-gray-500 focus:border-purple-600"
                  >
                    <option selected={true}>Choose State</option>
                    {selectedCountry !== "" &&
                      country
                        .find((item) => item.id === selectedCountry)
                        ?.state.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
              <div className="w-full flex space-x-6">
                <div className="w-1/2 flex flex-col">
                  <label>Fullname</label>
                  <input
                    onChange={(e) => {
                      if (e.target.value.length <= 30) {
                        setFullName(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2 rounded-md outline-purple-600 border border-gray-500"
                    value={fullName}
                  />
                </div>
                <div className="w-1/2 flex flex-col">
                  <label>Zip Code</label>
                  <input
                    onChange={(e) => {
                      if (e.target.value.length <= 5) {
                        setZipCode(e.target.value);
                      }
                    }}
                    type="number"
                    value={zipCode}
                    className="w-full px-4 py-2 rounded-md outline-purple-600 border border-gray-500"
                  />
                </div>
              </div>
              <div className="w-full flex flex-col">
                <label>Address</label>
                <textarea
                  cols={2}
                  onChange={(e) => {
                    if (e.target.value.length <= 120) {
                      setAddress(e.target.value);
                    }
                  }}
                  value={address}
                  className="w-full px-4 py-2 rounded-md outline-purple-600 border border-gray-500"
                />
              </div>
            </div>
          )}

          <div className="w-full border border-gray-500 flex flex-row space-x-4 p-4 mt-8">
            <button
              onClick={() => {
                setShowDelivery((state) => !state);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <span>Shipping Method</span>
          </div>

          {showDelivery && (
            <div className="w-full flex flex-col border border-1 border-gray-500 p-4 space-y-6">
              {shipping.map((ship) => (
                <div className="w-full flex space-y-2 flex-row" key={ship.id}>
                  <div className="flex items-center space-x-4">
                    <input
                      checked={selectedShipping === ship.id}
                      id="shippingmethod"
                      type="radio"
                      value={ship.id}
                      onChange={(e) => {
                        setSelectedShipping(e.target.value);
                      }}
                      name="shippingmethod"
                      className="w-4 h-4 bg-gray-100 text-purple-600 border-gray-300 ring-0 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="flex flex-col">
                      <span>{ship.name}</span>
                      <span className="text-sm text-gray-500">
                        {ship.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:w-2/6">
          <div className="relative">
          <div className="p-6 border border-gray-600 w-full rounded-md flex-col space-y-2">
            <span className="text-lg font-bold">Summary</span>
            <div className="w-full flex justify-between">
              <span className="text-md">Subtotal:</span>
              <span className="text-md">${calculateTotalCart(data)}</span>
            </div>
            <div className="w-full flex justify-between">
              <span className="text-md">Delivery:</span>
              <span className="text-md">
                $
                {calculateDelivery(
                  shipping.find((item) => item.id === selectedShipping)
                )}
              </span>
            </div>
            <div className="w-full flex justify-between">
              <span className="text-md">Discount:</span>
              <span className="text-md">
                ${discount
                  ? Math.round((total / 2) * 100) / 100
                  : 0}
              </span>
            </div>
            <div className="w-full flex justify-between">
              <span className="text-md">Total:</span>
              <span className="text-md">${finalTotal}</span>
            </div>
            <div className="w-full flex justify-between">
              <button
                type="button"
                onClick={() => {
                  if (
                    data.length > 0 &&
                    selectedCountry !== "" &&
                    selectedState !== "" &&
                    fullName !== "" &&
                    zipCode !== "" &&
                    address !== "" &&
                    selectedShipping !== "" &&
                    checkoutState !== CheckoutState.LOADING
                  ) {
                    const details: DetailOrder[] = data.map((item) => ({
                      productId: item.id,
                      price: item.price,
                      qty: item.qty,
                      image: item.image1,
                      productName: item.name
                    }));
                    fetch(`/api/checkout`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        stateId: selectedState,
                        shippingMethodId: selectedShipping,
                        discount: Math.round((discount?(total / 2): total) * 100) / 100,
                        deliveryCost:
                          shipping.find((item) => item.id === selectedShipping)
                            ?.price ?? 0,
                        details,
                        zipCode,
                        address,
                        fullName,
                        total: finalTotal,
                        coupon: couponCode
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
                        dispatch(deleteAllItems());
                        window.location = json.url;
                      })
                      .catch((e) => {
                        console.log(e.error);
                      });
                  }
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white font-bold mt-4"
              >
                {checkoutState === CheckoutState.LOADING
                  ? "Loading"
                  : "Checkout"}
              </button>
            </div>
            <div className="flex w-full pt-8 flex-col space-y-3">
              <input
                className="w-full outline-none rounded-md border border-gray-500 p-2 disabled:bg-gray-200 disabled:text-gray-500"
                placeholder="Coupon Code"
                disabled={discount}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                }}
                value={couponCode.toUpperCase()}
              />
             {discount && <span className="w-full text-center p-2 text-gray-700 bg-green-400 rounded-lg">Promo applied.</span>}
            </div>
            <div className="flex w-full space-x-3">
              <button
                className="w-full bg-purple-600 py-2 text-white"
                onClick={() => {
                  if (couponCode.toLowerCase() !== "portfolio50") {
                    setErrorCoupon(true);
                  } else {
                    setErrorCoupon(false);
                    setDiscount(true);
                  }
                }}
              >
                Use Code
              </button>
            </div>

            {errorCoupon && (
              <div className="flex w-full space-x-3 text-center">
                <span className="text-xs text-red-500">
                  Invalid coupon code
                </span>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateTotalCart(data: CartItem[]): number {
  return (
    data.reduce((prev, item) => prev + item.price * 100 * item.qty, 0) / 100
  );
}

function calculateDelivery(data: Shipping | undefined): number {
  return ((data?.price ?? 0) * 100) / 100;
}

export default Page;
