import { useState } from "react";

import TablaCliente from "./TablaCliente";

const Clientes = () => {
  const [reloadTable] = useState(false); // Estado para controlar la recarga de la tabla

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h1>Empleados</h1>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            margin: "10px 0",
          }}
        ></div>
      </div>
      <div>
        <TablaCliente reload={reloadTable} />
      </div>
    </div>
  );
};

export default Clientes;
