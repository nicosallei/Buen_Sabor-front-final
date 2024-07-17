import { createSlice } from "@reduxjs/toolkit";

export interface EmpresaState {
    idEmpresa: number | null;
    idSucursal: number | null;
}

const initialState: EmpresaState = {
    idEmpresa: null,
    idSucursal: null
}

export const EmpresaSlice = createSlice({ // export added here
    name: "empresa",
    initialState,
    reducers: {
        setIdEmpresa(state, action:  {payload: number | null }) {
            state.idEmpresa = action.payload;
        },
        setIdSucursal(state, action:  {payload: number | null }) {
            state.idSucursal = action.payload;
        }
    }
});

export default EmpresaSlice.reducer;