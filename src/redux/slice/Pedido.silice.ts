// Pedido.slice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PedidoState {
  pedidoRealizado: boolean;
}

const initialState: PedidoState = {
  pedidoRealizado: false,
};

const pedidoSlice = createSlice({
  name: "pedido",
  initialState,
  reducers: {
    setPedidoRealizado(state, action: PayloadAction<boolean>) {
      state.pedidoRealizado = action.payload;
    },
  },
});

export const { setPedidoRealizado } = pedidoSlice.actions;
export default pedidoSlice.reducer;
