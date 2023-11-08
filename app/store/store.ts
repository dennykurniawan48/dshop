'use client'
import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./feature/cartSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { listenerMiddleware } from "./middleware";

interface CartItem {
    id: string;
    qty: number;
}

interface CartState {
    items: CartItem[]
}

const initialState: CartState = { items: JSON.parse(localStorage.getItem("cart") || "[]") };

const store = configureStore({
    preloadedState: {
        cart: initialState === null ? { items: [] } : initialState
    },
    reducer: { cart: cartSlice.reducer },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        listenerMiddleware.middleware
    ]
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;