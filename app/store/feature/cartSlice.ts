import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
    id: string;
    qty: number;
}

interface CartState{
    items: CartItem[]
}

const initialState: CartState = {items: []};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<CartItem>) {
            const exist = state.items.find((item) => item.id === action.payload.id)
            if(exist){
                exist.qty = action.payload.qty
            }else{
                state.items.push(action.payload)
            }
        },
        increaseItem(state, action: PayloadAction<string>){
            const exist = state.items.find((item) => item.id === action.payload)
            if(exist){
                exist.qty++
            }
        },
        decreaseItem(state, action: PayloadAction<string>){
            const exist = state.items.find((item) => item.id === action.payload)
            if(exist){
                if(exist.qty === 1){
                    state.items = state.items.filter(item => item.id != action.payload)        
                }else{
                exist.qty--
            }
            }
        },
        deleteItem(state, action: PayloadAction<string>){
            state.items = state.items.filter(item => item.id != action.payload)
        },
        deleteAllItems(state){
            state.items = []
        }
    }
})

export const {addItem, increaseItem, decreaseItem, deleteItem, deleteAllItems} = cartSlice.actions