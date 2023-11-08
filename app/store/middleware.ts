import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { addItem, decreaseItem, deleteAllItems, deleteItem, increaseItem } from "./feature/cartSlice";

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  matcher: isAnyOf(addItem, increaseItem, decreaseItem, deleteItem, deleteAllItems),
  effect: (action, listenerApi) =>
    localStorage.setItem(
      "cart",
      JSON.stringify((listenerApi.getState() as RootState).cart.items)
    )
}
);