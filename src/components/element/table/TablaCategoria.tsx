import { useState, useEffect } from "react";
import { Button, Input, Modal, Tree, Switch } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import sinImagen from "../../../assets/sin-imagen.jpg";

const { TreeNode } = Tree;

type Category = {
  id: number;
  denominacion: string;
  eliminado?: boolean;
  subCategoriaDtos?: Category[];
  subSubCategoriaDtos?: Category[];
  sucursalId?: string;
  urlIcono?: string;
};

type CategoryInputProps = {
  selectedEmpresa: string | null;
};

const TablaCategoria: React.FC<CategoryInputProps> = ({ selectedEmpresa }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>("");

  const [, setEditingSubcategory] = useState<Category | null>(null);
  const [, setEditSubcategoryName] = useState<string>("");
  const [updateKey, setUpdateKey] = useState<number>(Date.now());
  const [addSubcategoryModalVisible, setAddSubcategoryModalVisible] =
    useState<boolean>(false);
  const [denominacion, setDenominacion] = useState<string>("");
  const [imagenBase64, setImagenBase64] = useState<string | undefined>(
    undefined
  );

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const base64String = (reader.result as string).replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          setImagenBase64(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [selectedParentCategory, setSelectedParentCategory] =
    useState<Category | null>(null);

  useEffect(() => {
    if (selectedEmpresa !== null) {
      fetchCategories();
    }
  }, [selectedEmpresa, updateKey]);

  const fetchCategories = async () => {
    try {
      if (!selectedEmpresa) return;

      const url = `http://localhost:8080/api/categorias/porEmpresa/${selectedEmpresa}`;
      const response = await fetch(url);
      const data: Category[] = await response.json();

      const sortedData = data.sort((a, b) => a.id - b.id);
      setCategories(sortedData);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.denominacion);
    setUpdateKey(Date.now());
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName("");
    setEditingSubcategory(null);
    setEditSubcategoryName("");
  };

  const handleSaveEdit = async () => {
    try {
      if (editingCategory === null) {
        throw new Error("No se puede editar la categoría seleccionada");
      }

      const url = `http://localhost:8080/api/categorias/${editingCategory.id}/denominacion`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urlIcono: imagenBase64,
          denominacion: editCategoryName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      // Actualiza el estado local
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === editingCategory.id
            ? { ...category, denominacion: editCategoryName }
            : category
        )
      );

      setUpdateKey(Date.now());
      handleCancelEdit();
    } catch (error: any) {
      Modal.error({
        title: "Error al editar",
        content: `Ya existe ese nombre de categoría.`,
      });
    }
  };

  const handleSwitchChange = async (item: Category) => {
    try {
      const url = `http://localhost:8080/api/categorias/${item.id}/eliminado`;
      const response = await fetch(url, { method: "PUT" });
      if (response.ok) {
        // Actualiza el estado local
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === item.id
              ? { ...category, eliminado: !category.eliminado }
              : category
          )
        );
        setUpdateKey(Date.now());
        console.log("Categoría actualizada:", item.eliminado);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar la categoría");
      }
    } catch (error: any) {
      console.error("Error al eliminar:", error.message);
      throw error;
    }
  };

  const openAddSubcategoryModal = (category: Category) => {
    setSelectedParentCategory(category);
    setAddSubcategoryModalVisible(true);
  };

  const handleAddSubcategory = async () => {
    try {
      if (selectedParentCategory === null)
        throw new Error("No se ha seleccionado una categoría padre");

      const response = await fetch(
        `http://localhost:8080/api/categorias/subcategoriaConEmpresa`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            urlIcono: imagenBase64,
            denominacion: denominacion,
            idCategoriaPadre: selectedParentCategory.id,
            idEmpresaCategoriaPadre: selectedEmpresa,
          }),
        }
      );
      setImagenBase64(undefined);
      setDenominacion("");

      if (response.ok) {
        setUpdateKey(Date.now());
        setAddSubcategoryModalVisible(false);
      } else {
        Modal.error({
          title: "Error al agregar subcategoría",
          content: "Ya existe una categoria con ese nombre",
        });
      }
    } catch (error: any) {
      console.error("Error al agregar subcategoria:", error.message);
      throw error;
    }
  };

  const handleCancelAddSubcategory = () => {
    setAddSubcategoryModalVisible(false);
    setSelectedParentCategory(null);
  };

  const renderTreeNodes = (data: Category[]): React.ReactNode =>
    data.map((item) => {
      const imageUrl = item.urlIcono
        ? item.urlIcono.replace(
            "src\\main\\resources\\images\\",
            "http://localhost:8080/images/"
          )
        : sinImagen;

      return (
        <TreeNode
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={imageUrl}
                alt="Icono"
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <span
                style={{
                  textDecoration: item.eliminado ? "line-through" : "none",
                }}
              >
                {item.denominacion}
              </span>
              <Switch
                checked={!item.eliminado}
                onChange={() => handleSwitchChange(item)}
                style={{
                  marginLeft: 10,
                  backgroundColor: item.eliminado ? "red" : "green",
                }}
              />
              <Button
                onClick={() => handleEditCategory(item)}
                type="primary"
                icon={<EditOutlined />}
                disabled={item.eliminado}
                style={{ marginLeft: 10 }}
              />
              <Button
                onClick={() => openAddSubcategoryModal(item)}
                type="primary"
                icon={<PlusOutlined />}
                disabled={item.eliminado}
                style={{ marginLeft: 10 }}
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
      );
    });

  return (
    <div>
      <Tree>{renderTreeNodes(categories)}</Tree>
      {editingCategory && (
        <Modal
          title="Editar Categoría"
          visible={!!editingCategory}
          onCancel={handleCancelEdit}
          onOk={handleSaveEdit}
        >
          <Input
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
          />

          <Input
            type="file"
            onChange={handleImagenChange}
            accept="image/*"
            style={{ marginTop: 20 }}
          />

          {imagenBase64 && (
            <div style={{ marginTop: 20 }}>
              <img src={imagenBase64} alt="Preview" style={{ maxWidth: 200 }} />
            </div>
          )}
        </Modal>
      )}
      <Modal
        title="Agregar SubCategoría"
        visible={addSubcategoryModalVisible}
        onCancel={handleCancelAddSubcategory}
        onOk={handleAddSubcategory}
      >
        <p>
          ¿Desea agregar una nueva subcategoría a{" "}
          {selectedParentCategory?.denominacion}?
        </p>
        <Input
          placeholder="Ingrese la denominación de la subcategoría"
          onChange={(e) => setDenominacion(e.target.value)}
        />

        <Input
          type="file"
          onChange={handleImagenChange}
          accept="image/*"
          style={{ marginTop: 20 }}
        />

        {imagenBase64 && (
          <div style={{ marginTop: 20 }}>
            <img src={imagenBase64} alt="Preview" style={{ maxWidth: 200 }} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TablaCategoria;
