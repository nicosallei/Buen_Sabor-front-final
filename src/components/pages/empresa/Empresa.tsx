// Empresa.tsx

import { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Card, Modal, Switch, message } from "antd";
import { useNavigate } from "react-router-dom";
import imagenEmpresa from "../../../util/empresa.jpeg";
import TarjetaAgregar from "../../element/tarjeta/TarjetaAgregar";
import FormularioModificarEmpresa from "../../element/formularios/FormularioEditarEmpresa";
import {
  getTodasEmpresas,
  Empresas as EmpresasInterface,
  eliminarEmpresa,
} from "../../../service/ServiceEmpresa";

const { Meta } = Card;

const Empresa = () => {
  const [empresas, setEmpresas] = useState<EmpresasInterface[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [reloadTable, setReloadTable] = useState(false);

  const navigate = useNavigate();
  const cargarDatosEmpresa = async () => {
    try {
      const response = await getTodasEmpresas();
      getTodasEmpresas().then((empresas) => {
        const empresasTransformadas = empresas.map((empresa) => {
          if (empresa.imagen) {
            return {
              ...empresa,
              imagen: empresa.imagen.replace(
                "src\\main\\resources\\images\\",
                "http://localhost:8080/images/"
              ),
            };
          }
          return empresa;
        });
        setEmpresas(empresasTransformadas);
      });
      setEmpresas(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setEmpresas([]);
    }
  };

  useEffect(() => {
    cargarDatosEmpresa();
    //getTodasEmpresas().then(setEmpresas);
  }, [reloadTable]);

  const openEditModal = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
    setSelectedEmpresa(null);
  };

  const handleSwitchChange = async (
    checked: boolean,
    id: number | undefined
  ) => {
    console.log("Switch estado:", checked, "para empresa ID:", id);

    try {
      if (id !== undefined) {
        let response;

        if (checked) {
          response = await eliminarEmpresa(id);
        } else {
          response = await eliminarEmpresa(id);
        }

        if (response.ok) {
          const updatedEmpresas = empresas.map((empresa) =>
            empresa.id === id ? { ...empresa, eliminado: !checked } : empresa
          );
          setEmpresas(updatedEmpresas);
          message.success(
            checked
              ? "Empresa reactivada correctamente."
              : "Empresa eliminada correctamente."
          );
        } else {
          message.error(
            checked
              ? "No se pudo reactivar la empresa. Por favor, inténtalo de nuevo."
              : "No se pudo eliminar la empresa. Por favor, inténtalo de nuevo."
          );
        }
      } else {
        message.error("El ID de la empresa es indefinido.");
      }
    } catch (error) {
      console.error(
        checked ? "Error al reactivar empresa:" : "Error al eliminar empresa:",
        error
      );
      message.error(
        checked
          ? "Error al reactivar la empresa. Por favor, inténtalo de nuevo más tarde."
          : "Error al eliminar la empresa. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };
  useEffect(() => {
    getTodasEmpresas().then((empresas) => {
      const empresasTransformadas = empresas.map((empresa) => {
        if (empresa.imagen) {
          return {
            ...empresa,
            imagen: empresa.imagen.replace(
              "src\\main\\resources\\images\\",
              "http://localhost:8080/images/"
            ),
          };
        }
        return empresa;
      });
      setEmpresas(empresasTransformadas);
    });
  }, [reloadTable]);

  const handleFormSubmit = () => {
    setReloadTable(!reloadTable);
  };

  return (
    <div>
      <h1>Empresas</h1>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        {empresas.map((empresa) => (
          <Card
            key={empresa.id}
            style={{
              width: 300,
              height: "100%",
              margin: "10px",
              opacity: empresa.eliminado ? 0.5 : 1,
            }}
            cover={
              <img
                alt={empresa.nombre}
                src={empresa.imagen ? empresa.imagen : imagenEmpresa}
                onClick={() =>
                  empresa.eliminado ? null : navigate(`/sucursal/${empresa.id}`)
                }
                style={{
                  cursor: empresa.eliminado ? "default" : "pointer",
                  width: "100%",
                  height: "auto",
                  maxHeight: "200px",
                }}
              />
            }
            actions={[
              <Switch
                key="switch"
                onChange={(checked) => handleSwitchChange(checked, empresa.id)}
                checked={!empresa.eliminado}
                checkedChildren="Activa"
                unCheckedChildren="Eliminada"
              />,
              <EditOutlined
                key="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!empresa.eliminado) {
                    openEditModal(empresa);
                  }
                }}
                style={{ cursor: empresa.eliminado ? "default" : "pointer" }}
              />,
            ]}
          >
            <Meta title={empresa.nombre} description={empresa.razonSocial} />
          </Card>
        ))}
        <TarjetaAgregar onSucursalAdded={cargarDatosEmpresa} />
      </div>

      {selectedEmpresa && (
        <Modal
          title="Modificar Empresa"
          visible={modalVisible}
          onCancel={closeEditModal}
          footer={null}
        >
          <FormularioModificarEmpresa
            empresa={selectedEmpresa}
            onClose={closeEditModal}
            onSubmit={handleFormSubmit}
          />
        </Modal>
      )}
    </div>
  );
};

export default Empresa;
