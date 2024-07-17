import { Tree, Button, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";

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
  availableCategories: Category[]; // Add availableCategories as prop
  onCategoryAssociated: () => void; // Add callback function as prop
};

const AsociarCategoriaTree: React.FC<CategoryInputProps> = ({
  //selectedEmpresa,
  selectedSucursal,
  availableCategories,
  onCategoryAssociated,
}) => {
  const handleAsociar = async (categoriaId: number) => {
    if (!selectedSucursal) return;

    try {
      const url = `http://localhost:8080/api/local/agregarSucursalACategoria/${categoriaId}/${selectedSucursal}`;
      const response = await fetch(url, { method: "POST" });

      if (response.ok) {
        message.success("Categoría asociada exitosamente");
        onCategoryAssociated(); // Call the callback function to update categories
      } else {
        message.error("Error al asociar la categoría");
      }
    } catch (error) {
      console.error("Error al asociar la categoría:", error);
      message.error("Error al asociar la categoría");
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
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleAsociar(item.id)}
            >
              Asociar
            </Button>
          </div>
        }
        key={item.id}
        style={{ color: item.eliminado ? "gray" : "inherit" }}
      >
        {item.subCategoriaDtos && renderTreeNodes(item.subCategoriaDtos)}
        {item.subSubCategoriaDtos && renderTreeNodes(item.subSubCategoriaDtos)}
      </TreeNode>
    ));

  return (
    <div>
      <Tree>{renderTreeNodes(availableCategories)}</Tree>
    </div>
  );
};

export default AsociarCategoriaTree;
