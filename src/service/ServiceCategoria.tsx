export const MostrarTodasLasCategorias = () => {
  fetch("/traer-todo/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Aquí puedes manejar los datos, por ejemplo, estableciendo el estado de tu componente
    })
    .catch((error) => {
      console.error("Error:", error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
    });
};

export const buscarCategoriaXId = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8080/api/categorias/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener los pedidos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Re-lanzar el error para manejarlo en otra parte de tu aplicación
  }
};
