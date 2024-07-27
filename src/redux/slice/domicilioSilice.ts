import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Domicilio } from "../../types/compras/interface";

const initialState: Domicilio = {
  calle: "",
  numero: "",
  cp: 0,
  localidad: {
    id: undefined,
    nombre: "",
    provincia: {
      id: undefined,
      nombre: "",
      pais: {
        id: undefined,
        nombre: "",
      },
    },
  },
};

const domicilioSlice = createSlice({
  name: "domicilio",
  initialState,
  reducers: {
    setDomicilio: (_state, action: PayloadAction<Domicilio>) => {
      return action.payload;
    },
    limpiarDomicilio: () => initialState,
  },
});

export const { setDomicilio, limpiarDomicilio } = domicilioSlice.actions;
export default domicilioSlice.reducer;
