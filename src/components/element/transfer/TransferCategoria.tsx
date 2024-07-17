import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { useSelector } from 'react-redux';

interface Sucursal {
  id: string;
  nombre: string;
}

interface Props {
  setSelectedSucursales: (selectedSucs: string[]) => void;
}

const AgregarSucursalACatgoria: React.FC<Props> = ({ setSelectedSucursales }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const { empresa } = useSelector((state: any) => state);

  useEffect(() => {
    if (empresa && empresa.idEmpresa) {
      fetch(`http://localhost:8080/api/sucursal/lista-sucursal/${empresa.idEmpresa}`)
        .then(response => response.json())
        .then(data => {
          // Mapear los datos recibidos al formato de sucursal
          const formattedData: Sucursal[] = data.map((sucursal: any) => ({
            id: sucursal.id,
            nombre: sucursal.nombre,
          }));
          setSucursales(formattedData);
        })
        .catch(error => console.error("Error fetching sucursales:", error));
    }
  }, [empresa]);

  const handleChange = (selectedSucs: string[]) => {
    console.log('Selected:', selectedSucs);
    setSelectedSucursales(selectedSucs); // Establece directamente los IDs seleccionados
  };

  return (
    <Checkbox.Group onChange={handleChange}>
      {sucursales.map(sucursal => (
        <Checkbox key={sucursal.id} value={sucursal.id}>
          {sucursal.nombre}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};

export default AgregarSucursalACatgoria;
