import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Domicilio } from "../../types/compras/interface";

const initialState: Domicilio = {
  calle: "",
  numero: "",
  cp: 0, // cp debe ser un número, así que inicialízalo como 0 o cualquier otro valor numérico predeterminado
  localidad: {
    id: undefined, // Opcional, pero definido explícitamente como undefined para coincidir con la interfaz
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
