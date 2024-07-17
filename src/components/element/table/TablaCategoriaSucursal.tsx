import { useState, useEffect } from "react";
import { Tree, FloatButton, Modal, Button, message } from "antd";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import AsociarCategoriaTree from "../../tree/AsociarCategoriaTree";

const { TreeNode } = Tree;

type Category = {
  id: number;
  denominacion: string;
  eliminado?: boolean;
  subCategoriaDtos?: Category[];
  subSubCategoriaDtos?: Category[];
  sucursalId?: string;
};

type CategoryInputProps = {
  selectedEmpresa: string | null;
  selectedSucursal: string | null;
};

const ArbolCategoriaPorSucursal: React.FC<CategoryInputProps> = ({
  selectedEmpresa,
  selectedSucursal,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [updateKey, setUpdateKey] = useState<number>(Date.now());

  useEffect(() => {
    if (selectedEmpresa !== null && selectedSucursal !== null) {
      fetchCategories();
      fetchAvailableCategories();
    }
  }, [selectedEmpresa, selectedSucursal, updateKey]);

  const fetchCategories = async () => {
    try {
      if (!selectedEmpresa || !selectedSucursal) return;

      //const url = `http://localhost:8080/api/local/traerTodoCategoria/${selectedSucursal}`;
      const url = `http://localhost:8080/api/categorias/categoriasPadre/${selectedSucursal}`;
      const response = await fetch(url);
      const data: Category[] = await response.json();

      const sortedData = data.sort((a, b) => a.id - b.id);
      setCategories(sortedData);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const fetchAvailableCategories = async () => {
    try {
      if (!selectedEmpresa || !selectedSucursal) return;

      const url = `http://localhost:8080/api/local/traerCategoriasNoAsociadasASucursal/${selectedSucursal}/${selectedEmpresa}`;
      const response = await fetch(url);
      const data: Category[] = await response.json();

      const sortedData = data.sort((a, b) => a.id - b.id);
      setAvailableCategories(sortedData);
    } catch (error) {
      console.error("Error al obtener las categorías no asociadas:", error);
    }
  };

  const handleDelete = async (categoriaId: number) => {
    if (!selectedSucursal) return;

    try {
      const url = `http://localhost:8080/api/local/desasociarSucursalDeCategoria/${categoriaId}/${selectedSucursal}`;
      const response = await fetch(url, { method: "POST" });

      if (response.ok) {
        message.success("Categoría desasociada exitosamente");
        // Trigger a refresh of the categories
        setUpdateKey(Date.now());
      } else {
        message.error("Error al desasociar la categoría");
      }
    } catch (error) {
      console.error("Error al desasociar la categoría:", error);
      message.error("Error al desasociar la categoría");
    }
  };

  const renderTreeNodes = (data: Category[]): React.ReactNode =>
    data.map((item) => (
      <TreeNode
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                textDecoration: item.eliminado ? "line-through" : "none",
              }}
            >
              {item.denominacion}
            </span>
            <Button
              icon={<DeleteOutlined />}
              type="text"
              onClick={() => handleDelete(item.id)}
            />
          </div>
        }
        key={item.id}
        style={{ color: item.eliminado ? "gray" : "inherit" }}
      >
        {item.subCategoriaDtos &&
          item.subCategoriaDtos.length > 0 &&
          renderTreeNodes(item.subCategoriaDtos)}
        {item.subSubCategoriaDtos &&
          item.subSubCategoriaDtos.length > 0 &&
          renderTreeNodes(item.subSubCategoriaDtos)}
      </TreeNode>
    ));

  const showModal = () => {
    fetchAvailableCategories(); // Ensure available categories are fetched before showing the modal
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    fetchCategories(); // Actualizar la tabla al confirmar en el modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCategoryAssociation = () => {
    fetchAvailableCategories();
    setUpdateKey(Date.now());
  };

  return (
    <div>
      {categories.length === 0 ? (
        <p>No hay categorías asociadas a esta sucursal.</p>
      ) : (
        <Tree>{renderTreeNodes(categories)}</Tree>
      )}
      <FloatButton.Group shape="circle" style={{ right: 40 }}>
        <FloatButton icon={<CheckOutlined />} onClick={showModal} />
      </FloatButton.Group>
      <Modal
        title="Asociar Categoria"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <AsociarCategoriaTree
          selectedEmpresa={selectedEmpresa}
          selectedSucursal={selectedSucursal}
          availableCategories={availableCategories} // Pass available categories as props
          onCategoryAssociated={handleCategoryAssociation} // Pass callback function as prop
        />
      </Modal>
    </div>
  );
};

export default ArbolCategoriaPorSucursal;
