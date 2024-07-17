import empresaReducer from "./slice/EmpresaRedux";
import { configureStore } from "@reduxjs/toolkit";
import { carritoSlice } from "./slice";
import domicilioReducer from "./slice/domicilioSilice";
import pedidoReducer from "./slice/Pedido.silice";
export const store = configureStore({
  reducer: {
    empresa: empresaReducer,
    cartReducer: carritoSlice.reducer,
    domicilio: domicilioReducer,
    pedido: pedidoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
